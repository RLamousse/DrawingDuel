import Axios from "axios";
import * as Httpstatus from "http-status-codes";
import {injectable} from "inversify";
import {DB_FREE_GAME, DB_SIMPLE_GAME, SERVER_BASE_URL} from "../../../common/communication/routes";
import {IFreeGame} from "../../../common/model/game/free-game";
import {IRecordTime} from "../../../common/model/game/record-time";
import {ISimpleGame} from "../../../common/model/game/simple-game";

@injectable()
export class ScoreTableService {
    private sortTable(tableToSort: IRecordTime[]): void {
        tableToSort.sort((a: IRecordTime, b: IRecordTime) => a.time - b.time);
    }

    private async getTableFromDB (gameName: string): Promise<IRecordTime[]> {
        let gameToModify: IGame;
        try {
            gameToModify = (await Axios.get<IFreeGame>(SERVER_BASE_URL + DB_FREE_GAME + gameName)).data;
        } catch (error) {
            try {
                gameToModify = (await Axios.get<ISimpleGame>(SERVER_BASE_URL + DB_SIMPLE_GAME + gameName)).data;
            } catch (error) {
                if (error.response.status !== Httpstatus.NOT_FOUND) {
                    throw new Error("dataBase: " + error.response.data.message);
                }
            }
        }

        return gameToModify.bestSoloTimes[];
    }

    public insertTime(gameName: string, newTime: IRecordTime): void {
        const tableToInsert: IRecordTime[] = this.getTableFromDB(gameName);
        if (newTime.time < tableToInsert[2].time) {
            tableToInsert[2] = newTime;
            this.sortTable(tableToInsert);
        }
    }
}
