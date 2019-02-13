import {IRecordTime} from "./IRecordTime";

export interface IGame {
    gameType: GameType,
    gameName: string,
    originalImage: string,
    modifiedImage: string,
    diffImage: string,
    bestSoloTimes: IRecordTime[],
    bestMultiTimes: IRecordTime[],
}

export enum GameType {
    SIMPLE,
    FREE
}

export const TIMES_ARRAY_SIZE : number = 3;
