import {NoVacancyGameRoomError} from "../../../../../common/errors/services.errors";
import {IGame} from "../../../../../common/model/game/game";
import {IGameState} from "../../../../../common/model/game/game-state";
import {IInteractionData, IInteractionResponse} from "../../../../../common/model/rooms/interaction";
import {ReadyInfo} from "../../../../../common/model/rooms/ready-info";
import {IGameRoom} from "../../../model/room/game-room";

export abstract class AbstractGameRoom<T extends IGame, U extends IGameState> implements IGameRoom {

    private readonly _id: string;
    protected readonly _game: T;
    protected readonly _playerCapacity: number;

    protected readonly _gameState: U;
    private _onReady: (roomInfo: ReadyInfo) => void;
    protected _connectedPlayers: Map<string, boolean>;
    protected _ongoing: boolean;

    protected constructor(id: string, game: T, playerCapacity: number = 1, gameState: U) {
        this._id = id;
        this._game = game;
        this._playerCapacity = playerCapacity;
        this._gameState = gameState;
        this._connectedPlayers = new Map();
        this._ongoing = false;
    }

    public async abstract interact(interactionData: IInteractionData): Promise<IInteractionResponse>;

    public checkIn(clientId: string): void {
        if (!this.vacant) {
            throw new NoVacancyGameRoomError();
        }

        this._connectedPlayers.set(clientId, true);
    }

    public checkOut(clientId: string): void {
        this._connectedPlayers.delete(clientId);
    }

    public handleReady(clientId: string): void {
        if (this._connectedPlayers.has(clientId)) {
            this._connectedPlayers.set(clientId, true);
        }

        if (this._connectedPlayers.size === this._playerCapacity && this.isEveryClientReady()) {
            this._ongoing = true;
            this._onReady(this.roomReadyEmitInformation);
        }
    }

    public setOnReadyCallBack(callback: (roomInfo: ReadyInfo) => void): void {
        this._onReady = callback;
    }

    private isEveryClientReady(): boolean {
        return Array.from(this._connectedPlayers.values())
            .every((isClientReady: boolean) => isClientReady);
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

    public get playerCapacity(): number {
        return this._playerCapacity;
    }

    protected get roomReadyEmitInformation(): ReadyInfo {
        return {};
    }
}
