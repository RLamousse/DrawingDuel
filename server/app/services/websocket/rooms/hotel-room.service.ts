import {inject, injectable} from "inversify";
import "reflect-metadata";
import {Socket} from "socket.io";
import * as uuid from "uuid/v4";
import {
    ChatMessage,
    ChatMessagePosition,
    ChatMessageType,
    createWebsocketMessage,
    RoomInteractionMessage,
    WebsocketMessage
} from "../../../../../common/communication/messages/message";
import {SocketEvent} from "../../../../../common/communication/socket-events";
import {NonExistentGameError} from "../../../../../common/errors/database.errors";
import {GameRoomCreationError, NonExistentRoomError} from "../../../../../common/errors/services.errors";
import {OnlineType} from "../../../../../common/model/game/game";
import {IRoomInfo} from "../../../../../common/model/rooms/room-info";
import {IGameRoom} from "../../../model/room/game-room";
import types from "../../../types";
import {DataBaseService} from "../../data-base.service";
import {ChatWebsocketActionService} from "../chat-websocket-action.service";
import {RadioTowerService} from "../radio-tower.service";
import {FreeGameRoom} from "./free-game-room";
import {SimpleGameRoom} from "./simple-game-room";

@injectable()
export class HotelRoomService {

    private readonly _rooms: Map<string, IGameRoom>;
    private readonly _sockets: Map<Socket, string>;

    public constructor(@inject(types.DataBaseService) private databaseService: DataBaseService,
                       @inject(types.RadioTowerService) private radioTower: RadioTowerService,
                       @inject(types.ChatWebsocketActionService) private chatAction: ChatWebsocketActionService) {
        this._rooms = new Map<string, IGameRoom>();
        this._sockets = new Map<Socket, string>();
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
                    await this.databaseService.simpleGames.getFromId(gameName),
                    HotelRoomService.playerCountFromMessage(playerCount),
                );
            } else if (await this.databaseService.freeGames.contains(gameName)) {
                room = new FreeGameRoom(
                    roomId,
                    await this.databaseService.freeGames.getFromId(gameName),
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
    }

    private deleteRoom(room: IGameRoom): void {
        this._rooms.delete(room.id);
    }

    private pushRoomsToClients(): void {
        this.radioTower.broadcast(SocketEvent.PUSH_ROOMS, createWebsocketMessage(this.fetchGameRooms()));
    }

    private kickClients(roomId: string): void {
        Array.from(this._sockets.entries())
            .filter((entry: [Socket, string]) => entry[1] === roomId)
            .map((entry: [Socket, string]) => entry[0])
            .forEach((socket: Socket) => socket.leave(roomId));
    }

    private registerGameRoomHandlers(socket: Socket, room: IGameRoom): void {
        room.setOnReadyCallBack(() => {
            this.radioTower.sendToRoom(SocketEvent.READY, undefined, room.id);
        });

        socket.in(room.id).on(SocketEvent.READY, () => {
            room.handleReady(socket.id);
        });

        // TODO test .in().on()
        socket.in(room.id).on(SocketEvent.INTERACT, <T>(message: WebsocketMessage<RoomInteractionMessage<T>>) => {
            const chatMessage: ChatMessage = {
                gameName: room.gameName,
                playerCount: HotelRoomService.onlineTypeFromPlayerCapacity(room.playerCapacity),
                // TODO CHANGE THIS SHIT
                playerName: "Snoop Dogg",
                position: ChatMessagePosition.NA,
                timestamp: new Date(),
                type: ChatMessageType.DIFF_FOUND,
            };
            room.interact(socket.id, message.body.interactionData)
                .then((interactionResponse: T) => {
                    this.radioTower.sendToRoom(SocketEvent.INTERACT, createWebsocketMessage(interactionResponse), room.id);
                    this.chatAction.sendChat(chatMessage, room.id);
                })
                .catch((error: Error) => {
                    this.radioTower.privateSend(SocketEvent.INTERACT_ERROR, createWebsocketMessage(error.message), socket.id);
                    chatMessage.type = ChatMessageType.DIFF_ERROR;
                    this.chatAction.sendChat(chatMessage, room.id);
                });
        });
        socket.in(room.id).on(SocketEvent.CHECK_OUT, () => {
            this.handleCheckout(room, socket);
        });

        socket.in(room.id).on(SocketEvent.DISCONNECT, () => {
            this.handleCheckout(room, socket);
        });
    }

    private handleCheckout(room: IGameRoom, socket: Socket): void {
        socket.leave(room.id);
        socket.removeAllListeners(SocketEvent.INTERACT);
        room.checkOut(socket.id);
        if (room.vacant && room.ongoing) {
            this.radioTower.sendToRoom(SocketEvent.KICK, undefined, room.id);
            this.kickClients(room.id);
        }
        this.deleteRoom(room);
        this.pushRoomsToClients();
    }
}
