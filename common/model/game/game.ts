import {IRecordTime} from "./record-time";

export interface IGame {
    gameName: string;
    bestSoloTimes: IRecordTime[];
    bestMultiTimes: IRecordTime[];
    toBeDeleted: boolean ;
}

export const TIMES_ARRAY_SIZE : number = 3;

export const instanceOfGame = (object: any): object is IGame =>
    'gameName' in object &&
    'bestSoloTimes' in object &&
    'bestMultiTimes' in object;
