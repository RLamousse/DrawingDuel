import {IDifferenceData} from "./differences/difference-data";
import {Game} from "./game";
import {IRecordTime} from "./record-time";

export class FreeGame extends Game {

    constructor(gameName: string, diffData: IDifferenceData, bestSoloTimes: IRecordTime[], bestMultiTimes: IRecordTime[]) {
        super(gameName, diffData, bestSoloTimes, bestMultiTimes);
    }
}
