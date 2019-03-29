import {IFreeGame} from "../../../../../common/model/game/free-game";
import IFreeGameState from "../../../../../common/model/game/free-game-state";
import {IInteractionData} from "../../../model/room/game-room";
import {AbstractGameRoom} from "./abstract-game-room";

export interface ISimpleGameInteractionData extends IInteractionData {
    coord: number[];
}

export class FreeGameRoom extends AbstractGameRoom<IFreeGame> {

    private readonly _gameStates: Map<string, IFreeGameState>;

    public constructor(id: string, game: IFreeGame, nbPlayers: number = 1) {
        super(id, game, nbPlayers);
        this._gameStates = new Map();
    }

    public join(clientId: string): void {
        super.join(clientId);
        this._gameStates.set(
            clientId,
            {
                foundDifference: [],
            });
    }

    public interact(interactionData: ISimpleGameInteractionData): void {
        // TODO handle interaction
    }

}
