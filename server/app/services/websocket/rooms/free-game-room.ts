import {IFreeGame} from "../../../../../common/model/game/free-game";
import {IFreeGameState} from "../../../../../common/model/game/game-state";
import {IFreeGameInteractionData, IFreeGameInteractionResponse} from "../../../../../common/model/rooms/interaction";
import {AbstractGameRoom} from "./abstract-game-room";

export class FreeGameRoom extends AbstractGameRoom<IFreeGame, IFreeGameState> {

    public constructor(id: string, game: IFreeGame, playerCount: number = 1) {
        super(id, game, playerCount);
    }

    public checkIn(clientId: string): void {
        super.checkIn(clientId);
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
