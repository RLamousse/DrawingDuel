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
import {SimpleReadyInfo} from "../../../../../common/model/rooms/ready-info";
import {AbstractGameRoom} from "./abstract-game-room";

export class SimpleGameRoom extends AbstractGameRoom<ISimpleGame, ISimpleGameState> {

    public constructor(id: string, gameName: string, gameLoader: () => Promise<ISimpleGame>, playerCount: number = 1) {
        super(id, gameName, gameLoader, playerCount, {
            foundDifferenceClusters: [],
        });
    }

    public async interact(interactionData: ISimpleGameInteractionData): Promise<ISimpleGameInteractionResponse> {
        return this.validateDifference(interactionData.coord)
            .then((foundDifferenceCluster: DifferenceCluster) => {
                return {differenceCluster: foundDifferenceCluster} as ISimpleGameInteractionResponse;
            })
            .catch((error: Error) => {
                throw error;
            });
    }

    private async validateDifference(point: IPoint): Promise<DifferenceCluster> {
        this.assertAlreadyFoundDifference(point);

        return Axios.get(
            SERVER_BASE_URL + DIFF_VALIDATOR_BASE,
            {
                params: {
                    coordX: point.x,
                    coordY: point.y,
                    gameName: this._game.gameName,
                } as IDiffValidatorControllerRequest,
            })
            .then(() => this.updateGameState(point))
            // tslint:disable-next-line:no-any Generic error response
            .catch((reason: any) => {
                if (reason.response && reason.response.status === Httpstatus.NOT_FOUND) {
                    throw new NoDifferenceAtPointError();
                }

                throw new GameRoomError();
            });
    }

    private assertAlreadyFoundDifference(point: IPoint): void {
        try {
            getClusterFromPoint(point, this._gameState.foundDifferenceClusters);
        } catch (e) {
            if (e.message === NoDifferenceAtPointError.NO_DIFFERENCE_AT_POINT_ERROR_MESSAGE) {
                return;
            }
        }

        throw new AlreadyFoundDifferenceError();
    }

    private updateGameState(clickedPoint: IPoint): DifferenceCluster {
        const differenceCluster: DifferenceCluster = getClusterFromPoint(clickedPoint, this._game.diffData);
        this._gameState.foundDifferenceClusters.push(differenceCluster);
        this._ongoing = this._gameState.foundDifferenceClusters.length < this.getDifferenceThreshold();

        return differenceCluster;
    }

    public get roomReadyEmitInformation(): SimpleReadyInfo {
        return {
            originalImage: this._game.originalImage,
            modifiedImage: this._game.modifiedImage,
        };
    }
}
