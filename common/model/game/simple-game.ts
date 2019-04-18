import {NoDifferenceAtPointError} from "../../errors/services.errors";
import {IPoint} from "../point";
import {IGame, instanceOfGame} from "./game";

export type DifferenceCluster = [number, IPoint[]];
export type ISimpleDifferenceData = DifferenceCluster[];
export const DIFFERENCE_CLUSTER_ID_INDEX = 0;
export const DIFFERENCE_CLUSTER_POINTS_INDEX = 1;

export interface ISimpleGame extends IGame {
    originalImage: string;
    modifiedImage: string;
    diffData: ISimpleDifferenceData;
}

export const instanceOfSimpleGame = (object: any): object is ISimpleGame =>
    instanceOfGame(object) &&
    'originalImage' in object &&
    'modifiedImage' in object &&
    'diffData' in object;

export const getClusterFromPoint: (point: IPoint, clusters: DifferenceCluster[]) => DifferenceCluster =
    (point: IPoint, clusters: DifferenceCluster[]): DifferenceCluster => {
        const cluster = clusters
            .find((cluster: DifferenceCluster) =>
                      cluster[DIFFERENCE_CLUSTER_POINTS_INDEX]
                          .some((p: IPoint) => point.x === p.x && point.y === p.y));

        if (cluster === undefined) {
            throw new NoDifferenceAtPointError();
        }

        return cluster;
    };
