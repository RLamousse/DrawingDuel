import {IGame} from "../../../../../common/model/game/game";
import {IGameRoom, IInteractionData} from "../../../model/room/game-room";

export abstract class AbstractGameRoom<T extends IGame> implements IGameRoom {

    protected readonly _id: string;
    protected readonly _game: T;
    protected readonly _nbPlayers: number;

    protected _connectedPlayers: string[];

    public constructor(id: string, game: T, nbPlayers: number = 1) {
        this._id = id;
        this._game = game;
        this._nbPlayers = nbPlayers;
    }

    public abstract interact(interactionData: IInteractionData): void;

    public join(clientId: string): void {
        this._connectedPlayers.push(clientId);
        // TODO Handle full
    }

    public leave(clientId: string): void {
        this._connectedPlayers = this._connectedPlayers.filter((id: string) => id !== clientId);
        // TODO Handle empty
    }

    public get gameName(): string {
        return this._game.gameName;
    }

    public get vacant(): boolean {
        return this._connectedPlayers.length < this._nbPlayers;
    }

}
