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
import {DataBaseService} from "../../data-base.service";
import {FreeGameRoom} from "./free-game-room";
import {SimpleGameRoom} from "./simple-game-room";

@injectable()
export class HotelRoomService {

    private readonly _rooms: Map<string, IGameRoom>;

    public constructor(@inject(types.DataBaseService) private databaseService: DataBaseService) {
        this._rooms = new Map<string, IGameRoom>();
    }

    public async createGameRoom(socket: Socket, gameName: string, playerCount: number): Promise<void> {
        try {
            let room: IGameRoom;
            const roomId: string = uuid();

            if (await this.databaseService.simpleGames.contains(gameName)) {
                // TODO fetch la game dans le constructeur? 
                room = new SimpleGameRoom(roomId, await this.databaseService.simpleGames.getFromId(gameName), playerCount);
            } else if (await this.databaseService.freeGames.contains(gameName)) {
                room = new FreeGameRoom(roomId, await this.databaseService.freeGames.getFromId(gameName), playerCount);
            } else {
                return Promise.reject(new NonExistentGameError());
            }
            this._rooms.set(roomId, room);

            this.registerGameRoomHandlers(socket, room);
            this.checkInGameRoom(socket, gameName);
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

        roomCandidate.checkIn(socket.id);
    }

    private registerGameRoomHandlers(socket: Socket, room: IGameRoom): void {
        socket.on(SocketEvent.INTERACT, (message: WebsocketMessage<RoomInteractionMessage>) => {
            room.interact(socket.id, message.body.interactionData)
                .then((interactionResponse: IInteractionResponse) => {
                    // TODO Notify
                })
                .catch((error: Error) => {
                    // TODO Notify
                });
        });
        socket.on(SocketEvent.CHECK_OUT, () => {
            this.handleCheckout(room, socket);
        });
        socket.on(SocketEvent.READY, (message: WebsocketMessage) => {
            // TODO
        });
        socket.on(SocketEvent.DISCONNECT, () => {
            // TODO verify if this doesn't override the onDisconnect already set uo
            this.handleCheckout(room, socket);
        });
    }

    private handleCheckout(room: IGameRoom, socket: Socket): void {
        if (room.checkOut(socket.id)) {
            this.deleteRoom(room);
        } else if (room.vacant) { // TODO verify that the game was initiated
            // TODO notify connected clients
        }
    }

    private deleteRoom(room: IGameRoom): void {
        this._rooms.delete(room.id);
        // TODO notify?
    }
}
