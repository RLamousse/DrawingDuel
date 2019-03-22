import {injectable} from "inversify";
import {IRoom, RoomType} from "../utils/room/room";
import {RoomFactory} from "../utils/room/room-factory";

@injectable()
export class GameRoomService {

    private _rooms: IRoom[];

    public async createRoom(gameName: string, roomType: RoomType, gameType: GameType) {
        RoomFactory.createGameRoom(gameName, roomType)
            .then();
    }

    public clientLeaveRoom() {

    }

    public getRoom() {

    }

    public joinRoom() {

    }

    public handleAction() {

    }
}
