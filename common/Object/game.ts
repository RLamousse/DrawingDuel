export interface Game {
    gameName: string,
    originalImage: Buffer,
    modifiedImage: Buffer,
    bestSoloTimes: {name: string, time: number}[],
    bestMultiTimes: {name: string, time: number}[]
}

export const TIMES_ARRAY_SIZE : number = 3;