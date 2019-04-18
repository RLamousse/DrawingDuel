import {IRecordTime} from "./record-time";

export interface IGame {
    gameName: string;
    bestSoloTimes: IRecordTime[];
    bestMultiTimes: IRecordTime[];
    toBeDeleted: boolean ;
}

export const TIMES_ARRAY_SIZE : number = 3;
export const SINGLEPLAYER_GAME_DIFF_THRESHOLD: number = 7;
export const MULTIPLAYER_GAME_DIFF_THRESHOLD: number = 4;

export enum OnlineType {SOLO = "solo", MULTI = "un contre un"}

export enum GameType {SIMPLE, FREE}

export const instanceOfGame = (object: any): object is IGame =>
    'gameName' in object &&
    'bestSoloTimes' in object &&
    'bestMultiTimes' in object;
