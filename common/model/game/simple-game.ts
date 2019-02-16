import {ISimpleDifferenceData} from "./differences/simple-difference-data";
import {Game} from "./game";
import {IRecordTime} from "./record-time";

export class SimpleGame extends Game {
    readonly originalImage: string;
    readonly modifiedImage: string;
    readonly diffData: ISimpleDifferenceData;

    constructor(gameName: string, diffData: ISimpleDifferenceData, bestSoloTimes: IRecordTime[], bestMultiTimes: IRecordTime[], originalImage: string, modifiedImage: string) {
        super(gameName, diffData, bestSoloTimes, bestMultiTimes);
        this.originalImage = originalImage;
        this.modifiedImage = modifiedImage;
        this.diffData = diffData;
    }

    public static Valid(): boolean {
        return super.isValid() && this.originalImage !== "" && this.modifiedImage !== "";
    }

    public toJSON(): any {
        return Object.assign({}, this, {
            diffData: Array.from(this.diffData.entries())
        });
    }
}
