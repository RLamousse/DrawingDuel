import {IPoint} from "../../point";
import {IDifferenceData} from "./difference-data";

export interface ISimpleDifferenceData extends IDifferenceData, Map<number, IPoint[]> {

}
