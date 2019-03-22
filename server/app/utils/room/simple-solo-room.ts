import Axios, {AxiosResponse} from "axios";
import * as Httpstatus from "http-status-codes";
import {Socket} from "socket.io";
import {IDiffValidatorControllerRequest} from "../../../../common/communication/requests/diff-validator-controller.request";
import {IDiffValidatorControllerResponse} from "../../../../common/communication/responses/diff-validator-controller.response";
import {DIFF_VALIDATOR_BASE, SERVER_BASE_URL} from "../../../../common/communication/routes";
import {AlreadyFoundDifferenceError, NoDifferenceAtPointError} from "../../../../common/errors/services.errors";
import {DifferenceCluster, DIFFERENCE_CLUSTER_POINTS_INDEX, ISimpleGame} from "../../../../common/model/game/simple-game";
import ISimpleGameState from "../../../../common/model/game/simple-game-state";
import {IPoint} from "../../../../common/model/point";
import {IRoomEvent} from "./room";
import {SoloRoom} from "./solo-room";

export interface ISimpleRoomEvent extends IRoomEvent {
    clickCoord: IPoint;
}

export class SimpleSoloRoom extends SoloRoom<ISimpleGame> {
    private _gameState: ISimpleGameState;

    public interact(event: ISimpleRoomEvent, client: Socket): Promise<void> {
        this.assertAlreadyFoundDifference(event.clickCoord);

        return Axios.get<IDiffValidatorControllerResponse>(
            SERVER_BASE_URL + DIFF_VALIDATOR_BASE,
            {
                params: {
                    coordX: event.clickCoord.x,
                    coordY: event.clickCoord.y,
                    gameName: this._game.gameName,
                } as IDiffValidatorControllerRequest,
            })
            .then((value: AxiosResponse<IDiffValidatorControllerResponse>) => {
                const differenceCluster: DifferenceCluster = [value.data.differenceClusterId, value.data.differenceClusterCoords];
                this._gameState.foundDifferenceClusters.push(differenceCluster);

            })
            // tslint:disable-next-line:no-any Generic error response
            .catch((reason: any) => {
                if (reason.response && reason.response.status === Httpstatus.NOT_FOUND) {
                    throw new NoDifferenceAtPointError();
                }

                throw new Error(reason.message);
            });
    }

    private assertAlreadyFoundDifference(point: IPoint): void {
        if (this.wasDifferenceFound(point)) {
            throw new AlreadyFoundDifferenceError();
        }
    }

    private wasDifferenceFound(point: IPoint): boolean {
        for (const cluster of this._gameState.foundDifferenceClusters) {
            for (const pointOfCluster of cluster[DIFFERENCE_CLUSTER_POINTS_INDEX]) {
                if (point.x === pointOfCluster.x && point.y === pointOfCluster.y) {
                    return true;
                }
            }
        }

        return false;
    }
}
