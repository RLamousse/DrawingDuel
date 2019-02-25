import {IPoint} from "../../model/point";

export interface IDiffValidatorControllerResponse {
    validDifference: boolean,
    differenceClusterId: number,
    differenceClusterCoords: IPoint[],
}
