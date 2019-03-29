import {injectable} from "inversify";
import "reflect-metadata";
import {IGameRoom} from "../../../model/room/game-room";

export interface IRoomInfo {
    gameName: string;
    vacant: boolean;
}

@injectable()
export class HotelRoomService {

    private readonly _rooms: Map<string, IGameRoom>;

    public constructor() {
        this._rooms = new Map<string, IGameRoom>();
    }

    public checkInGameRoom(): void {
        // TODO Create a room
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

    public joinGameRoom(): void {
        // TODO Add player to room
    }

    public handleGameRoomRequests(): void {
        // TODO forward calls to rooms
    }
}
