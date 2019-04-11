import {IJson3DObject} from "../../free-game-json-interface/JSONInterface/IScenesJSON";
import {DifferenceCluster} from "../game/simple-game";
import {IPoint, IPoint3D} from "../point";

export interface IInteractionData {
}

export interface ISimpleGameInteractionData extends IInteractionData {
    coord: IPoint;
}

export interface IFreeGameInteractionData extends IInteractionData {
    coord: IPoint3D;
}

export interface IInteractionResponse {
}

export interface ISimpleGameInteractionResponse extends IInteractionResponse {
    differenceCluster: DifferenceCluster;
}

export interface IFreeGameInteractionResponse extends IInteractionData {
    object: IJson3DObject;
}
