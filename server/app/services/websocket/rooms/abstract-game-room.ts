import {GameRoomError, NoVacancyGameRoomError} from "../../../../../common/errors/services.errors";
import {IGame} from "../../../../../common/model/game/game";
import {IGameState} from "../../../../../common/model/game/game-state";
import {IInteractionData, IInteractionResponse} from "../../../../../common/model/rooms/interaction";
import {IGameRoom} from "../../../model/room/game-room";

export abstract class AbstractGameRoom<T extends IGame, U extends IGameState> implements IGameRoom {

    private readonly _id: string;
    protected readonly _game: T;
    protected readonly _playerCount: number;

    protected _connectedPlayers: string[];
    protected readonly _gameStates: Map<string, U>;

    protected constructor(id: string, game: T, nbPlayers: number = 1) {
        this._id = id;
        this._game = game;
        this._playerCount = nbPlayers;
        this._connectedPlayers = [];
        this._gameStates = new Map();
    }

    public async abstract interact(clientId: string, interactionData: IInteractionData): Promise<IInteractionResponse>;

    public join(clientId: string): void {
        if (!this.vacant) {
            throw new NoVacancyGameRoomError();
        }

        this._connectedPlayers.push(clientId);
    }

    public leave(clientId: string): boolean {
        this._connectedPlayers = this._connectedPlayers.filter((id: string) => id !== clientId);

        return this._connectedPlayers === [];
    }

    public get gameName(): string {
        return this._game.gameName;
    }

    public get vacant(): boolean {
        return this._connectedPlayers.length < this._playerCount;
    }

    public get id(): string {
        return this._id;
    }

    protected getGameStateForClient(clientId: string): U {
        const clientGameState: U | undefined = this._gameStates.get(clientId);

        if (clientGameState === undefined) {
            throw new GameRoomError();
        }

        return clientGameState;
    }
}
