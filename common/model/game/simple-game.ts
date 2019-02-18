import {IPoint} from "../point";
import {IGame} from "./game";

export type ISimpleDifferenceData = [number, IPoint[]][];

export default interface ISimpleGame extends IGame {
    originalImage: string;
    modifiedImage: string;
    diffData: ISimpleDifferenceData;
}
