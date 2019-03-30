import {inject, injectable} from "inversify";
import {AbstractDataBaseError, NonExistentGameError} from "../../../common/errors/database.errors";
import {ScoreNotGoodEnough} from "../../../common/errors/services.errors";
import {IGame} from "../../../common/model/game/game";
import {IRecordTime} from "../../../common/model/game/record-time";
import Types from "../types";
import {DataBaseService} from "./data-base.service";
import {createRandomScores} from "./service-utils";

interface IScoreResponse {
    table: IRecordTime[];
    isSimple: boolean;
}

@injectable()
export class ScoreTableService {

    private static readonly LAST_POSITION_INDEX: number = 2;

    public constructor(@inject(Types.DataBaseService) private databaseService: DataBaseService) {}

    private static insertTime(tableToInsert: IRecordTime[], newTime: IRecordTime): number {
        if (newTime.time < tableToInsert[this.LAST_POSITION_INDEX].time) {
            tableToInsert[this.LAST_POSITION_INDEX] = newTime;
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
                throw error2;
            }
        }

        if (isSolo === undefined) {
            return isSimple;
        }

        return {table: isSolo ? gameToModify.bestSoloTimes : gameToModify.bestMultiTimes, isSimple: isSimple};
    }

    private async putTableInDB(gameName: string, tableToPost: IScoreResponse, isSolo: boolean): Promise<void> {
        const dataToSend: Partial<IGame> = isSolo ? {bestSoloTimes: tableToPost.table} : {bestMultiTimes: tableToPost.table};
        try {
            if (tableToPost.isSimple) {
                await this.databaseService.simpleGames.update(gameName, dataToSend);
            } else {
                await this.databaseService.freeGames.update(gameName, dataToSend);
            }
        } catch (error) {
            throw new AbstractDataBaseError("Unable to modify game: " + error.message);
        }
    }

    public async resetScores(gameName: string): Promise<void> {
        const isSimple: boolean = await this.tryGetTableFromDB(gameName) as boolean;
        try {
            if (isSimple) {
                await this.databaseService.simpleGames.update(gameName, {bestSoloTimes: createRandomScores(),
                                                                         bestMultiTimes: createRandomScores()});
            } else {
                await this.databaseService.freeGames.update(gameName, {bestSoloTimes: createRandomScores(),
                                                                       bestMultiTimes: createRandomScores()});
            }
        } catch (error) {
            throw new AbstractDataBaseError("Unable to modify game: " + error.message);
        }
    }
}
