import {GameRoomError, NoVacancyGameRoomError} from "../../../../../common/errors/services.errors";
import {IGame} from "../../../../../common/model/game/game";
import {IGameState} from "../../../../../common/model/game/game-state";
import {IInteractionData, IInteractionResponse} from "../../../../../common/model/rooms/interaction";
import {ReadyInfo} from "../../../../../common/model/rooms/ready-info";
import {IGameRoom} from "../../../model/room/game-room";

export abstract class AbstractGameRoom<T extends IGame, U extends IGameState> implements IGameRoom {

    private readonly _id: string;
    protected readonly _game: T;
    protected readonly _playerCapacity: number;
    protected readonly _gameStates: Map<string, U>;

    private _onReady: () => void;
    protected _connectedPlayers: Map<string, boolean>;
    protected _ongoing: boolean;

    protected constructor(id: string, game: T, playerCapacity: number = 1) {
        this._id = id;
        this._game = game;
        this._playerCapacity = playerCapacity;
        this._gameStates = new Map();
        this._connectedPlayers = new Map();
        this._ongoing = false;
    }

    public async abstract interact(clientId: string, interactionData: IInteractionData): Promise<IInteractionResponse>;

    public checkIn(clientId: string): void {
        if (!this.vacant) {
            throw new NoVacancyGameRoomError();
        }

        this._connectedPlayers.set(clientId, true);
    }

    public checkOut(clientId: string): void {
        this._connectedPlayers.delete(clientId);
        this._gameStates.delete(clientId);
    }

    public handleReady(clientId: string): void {
        if (this._connectedPlayers.has(clientId)) {
            this._connectedPlayers.set(clientId, true);
        }

        if (this._connectedPlayers.size === this._playerCapacity && this.isEveryClientReady()) {
            this._ongoing = true;
            this._onReady();
        }
    }

    public get gameName(): string {
        return this._game.gameName;
    }

    public get vacant(): boolean {
        return this._connectedPlayers.size < this._playerCapacity;
    }

    public get empty(): boolean {
        return this._connectedPlayers.size === 0;
    }

    public get id(): string {
        return this._id;
    }

    public get ongoing(): boolean {
        return this._ongoing;
    }

    public setOnReadyCallBack(callback: () => void): void {
        this._onReady = callback;
    }

    public get playerCapacity(): number {
        return this._playerCapacity;
    }

    protected getGameStateForClient(clientId: string): U {
        const clientGameState: U | undefined = this._gameStates.get(clientId);

        if (clientGameState === undefined) {
            throw new GameRoomError();
        }

        return clientGameState;
    }

    private isEveryClientReady(): boolean {
        return Array.from(this._connectedPlayers.values())
            .every((isClientReady: boolean) => isClientReady);
    }

    public get roomReadyEmitInformation(): ReadyInfo {
        return "";
    }
}
