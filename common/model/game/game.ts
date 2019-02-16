import {IDifferenceData} from "./differences/difference-data";
import {IRecordTime} from "./record-time";

export abstract class Game {
    readonly gameName: string;
    readonly diffData: IDifferenceData;
    readonly bestSoloTimes: IRecordTime[];
    readonly bestMultiTimes: IRecordTime[];

    constructor(gameName: string, diffData: IDifferenceData, bestSoloTimes: IRecordTime[], bestMultiTimes: IRecordTime[]) {
        this.gameName = gameName;
        this.diffData = diffData;
        this.bestSoloTimes = bestSoloTimes;
        this.bestMultiTimes = bestMultiTimes;
    }

    public isValid(): boolean {
        return this.gameName === "";
    }
}

export const TIMES_ARRAY_SIZE : number = 3;
