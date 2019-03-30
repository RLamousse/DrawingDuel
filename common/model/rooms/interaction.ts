import {DifferenceCluster} from "../game/simple-game";
import {IPoint} from "../point";

export interface IInteractionData {
    clientId: string;
}

export interface ISimpleGameInteractionData extends IInteractionData {
    coord: IPoint;
}

export interface IFreeGameInteractionData extends IInteractionData {
    coord: number[];
}

export interface IInteractionResponse {
}

export interface ISimpleGameInteractionResponse extends IInteractionResponse {
    differenceCluster: DifferenceCluster;
}

export interface IFreeGameInteractionResponse extends IInteractionData {
    // TODO
}
