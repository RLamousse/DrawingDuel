import {Injectable} from "@angular/core";
import Axios, {AxiosResponse} from "axios";
import * as Httpstatus from "http-status-codes";
import {Observable, Subject} from "rxjs";
import {IDiffValidatorControllerRequest} from "../../../../common/communication/requests/diff-validator-controller.request";
import {IDiffValidatorControllerResponse} from "../../../../common/communication/responses/diff-validator-controller.response";
import {DifferenceCluster, DIFFERENCE_CLUSTER_POINTS_INDEX} from "../../../../common/model/game/simple-game";
import ISimpleGameState from "../../../../common/model/game/simple-game-state";
import {IPoint} from "../../../../common/model/point";
import {playRandomSound, FOUND_DIFFERENCE_SOUNDS, NO_DIFFERENCE_SOUNDS} from "./game-sounds";

export const ALREADY_FOUND_DIFFERENCE: string = "Difference was already found!";
export const NO_DIFFERENCE_AT_POINT_ERROR_MESSAGE: string = "There is no difference at the specified point"; // TODO: Common

@Injectable({
              providedIn: "root",
            })
export class SimpleGameService {

  private _gameState: ISimpleGameState;
  private _gameName: string;
  private _differenceCountSubject: Subject<number> = new Subject();

  public constructor() {
    this._gameState = {
      foundDifferenceClusters: [],
    };
  }

  public set gameName(value: string) {
    this._gameName = value;
  }

  public get foundDifferencesCount(): Observable<number> {
    return this._differenceCountSubject;
  }

  public async validateDifferenceAtPoint(point: IPoint): Promise<DifferenceCluster> {
    this.assertAlreadyFoundDifference(point);

    return Axios.get<IDiffValidatorControllerResponse>(
      "http://localhost:3000/api/diff-validator",
      {
        params: {
          coordX: point.x,
          coordY: point.y,
          gameName: this._gameName,
        } as IDiffValidatorControllerRequest,
      })
      .then((value: AxiosResponse<IDiffValidatorControllerResponse>) => {
        const differenceCluster: DifferenceCluster = [value.data.differenceClusterId, value.data.differenceClusterCoords];
        this._gameState.foundDifferenceClusters.push(differenceCluster);
        this._differenceCountSubject.next(this._gameState.foundDifferenceClusters.length);
        playRandomSound(FOUND_DIFFERENCE_SOUNDS);

        return differenceCluster;
      })
      // tslint:disable-next-line:no-any Generic error response
      .catch((reason: any) => {
        if (reason.response && reason.response.status === Httpstatus.NOT_FOUND) {
          playRandomSound(NO_DIFFERENCE_SOUNDS);
          throw new Error(NO_DIFFERENCE_AT_POINT_ERROR_MESSAGE);
        }

        throw new Error(reason.message);
      });
  }

  private assertAlreadyFoundDifference(point: IPoint): void {
    if (this.wasDifferenceFound(point)) {
      throw new Error(ALREADY_FOUND_DIFFERENCE);
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
