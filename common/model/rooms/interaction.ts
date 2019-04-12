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
    initiatedBy: string;
}

export interface ISimpleGameInteractionResponse extends IInteractionResponse {
    differenceCluster: DifferenceCluster;
}

export interface IFreeGameInteractionResponse extends IInteractionResponse {
    object: IJson3DObject;
}
