import {inject, injectable} from "inversify";
import "reflect-metadata";
import {Socket} from "socket.io";
import * as uuid from "uuid/v4";
import {RoomInteractionMessage, WebsocketMessage} from "../../../../../common/communication/messages/message";
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

    public constructor(@inject(types.DataBaseService) private databaseService: DataBaseService) {
        this._rooms = new Map<string, IGameRoom>();
    }

    private readonly _rooms: Map<string, IGameRoom>;

    public async createGameRoom(socket: Socket, gameName: string, playerCount: number): Promise<void> {
        try {
            let room: IGameRoom;
            const roomId: string = uuid();

            if (await this.databaseService.simpleGames.contains(gameName)) {
                room = new SimpleGameRoom(roomId, await this.databaseService.simpleGames.getFromId(gameName), playerCount);
            } else if (await this.databaseService.freeGames.contains(gameName)) {
                room = new FreeGameRoom(roomId, await this.databaseService.freeGames.getFromId(gameName), playerCount);
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
        if (room.empty) {
            this.deleteRoom(room);
            this.pushRooms(socket);
        } else if (room.vacant && room.ongoing) {
            // TODO kick and notify connected clients
            sendToRoom(SocketEvent.KICK, undefined, room.id, socket);
        }
    }

    private checkInClient(socket: Socket, room: IGameRoom): void {
        try {
            room.checkIn(socket.id);
            socket.join(room.id);
            this.registerGameRoomHandlers(socket, room);
            this.pushRooms(socket);
        } catch (e) {
            socket.emit(SocketEvent.ROOM_ERROR, e);
        }
    }

    private deleteRoom(room: IGameRoom): void {
        this._rooms.delete(room.id);
    }

    private pushRooms(socket: Socket): void {
        broadcast(SocketEvent.PUSH_ROOMS, this.fetchGameRooms(), socket);
    }
}
