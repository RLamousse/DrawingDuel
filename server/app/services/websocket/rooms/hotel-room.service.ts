import {inject, injectable} from "inversify";
import "reflect-metadata";
import {Socket} from "socket.io";
import * as uuid from "uuid/v4";
import {
    createWebsocketMessage,
    ChatMessage,
    ChatMessagePosition,
    ChatMessageType,
    RoomInteractionErrorMessage,
    RoomInteractionMessage,
    WebsocketMessage
} from "../../../../../common/communication/messages/message";
import {SocketEvent} from "../../../../../common/communication/socket-events";
import {NonExistentGameError} from "../../../../../common/errors/database.errors";
import {GameRoomCreationError, NonExistentRoomError} from "../../../../../common/errors/services.errors";
import {OnlineType} from "../../../../../common/model/game/game";
import {IInteractionResponse} from "../../../../../common/model/rooms/interaction";
import {ReadyInfo} from "../../../../../common/model/rooms/ready-info";
import {IRoomInfo} from "../../../../../common/model/rooms/room-info";
import {IGameRoom} from "../../../model/room/game-room";
import types from "../../../types";
import {DataBaseService} from "../../data-base.service";
import {UsernameService} from "../../username.service";
import {ChatWebsocketActionService} from "../chat-websocket-action.service";
import {RadioTowerService} from "../radio-tower.service";
import {FreeGameRoom} from "./free-game-room";
import {SimpleGameRoom} from "./simple-game-room";

@injectable()
export class HotelRoomService {

    private readonly _rooms: Map<string, IGameRoom>;
    private readonly _sockets: Map<Socket, string>;
    private readonly _disconnectListeners: Map<string, () => Promise<void>>;

    public constructor(@inject(types.DataBaseService) private databaseService: DataBaseService,
                       @inject(types.RadioTowerService) private radioTower: RadioTowerService,
                       @inject(types.ChatWebsocketActionService) private chatAction: ChatWebsocketActionService,
                       @inject(types.UserNameService) protected userNameService: UsernameService) {
        this._rooms = new Map<string, IGameRoom>();
        this._sockets = new Map<Socket, string>();
        this._disconnectListeners = new Map<string, () => Promise<void>>();
    }

    private static playerCountFromMessage(playerCountMessage: OnlineType): number {
        const multi: number = 2;
        const solo: number = 1;

        return playerCountMessage === OnlineType.SOLO ? solo : multi;
    }

    private static onlineTypeFromPlayerCapacity(playerCount: number): OnlineType {
        const multi: OnlineType = OnlineType.MULTI;
        const solo: OnlineType.SOLO = OnlineType.SOLO;

        return playerCount === 1 ? solo : multi;
    }

    public async createGameRoom(socket: Socket, gameName: string, playerCount: OnlineType): Promise<void> {
        let room: IGameRoom;
        const roomId: string = uuid();

        try {
            if (await this.databaseService.simpleGames.contains(gameName)) {
                room = new SimpleGameRoom(
                    roomId,
                    gameName,
                    async () => this.databaseService.simpleGames.getFromId(gameName),
                    HotelRoomService.playerCountFromMessage(playerCount),
                );
            } else if (await this.databaseService.freeGames.contains(gameName)) {
                room = new FreeGameRoom(
                    roomId,
                    gameName,
                    async () => this.databaseService.freeGames.getFromId(gameName),
                    HotelRoomService.playerCountFromMessage(playerCount),
                );
            } else {
                return Promise.reject(new NonExistentGameError());
            }
        } catch (error) {
            return Promise.reject(new GameRoomCreationError());
        }

        this._rooms.set(roomId, room);
        this.checkInClient(socket, room);
    }

    public fetchGameRooms(): IRoomInfo[] {
        return Array.from(this._rooms.values())
            .map((room: IGameRoom) => {
                return {
                    gameName: room.gameName,
                    vacant: room.vacant,
                };
            });
    }

    public checkInGameRoom(socket: Socket, gameName: string): void {
        const roomCandidate: IGameRoom | undefined = Array.from(this._rooms.values())
            .find((room: IGameRoom) => {
                return room.gameName === gameName && room.vacant;
            });

        if (roomCandidate === undefined) {
            throw new NonExistentRoomError();
        }

        this.checkInClient(socket, roomCandidate);
    }

    private checkInClient(socket: Socket, room: IGameRoom): void {
        room.checkIn(socket.id);
        socket.join(room.id);
        this._sockets.set(socket, room.id);
        this.registerGameRoomHandlers(socket, room);
        this.pushRoomsToClients();
        this.radioTower.privateSend(SocketEvent.CHECK_IN, undefined, socket.id);
    }

    private async deleteRoom(roomToDelete: IGameRoom): Promise<void> {
        this._rooms.delete(roomToDelete.id);
        const gameName: string = roomToDelete.gameName;
        const hasSimilarRoomsOngoing: boolean = Array.from(this._rooms.values())
            .map((room: IGameRoom) => room.gameName)
            .some((roomName: string) => roomName === gameName);

        if (hasSimilarRoomsOngoing) {
            return;
        }

        if (await this.databaseService.simpleGames.documentCountWithQuery({gameName: gameName, toBeDeleted: true})) {
            await this.databaseService.simpleGames.delete(gameName);
        } else if (await this.databaseService.freeGames.documentCountWithQuery({gameName: gameName, toBeDeleted: true})) {
            await this.databaseService.freeGames.delete(gameName);
        }
    }

    private pushRoomsToClients(): void {
        this.radioTower.broadcast(SocketEvent.PUSH_ROOMS, createWebsocketMessage(this.fetchGameRooms()));
    }

    private kickClients(roomId: string): void {
        this.radioTower.sendToRoom(SocketEvent.KICK, undefined, roomId);
        Array.from(this._sockets.entries())
            .filter((entry: [Socket, string]) => entry[1] === roomId)
            .map((entry: [Socket, string]) => entry[0])
            .forEach((socket: Socket) => socket.leave(roomId));
    }

    private registerGameRoomHandlers(socket: Socket, room: IGameRoom): void {
        room.setOnReadyCallBack((roomInfo: ReadyInfo) => {
            this.radioTower.sendToRoom(SocketEvent.READY, createWebsocketMessage<ReadyInfo>(roomInfo), room.id);
        });

        socket.in(room.id).on(SocketEvent.READY, () => {
            try {
                room.handleReady(socket.id);
            } catch (e) {
                this.kickClients(room.id);
            }
        });

        socket.in(room.id).on(SocketEvent.INTERACT, <T>(message: WebsocketMessage<RoomInteractionMessage<T>>) => {
            this.handleInteraction(room, socket, message);
        });

        socket.in(room.id).on(SocketEvent.INTERACT_ERROR, <T>(message: WebsocketMessage<RoomInteractionErrorMessage>) => {
            this.handleInteractionError(message.body.errorMessage, socket, room);
        });

        socket.in(room.id).on(SocketEvent.CHECK_OUT, async () => {
            await this.handleCheckout(room, socket);
        });

        this.bindDisconnectListener(room, socket);
    }

    private handleInteraction<T>(room: IGameRoom, socket: Socket, message: WebsocketMessage<RoomInteractionMessage<T>>): void {
        room.interact(message.body.interactionData)
            .then((interactionResponse: IInteractionResponse) => {
                const chatMessage: ChatMessage = this.createInteractionChatMessage(room, socket);
                interactionResponse.initiatedBy = chatMessage.playerName;
                this.chatAction.sendChat(chatMessage, room.id);
                this.radioTower.sendToRoom(SocketEvent.INTERACT, createWebsocketMessage(interactionResponse), room.id);
            })
            .catch((error: Error) => {
                this.handleInteractionError(error.message, socket, room);
            });
    }

    private createInteractionChatMessage(room: IGameRoom, socket: Socket): ChatMessage {
        return {
            gameName: room.gameName,
            playerCount: HotelRoomService.onlineTypeFromPlayerCapacity(room.playerCapacity),
            playerName: this.userNameService.getUsernameBySocketId(socket.id),
            position: ChatMessagePosition.NA,
            timestamp: new Date(),
            type: ChatMessageType.DIFF_FOUND,
        };
    }

    private handleInteractionError(errorMessage: string, socket: Socket, room: IGameRoom): void {
        this.radioTower.privateSend(SocketEvent.INTERACT_ERROR, createWebsocketMessage(errorMessage), socket.id);
        const chatMessage: ChatMessage = this.createInteractionChatMessage(room, socket);
        chatMessage.type = ChatMessageType.DIFF_ERROR;
        this.chatAction.sendChat(chatMessage, room.id);
    }

    private async handleCheckout(room: IGameRoom, socket: Socket): Promise<void> {
        this.removeDisconnectListener(socket);
        socket.removeAllListeners(SocketEvent.INTERACT);
        socket.removeAllListeners(SocketEvent.READY);
        socket.removeAllListeners(SocketEvent.CHECK_OUT);
        socket.leave(room.id);
        room.checkOut(socket.id);
        if (room.vacant && room.ongoing) {
            this.kickClients(room.id);
        }
        await this.deleteRoom(room);
        this.pushRoomsToClients();
    }

    private bindDisconnectListener(room: IGameRoom, socket: Socket): void {
        const disconnectListener: () => Promise<void> = async () => this.handleCheckout(room, socket);
        this._disconnectListeners.set(socket.id, disconnectListener);
        socket.in(room.id).on(SocketEvent.DISCONNECT, disconnectListener);
    }

    private removeDisconnectListener(socket: Socket): void {
        const disconnectListenerCandidate: (() => Promise<void>) | undefined = this._disconnectListeners.get(socket.id);
        if (disconnectListenerCandidate) {
            socket.removeListener(SocketEvent.DISCONNECT, disconnectListenerCandidate);
            this._disconnectListeners.delete(socket.id);
        }
    }
}
