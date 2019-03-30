import {IJson3DObject} from "../../free-game-json-interface/JSONInterface/IScenesJSON";
import {DifferenceCluster} from "./simple-game";

export interface IGameState {
}

export interface ISimpleGameState extends IGameState {
    foundDifferenceClusters: DifferenceCluster[]
}

export interface IFreeGameState extends IGameState {
    foundDifference: IJson3DObject[];
}
