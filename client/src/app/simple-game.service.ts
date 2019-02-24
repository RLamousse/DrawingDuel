import {Injectable} from "@angular/core";
import Axios, {AxiosResponse} from "axios";
import {IDiffValidatorControllerRequest} from "../../../common/communication/requests/diff-validator-controller.request";
import {IDiffValidatorControllerResponse} from "../../../common/communication/responses/diff-validator-controller.response";
import {DifferenceCluster} from "../../../common/model/game/simple-game";
import {IPoint} from "../../../common/model/point";

@Injectable({
              providedIn: "root",
            })
export class SimpleGameService {

  private _gameName: string;

  public set gameName(value: string) {
    this._gameName = value;
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
        const differenceCluster: DifferenceCluster = [value.data.differenceClusterId, value.data.differenceClusterCoords];
        // TODO: encountered differences
        return differenceCluster;
      });
  }
}
