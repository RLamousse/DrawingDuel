import {injectable} from "inversify";
import {IRecordTime} from "../../../common/model/game/record-time";

@injectable()
export class ScoreTableService {
    private static sortTable(tableToSort: IRecordTime[]): void {
        tableToSort.sort((a: IRecordTime, b: IRecordTime) => a.time - b.time);
    }

    public insertTime(tableToInsert: IRecordTime[], newTime: IRecordTime): void {
        if (newTime.time < tableToInsert[2].time) {
            tableToInsert[2] = newTime;
            ScoreTableService.sortTable(tableToInsert);
        }
    }
}
