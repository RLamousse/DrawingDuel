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
