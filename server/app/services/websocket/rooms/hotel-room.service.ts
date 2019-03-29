import {injectable} from "inversify";
import "reflect-metadata";
import {Socket} from "socket.io";
import {IRoomInfo} from "../../../../../common/model/rooms/room-info";
import {IGameRoom} from "../../../model/room/game-room";

@injectable()
export class HotelRoomService {

    private readonly _rooms: Map<string, IGameRoom>;

    public constructor() {
        this._rooms = new Map<string, IGameRoom>();
    }

    public checkInGameRoom(socket: Socket, gameName: string): void {
        // TODO Create a room

        // TODO Register handlers:
        this.registerGameRoomHandlers(socket);
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

    private registerGameRoomHandlers(socket: Socket): void {
        // TODO forward calls to rooms
        // socket.on(SocketEvent.INTERACT, (message: WebsocketMessage) => {
        //     this.hotelRoomService.registerGameRoomHandlers(socket);
        // });
        // socket.on(SocketEvent.CHECK_OUT, (message: WebsocketMessage) => {
        //     this.deleteAction.execute(message, socket);
        // });
        // socket.on(SocketEvent.READY, (message: WebsocketMessage) => {
        //     this.deleteAction.execute(message, socket);
        // });
    }
}
