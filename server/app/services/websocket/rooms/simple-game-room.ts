import {ISimpleGame} from "../../../../../common/model/game/simple-game";
import ISimpleGameState from "../../../../../common/model/game/simple-game-state";
import {ISimpleGameInteractionData} from "../../../../../common/model/rooms/interaction";
import {AbstractGameRoom} from "./abstract-game-room";

export class SimpleGameRoom extends AbstractGameRoom<ISimpleGame> {

    private readonly _gameStates: Map<string, ISimpleGameState>;

    public constructor(id: string, game: ISimpleGame, nbPlayers: number = 1) {
        super(id, game, nbPlayers);
        this._gameStates = new Map();
    }

    public join(clientId: string): void {
        super.join(clientId);
        this._gameStates.set(
            clientId,
            {
                foundDifferenceClusters: [],
            });
    }

    public interact(interactionData: ISimpleGameInteractionData): void {
        // TODO handle interaction
    }

}
