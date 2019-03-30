import {IFreeGame} from "../../../../../common/model/game/free-game";
import {IFreeGameState} from "../../../../../common/model/game/game-state";
import {IFreeGameInteractionData, IFreeGameInteractionResponse} from "../../../../../common/model/rooms/interaction";
import {AbstractGameRoom} from "./abstract-game-room";

export class FreeGameRoom extends AbstractGameRoom<IFreeGame, IFreeGameState> {

    public constructor(id: string, game: IFreeGame, nbPlayers: number = 1) {
        super(id, game, nbPlayers);
    }

    public join(clientId: string): void {
        super.join(clientId);
        this._gameStates.set(
            clientId,
            {
                foundDifference: [],
            });
    }

    public async interact(clientId: string, interactionData: IFreeGameInteractionData): Promise<IFreeGameInteractionResponse> {
        // TODO handle interaction
        return Promise.reject("FreeGameRoom#interact not implemented");
    }

}
