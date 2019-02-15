import {IRecordTime} from "./IRecordTime";
import {SimpleDifferenceData} from "../../server/app/services/difference-evaluator.service";

export interface IGame {
    gameType: GameType,
    gameName: string,
    originalImage: string,
    modifiedImage: string,
    diffData: SimpleDifferenceData,
    bestSoloTimes: IRecordTime[],
    bestMultiTimes: IRecordTime[],
}

export enum GameType {
    SIMPLE,
    FREE
}

export const TIMES_ARRAY_SIZE : number = 3;
