export interface Game {
    gameType: GameType,
    gameName: string,
    originalImage: string,
    modifiedImage: string,
    bestSoloTimes: {name: string, time: number}[],
    bestMultiTimes: { name: string, time: number }[],
}

export enum GameType {
    SIMPLE,
    FREE
}

export const TIMES_ARRAY_SIZE : number = 3;
