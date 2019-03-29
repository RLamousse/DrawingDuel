import {inject, injectable} from "inversify";
import "reflect-metadata";
import {Socket} from "socket.io";
import * as uuid from "uuid/v4";
import {RoomInteractionMessage, WebsocketMessage} from "../../../../../common/communication/messages/message";
import {SocketEvent} from "../../../../../common/communication/socket-events";
import {NonExistentGameError} from "../../../../../common/errors/database.errors";
import {GameRoomCreationError} from "../../../../../common/errors/services.errors";
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

    public async checkInGameRoom(socket: Socket, gameName: string, playerCount: number): Promise<void> {
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

            this.registerGameRoomHandlers(socket, room);
            this.joinGameRoom(socket, gameName);
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

    public joinGameRoom(socket: Socket, gameName: string): void {
        // TODO Add player to room
    }

    private registerGameRoomHandlers(socket: Socket, room: IGameRoom): void {
        socket.on(SocketEvent.INTERACT, (message: WebsocketMessage<RoomInteractionMessage>) => {
            room.interact(message.body.interactionData);
        });
        socket.on(SocketEvent.CHECK_OUT, () => {
            room.leave(socket.id);
        });
        socket.on(SocketEvent.READY, (message: WebsocketMessage) => {
            // TODO
        });
    }
}
