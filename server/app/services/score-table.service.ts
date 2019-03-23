import Axios from "axios";
import * as Httpstatus from "http-status-codes";
import {injectable} from "inversify";
import {DB_FREE_GAME, DB_SIMPLE_GAME, SERVER_BASE_URL} from "../../../common/communication/routes";
import {NonExistentGameError} from "../../../common/errors/database.errors";
import {ScoreNotGoodEnough} from "../../../common/errors/services.errors";
import {IFreeGame} from "../../../common/model/game/free-game";
import {IGame} from "../../../common/model/game/game";
import {IRecordTime} from "../../../common/model/game/record-time";
import {ISimpleGame} from "../../../common/model/game/simple-game";

interface IScoreResponse {
    table: IRecordTime[];
    isSimple: boolean;
}

@injectable()
export class ScoreTableService {

    private static insertTime(tableToInsert: IRecordTime[], newTime: IRecordTime): number {
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

    public async updateTableScore(gameName: string, newScore: IRecordTime, isSolo: boolean): Promise<number> {

        const responseFromDB: IScoreResponse = await this.getTableFromDB(gameName, isSolo);
        const position: number = ScoreTableService.insertTime(responseFromDB.table, newScore);
        await this.putTableInDB(gameName, responseFromDB, isSolo);

        return position;
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

        return {table: isSolo ? gameToModify.bestSoloTimes : gameToModify.bestMultiTimes, isSimple: isSimple};
    }
    private async putTableInDB(gameName: string, tableToPost: IScoreResponse, isSolo: boolean): Promise<void> {
        const dataToSend: Partial<IGame> = isSolo ? {bestSoloTimes: tableToPost.table} : {bestMultiTimes: tableToPost.table};
        await Axios.put<void>(SERVER_BASE_URL + (tableToPost ? DB_SIMPLE_GAME : DB_FREE_GAME) + gameName, dataToSend)
            // any is the default type of the required callback function
            // tslint:disable-next-line:no-any Generic error response
            .catch((reason: any) => {
            throw new Error("dataBase: Unable to create game: " + reason.response.data.message);
        });
    }
}
