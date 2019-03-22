import {Socket} from "socket.io";
import {RoomFullError} from "../../../../common/errors/socket.errors";
import {IGame} from "../../../../common/model/game/game";
import {IRoom, IRoomEvent} from "./room";

export abstract class SoloRoom<T extends IGame> implements IRoom {

    private _client: Socket;
    protected readonly _game: T;

    protected constructor(game: T) {
        this._game = game;
    }

    public join(gameName: string, client: Socket): void {
        if (this._client === null) {
            throw new RoomFullError();
        }

        this._client = client;
    }

    public leave(client: Socket): void {
        this._client = null;
    }

    abstract interact(event: IRoomEvent, client: Socket): void;
}
