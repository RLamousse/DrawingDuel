import {inject, injectable} from "inversify";
import {AbstractDataBaseError, NonExistentGameError} from "../../../common/errors/database.errors";
import {ScoreNotGoodEnough} from "../../../common/errors/services.errors";
import {OnlineType, IGame} from "../../../common/model/game/game";
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

    public async updateTableScore(gameName: string, newScore: IRecordTime, gameType: OnlineType): Promise<number> {

        const responseFromDB: IScoreResponse = await this.getGameScores(gameName, gameType);
        const position: number = ScoreTableService.insertTime(responseFromDB.table, newScore);
        await this.putTableInDB(gameName, responseFromDB, gameType);

        return position;
    }

    private async getGameScores (gameName: string, gameType: OnlineType): Promise<IScoreResponse> {
        const isSimple: boolean = await this.isSimpleGame(gameName);
        try {
            const gameToModify: IGame =  isSimple ? await this.databaseService.simpleGames.getFromId(gameName) :
                await this.databaseService.simpleGames.getFromId(gameName);

            return {table: gameType === OnlineType.SOLO ? gameToModify.bestSoloTimes : gameToModify.bestMultiTimes, isSimple: isSimple};
        } catch (error) {
            throw new AbstractDataBaseError(error.message);
        }
    }

    private async isSimpleGame (gameName: string): Promise<boolean> {

        try {
            const isSimple: boolean = await this.databaseService.simpleGames.contains(gameName);
            if (!isSimple && !await this.databaseService.freeGames.contains(gameName)) {
                throw new NonExistentGameError();
            }

            return isSimple;
        } catch (error) {
            throw error.message === NonExistentGameError.NON_EXISTENT_GAME_ERROR_MESSAGE ? error : new AbstractDataBaseError(error.message);
        }
    }

    private async putTableInDB(gameName: string, tableToPost: IScoreResponse, gameType: OnlineType): Promise<void> {
        const dataToSend: Partial<IGame> = gameType === OnlineType.SOLO ? {bestSoloTimes: tableToPost.table} :
            {bestMultiTimes: tableToPost.table};
        try {
            if (tableToPost.isSimple) {
                await this.databaseService.simpleGames.update(gameName, dataToSend);
            } else {
                await this.databaseService.freeGames.update(gameName, dataToSend);
            }
        } catch (error) {
            throw new AbstractDataBaseError(error.message);
        }
    }

    public async resetScores(gameName: string): Promise<void> {
        const isSimple: boolean = await this.isSimpleGame(gameName);
        try {
            if (isSimple) {
                await this.databaseService.simpleGames.update(gameName, {bestSoloTimes: createRandomScores(),
                                                                         bestMultiTimes: createRandomScores()});
            } else {
                await this.databaseService.freeGames.update(gameName, {bestSoloTimes: createRandomScores(),
                                                                       bestMultiTimes: createRandomScores()});
            }
        } catch (error) {
            throw new AbstractDataBaseError(error.message);
        }
    }
}
