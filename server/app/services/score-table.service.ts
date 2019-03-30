import Axios from "axios";
import * as Httpstatus from "http-status-codes";
import {inject, injectable} from "inversify";
import {DB_FREE_GAME, DB_SIMPLE_GAME, SERVER_BASE_URL} from "../../../common/communication/routes";
import {AbstractDataBaseError, NonExistentGameError} from "../../../common/errors/database.errors";
import {ScoreNotGoodEnough} from "../../../common/errors/services.errors";
import {IFreeGame} from "../../../common/model/game/free-game";
import {IGame} from "../../../common/model/game/game";
import {IRecordTime} from "../../../common/model/game/record-time";
import {ISimpleGame} from "../../../common/model/game/simple-game";
import {createRandomScores} from "./service-utils";
import Types from "../types";
import {DataBaseService} from "./data-base.service";

interface IScoreResponse {
    table: IRecordTime[];
    isSimple: boolean;
}

@injectable()
export class ScoreTableService {

    constructor(@inject(Types.DataBaseService) private databaseService: DataBaseService){}

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

        const responseFromDB: IScoreResponse = await this.tryGetTableFromDB(gameName, isSolo) as IScoreResponse;
        const position: number = ScoreTableService.insertTime(responseFromDB.table, newScore);
        await this.putTableInDB(gameName, responseFromDB, isSolo);

        return position;
    }

    private async tryGetTableFromDB (gameName: string, isSolo?: boolean): Promise<IScoreResponse|boolean> {
        let gameToModify: IGame;
        let isSimple: boolean = false;
        try {
            gameToModify = await this.databaseService.freeGames.getFromId(gameName);
        } catch (error) {
            if (error.message !== NonExistentGameError.NON_EXISTENT_GAME_ERROR_MESSAGE) {
                throw new AbstractDataBaseError(error.message);
            }
            try {
                gameToModify = await this.databaseService.simpleGames.getFromId(gameName);
                isSimple = true;
            } catch (error2) {
                if (error2.message !== NonExistentGameError.NON_EXISTENT_GAME_ERROR_MESSAGE) {
                    throw new AbstractDataBaseError(error2.message);
                }
                throw new error2;
            }
        }

        if (isSolo === undefined) {
            return isSimple;
        }

        return {table: isSolo ? gameToModify.bestSoloTimes : gameToModify.bestMultiTimes, isSimple: isSimple};
    }

    private async putTableInDB(gameName: string, tableToPost: IScoreResponse, isSolo: boolean): Promise<void> {
        const dataToSend: Partial<IGame> = isSolo ? {bestSoloTimes: tableToPost.table} : {bestMultiTimes: tableToPost.table};
        await Axios.put<void>(SERVER_BASE_URL + (tableToPost.isSimple ? DB_SIMPLE_GAME : DB_FREE_GAME) + gameName, dataToSend)
            // any is the default type of the required callback function
            // tslint:disable-next-line:no-any Generic error response
            .catch((reason: any) => {
            throw new AbstractDataBaseError("Unable to modify game: " + reason.response.data.message);
        });
    }

    public async resetScores(gameName: string): Promise<void> {
        const isSimple: boolean = await this.tryGetTableFromDB(gameName) as boolean;
        await Axios.put<void>(SERVER_BASE_URL + (isSimple ? DB_SIMPLE_GAME : DB_FREE_GAME) + gameName,
                              {bestSoloTimes: createRandomScores(), bestMultiTimes: createRandomScores()})
        // any is the default type of the required callback function
        // tslint:disable-next-line:no-any Generic error response
            .catch((reason: any) => {
                throw new AbstractDataBaseError("Unable to modify game: " + reason.response.data.message);
            });
    }
}
