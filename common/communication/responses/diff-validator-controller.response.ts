import {IPoint} from "../../model/point";

export interface IDiffValidatorControllerResponse {
    differenceClusterId: number,
    differenceClusterCoords: IPoint[],
}
