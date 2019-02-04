export interface Game {
    isSimpleGame: boolean,
    gameName: string,
    originalImage: string,
    modifiedImage: string,
    bestSoloTimes: {name: string, time: number}[],
    bestMultiTimes: {name: string, time: number}[],
}

export const TIMES_ARRAY_SIZE : number = 3;