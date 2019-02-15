import {IRecordTime} from "./IRecordTime";
import {IDiffZonesMap} from "../../server/app/services/difference-evaluator.service";

export interface IGame {
    gameType: GameType,
    gameName: string,
    originalImage: string,
    modifiedImage: string,
    diffData: IDiffZonesMap,
    bestSoloTimes: IRecordTime[],
    bestMultiTimes: IRecordTime[],
}

export enum GameType {
    SIMPLE,
    FREE
}

export const TIMES_ARRAY_SIZE : number = 3;
