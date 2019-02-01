export interface Game {
    gameName: string,
    originalImage: Buffer,
    modifiedImage: Buffer,
    bestSoloTimes: {name: string, time: number}[],
    bestMultiTimes: {name: string, time: number}[]
}