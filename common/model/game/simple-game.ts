import {IPoint} from "../point";
import {IGame} from "./game";

export type DifferenceCluster = [number, IPoint[]];
export type ISimpleDifferenceData = DifferenceCluster[];
export const DIFFERENCE_CLUSTER_ID_INDEX = 0;
export const DIFFERENCE_CLUSTER_POINTS_INDEX = 1;

export interface ISimpleGame extends IGame {
    originalImage: string;
    modifiedImage: string;
    diffData: ISimpleDifferenceData;
}
