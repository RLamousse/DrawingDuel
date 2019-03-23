import Axios from "axios";
import {injectable} from "inversify";
import {Message} from "../../../common/communication/messages/message";
import {DB_FREE_GAME, DB_SIMPLE_GAME, SERVER_BASE_URL} from "../../../common/communication/routes";
import {IFreeGame} from "../../../common/model/game/free-game";
import {IGame} from "../../../common/model/game/game";
import {IRecordTime} from "../../../common/model/game/record-time";
import {ISimpleGame} from "../../../common/model/game/simple-game";
import {MODIFY_TABLE_SUCCESS_MESSAGE} from "../controllers/controller-utils";

interface IScoreResponse {
    table: IRecordTime[];
    isSimple: boolean;
}

@injectable()
export class ScoreTableService {

    public static insertTime(tableToInsert: IRecordTime[], newTime: IRecordTime): number {
        if (newTime.time < tableToInsert[2].time) {
            tableToInsert[2] = newTime;
            this.sortTable(tableToInsert);

            return tableToInsert.indexOf(newTime) + 1;
        }
        throw new ScoreNotGoodEnough();
    }

    private static sortTable(tableToSort: IRecordTime[]): void {
        tableToSort.sort((a: IRecordTime, b: IRecordTime) => a.time - b.time);
    }

    public async updateTableScore(gameName: string, newScore: IRecordTime): Promise<Message> {
        const tableToInsert: IRecordTime[] = await this.getTableFromDB(gameName);
        ScoreTableService.insertTime(tableToInsert, newScore);
        await this.putTableInDB(tableToInsert);

        return MODIFY_TABLE_SUCCESS_MESSAGE;
    }

    private async getTableFromDB (gameName: string, isSolo: boolean): Promise<IScoreResponse> {
        let gameToModify: IGame;
        let isSimple: boolean = false;
        try {
            gameToModify = (await Axios.get<IFreeGame>(SERVER_BASE_URL + DB_FREE_GAME + gameName)).data;
        } catch (error) {
            try {
                if (error.response.status !== Httpstatus.NOT_FOUND) {
                    throw new Error("dataBase: " + error.response.data.message);
                }
                gameToModify = (await Axios.get<ISimpleGame>(SERVER_BASE_URL + DB_SIMPLE_GAME + gameName)).data;
                isSimple = true;
            } catch (error2) {
                if (error.response.status !== Httpstatus.NOT_FOUND) {
                    throw new Error("dataBase: " + error.response.data.message);
                }
                throw new NonExistentGameError();
            }
        }

        return gameToModify.bestSoloTimes;
    }
    private async putTableInDB(tableToPost: IRecordTime[]): Promise<void> {
        // quand milen aura fini mettre bonne adresse
        /*await Axios.put<void>(
            SERVER_BASE_URL + DB_FREE_GAME,
            requestFormData,
            {
                headers: requestFormData.getHeaders(),
                responseType: "arraybuffer",
            },
        );*/
    }
}
