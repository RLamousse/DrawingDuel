import {IRecordTime} from "./record-time";

export interface IGame {
    gameName: string;
    bestSoloTimes: IRecordTime[];
    bestMultiTimes: IRecordTime[];
}

export const TIMES_ARRAY_SIZE : number = 3;
