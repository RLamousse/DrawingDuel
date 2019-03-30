import Axios from "axios";
import * as Httpstatus from "http-status-codes";
import {IDiffValidatorControllerRequest} from "../../../../../common/communication/requests/diff-validator-controller.request";
import {DIFF_VALIDATOR_BASE, SERVER_BASE_URL} from "../../../../../common/communication/routes";
import {
    AlreadyFoundDifferenceError,
    GameRoomError,
    NoDifferenceAtPointError
} from "../../../../../common/errors/services.errors";
import {ISimpleGameState} from "../../../../../common/model/game/game-state";
import {
    getClusterFromPoint,
    DifferenceCluster,
    ISimpleGame
} from "../../../../../common/model/game/simple-game";
import {IPoint} from "../../../../../common/model/point";
import {
    ISimpleGameInteractionData,
    ISimpleGameInteractionResponse
} from "../../../../../common/model/rooms/interaction";
import {AbstractGameRoom} from "./abstract-game-room";

export class SimpleGameRoom extends AbstractGameRoom<ISimpleGame, ISimpleGameState> {

    public constructor(id: string, game: ISimpleGame, nbPlayers: number = 1) {
        super(id, game, nbPlayers);
    }

    public join(clientId: string): void {
        super.join(clientId);
        this._gameStates.set(
            clientId,
            {
                foundDifferenceClusters: [],
            });
    }

    public async interact(clientId: string, interactionData: ISimpleGameInteractionData): Promise<ISimpleGameInteractionResponse> {
        return this.validateDifference(clientId, interactionData.coord)
            .then((foundDifferenceCluster: DifferenceCluster) => {
                return {differenceCluster: foundDifferenceCluster};
            })
            .catch((error: Error) => {
                // TODO: Notify room
                throw error;
            });
    }

    private async validateDifference(clientId: string, point: IPoint): Promise<DifferenceCluster> {
        this.assertAlreadyFoundDifference(clientId, point);

        return Axios.get(
            SERVER_BASE_URL + DIFF_VALIDATOR_BASE,
            {
                params: {
                    coordX: point.x,
                    coordY: point.y,
                    gameName: this._game.gameName,
                } as IDiffValidatorControllerRequest,
            })
            .then(() => {
                return this.updateGameState(clientId, point);
            })
            // tslint:disable-next-line:no-any Generic error response
            .catch((reason: any) => {
                if (reason.response && reason.response.status === Httpstatus.NOT_FOUND) {
                    throw new NoDifferenceAtPointError();
                }

                throw new GameRoomError();
            });
    }

    private assertAlreadyFoundDifference(clientId: string, point: IPoint): void {
        const clientGameState: ISimpleGameState = this.getGameStateForClient(clientId);

        try {
            getClusterFromPoint(point, clientGameState.foundDifferenceClusters);
        } catch (e) {
            if (e.message === NoDifferenceAtPointError.NO_DIFFERENCE_AT_POINT_ERROR_MESSAGE) {
                return;
            }
        }

        throw new AlreadyFoundDifferenceError();
    }

    private updateGameState(clientId: string, clickedPoint: IPoint): DifferenceCluster {
        const differenceCluster: DifferenceCluster = getClusterFromPoint(clickedPoint, this._game.diffData);
        const clientGameState: ISimpleGameState = this.getGameStateForClient(clientId);
        clientGameState.foundDifferenceClusters.push(differenceCluster);

        return differenceCluster;
    }
}
