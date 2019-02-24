import {Injectable} from "@angular/core";
import Axios, {AxiosResponse} from "axios";
import * as Httpstatus from "http-status-codes";
import {IDiffValidatorControllerRequest} from "../../../common/communication/requests/diff-validator-controller.request";
import {IDiffValidatorControllerResponse} from "../../../common/communication/responses/diff-validator-controller.response";
import {DifferenceCluster} from "../../../common/model/game/simple-game";
import ISimpleGameState from "../../../common/model/game/simple-game-state";
import {IPoint} from "../../../common/model/point";
import {FOUND_DIFFERENCE_SOUNDS, NO_DIFFERENCE_SOUNDS, playRandomSound} from "./simple-game/game-sounds";

export const ALREADY_FOUND_DIFFERENCE: string = "Difference was already found!";

@Injectable({
              providedIn: "root",
            })
export class SimpleGameService {

  private _gameState: ISimpleGameState;

  public constructor() {
    this._gameState = {
      foundDifferencesIds: [],
    };
  }

  private _gameName: string;

  public set gameName(value: string) {
    this._gameName = value;
  }

  public get foundDifferencesCount(): number {
    return this._gameState.foundDifferencesIds.length;
  }

  public async validateDifferenceAtPoint(point: IPoint): Promise<DifferenceCluster> {
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

        if (this._gameState.foundDifferencesIds.includes(value.data.differenceClusterId)) {
          throw new Error(ALREADY_FOUND_DIFFERENCE);
        }

        this._gameState.foundDifferencesIds.push(value.data.differenceClusterId);
        playRandomSound(FOUND_DIFFERENCE_SOUNDS);

        return [value.data.differenceClusterId, value.data.differenceClusterCoords] as DifferenceCluster;
      })
      // tslint:disable-next-line:no-any Generic error response
      .catch((reason: any) => {
        if (reason.response.status === Httpstatus.NOT_FOUND) {
          playRandomSound(NO_DIFFERENCE_SOUNDS);
        }

        throw new Error(reason.message);
      });
  }
}
