import {inject, injectable} from "inversify";
import "reflect-metadata";
import {Socket} from "socket.io";
import * as uuid from "uuid/v4";
import {
    PlayerCountMessage,
    RoomInteractionMessage,
    WebsocketMessage
} from "../../../../../common/communication/messages/message";
import {SocketEvent} from "../../../../../common/communication/socket-events";
import {NonExistentGameError} from "../../../../../common/errors/database.errors";
import {GameRoomCreationError, NonExistentRoomError} from "../../../../../common/errors/services.errors";
import {IInteractionResponse} from "../../../../../common/model/rooms/interaction";
import {IRoomInfo} from "../../../../../common/model/rooms/room-info";
import {IGameRoom} from "../../../model/room/game-room";
import types from "../../../types";
import {broadcast, sendToRoom} from "../../../util/socket.util";
import {DataBaseService} from "../../data-base.service";
import {FreeGameRoom} from "./free-game-room";
import {SimpleGameRoom} from "./simple-game-room";

@injectable()
export class HotelRoomService {

    private readonly _rooms: Map<string, IGameRoom>;
    private readonly _sockets: Map<Socket, string>;

    public constructor(@inject(types.DataBaseService) private databaseService: DataBaseService) {
        this._rooms = new Map<string, IGameRoom>();
    }

    private static playerCountFromMessage(playerCountMessage: PlayerCountMessage): number {
        const multi: number = 2;
        const solo: number = 1;

        return playerCountMessage === PlayerCountMessage.SOLO ? solo : multi;
    }

    public async createGameRoom(socket: Socket, gameName: string, playerCount: PlayerCountMessage): Promise<void> {
        try {
            let room: IGameRoom;
            const roomId: string = uuid();

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
            this._rooms.set(roomId, room);

            this.checkInClient(socket, room);
        } catch (error) {
            throw new GameRoomCreationError();
        }
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

    private registerGameRoomHandlers(socket: Socket, room: IGameRoom): void {
        // TODO test .in().on()
        socket.in(room.id).on(SocketEvent.INTERACT, (message: WebsocketMessage<RoomInteractionMessage>) => {
            room.interact(socket.id, message.body.interactionData)
                .then((interactionResponse: IInteractionResponse) => {
                    sendToRoom(SocketEvent.INTERACT, interactionResponse, room.id, socket);
                })
                .catch((error: Error) => {
                    socket.emit(SocketEvent.INTERACT, error);
                    // TODO Send error to chat
                });
        });
        socket.in(room.id).on(SocketEvent.CHECK_OUT, () => {
            this.handleCheckout(room, socket);
        });
        socket.in(room.id).on(SocketEvent.READY, (message: WebsocketMessage) => {
            room.handleReady(socket.id);
        });
        socket.in(room.id).on(SocketEvent.DISCONNECT, () => {
            this.handleCheckout(room, socket);
        });

        room.setOnReadyCallBack(() => {
            sendToRoom(SocketEvent.READY, undefined, room.id, socket);
        });
    }

    private handleCheckout(room: IGameRoom, socket: Socket): void {
        socket.leave(room.id);
        room.checkOut(socket.id);
        if (room.vacant && room.ongoing) {
            sendToRoom(SocketEvent.KICK, undefined, room.id, socket);
            this.kickClients(room.id);
        }
        this.deleteRoom(room);
        this.pushRoomsToClients(socket);
    }

    private checkInClient(socket: Socket, room: IGameRoom): void {
        try {
            room.checkIn(socket.id);
            socket.join(room.id);
            this._sockets.set(socket, room.id);
            this.registerGameRoomHandlers(socket, room);
            this.pushRoomsToClients(socket);
        } catch (e) {
            socket.emit(SocketEvent.ROOM_ERROR, e);
        }
    }

    private deleteRoom(room: IGameRoom): void {
        this._rooms.delete(room.id);
    }

    private pushRoomsToClients(socket: Socket): void {
        broadcast(SocketEvent.PUSH_ROOMS, this.fetchGameRooms(), socket);
    }

    private kickClients(roomId: string): void {
        Array.from(this._sockets.entries())
            .filter((entry: [Socket, string]) => entry[1] === roomId)
            .map((entry: [Socket, string]) => entry[0])
            .forEach((socket: Socket) => socket.leave(roomId));
    }
}
