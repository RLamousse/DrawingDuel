import {inject, injectable} from "inversify";
import {AbstractDataBaseError, NonExistentGameError} from "../../../common/errors/database.errors";
import {ScoreNotGoodEnough} from "../../../common/errors/services.errors";
import {GameType, IGame, OnlineType} from "../../../common/model/game/game";
import {IRecordTime} from "../../../common/model/game/record-time";
import Types from "../types";
import {DataBaseService} from "./data-base.service";
import {createRandomScores} from "./service-utils";

interface IScoreResponse {
    table: IRecordTime[];
    gameType: GameType;
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

    public async updateTableScore(gameName: string, newScore: IRecordTime, onlineType: OnlineType): Promise<number> {

        const responseFromDB: IScoreResponse = await this.getGameScores(gameName, onlineType);
        const position: number = ScoreTableService.insertTime(responseFromDB.table, newScore);
        await this.putTableInDB(gameName, responseFromDB, onlineType);

        return position;
    }

    private async getGameScores (gameName: string, onlineType: OnlineType): Promise<IScoreResponse> {
        const gameType: GameType = await this.getGameType(gameName);
        try {
            const gameToModify: IGame =  gameType === GameType.SIMPLE ? await this.databaseService.simpleGames.getFromId(gameName) :
                await this.databaseService.freeGames.getFromId(gameName);

            return {table: onlineType === OnlineType.SOLO ? gameToModify.bestSoloTimes : gameToModify.bestMultiTimes, gameType: gameType};
        } catch (error) {
            throw new AbstractDataBaseError(error.message);
        }
    }

    private async getGameType (gameName: string): Promise<GameType> {

        try {
            const gameType: GameType = await this.databaseService.simpleGames.contains(gameName) ? GameType.SIMPLE : GameType.FREE;
            if (gameType === GameType.FREE && !await this.databaseService.freeGames.contains(gameName)) {
            if (gameType === GameType.FREE && !(await this.databaseService.freeGames.contains(gameName))) {
                throw new NonExistentGameError();
            }

            return gameType;
        } catch (error) {
            throw error.message === NonExistentGameError.NON_EXISTENT_GAME_ERROR_MESSAGE ? error : new AbstractDataBaseError(error.message);
        }
    }

    private async putTableInDB(gameName: string, tableToPost: IScoreResponse, onlineType: OnlineType): Promise<void> {
        const dataToSend: Partial<IGame> = onlineType === OnlineType.SOLO ? {bestSoloTimes: tableToPost.table} :
            {bestMultiTimes: tableToPost.table};
        try {
            // default case is not possible with enums
            // tslint:disable-next-line:switch-default
            switch (tableToPost.gameType) {
                case GameType.FREE:
                    await this.databaseService.freeGames.update(gameName, dataToSend);
                    break;
                case GameType.SIMPLE:
                    await this.databaseService.simpleGames.update(gameName, dataToSend);
            }
        } catch (error) {
            throw new AbstractDataBaseError(error.message);
        }
    }

    public async resetScores(gameName: string): Promise<void> {
        const gameType: GameType = await this.getGameType(gameName);
        try {
            // default case is not possible with enums
            // tslint:disable-next-line:switch-default
            switch (gameType) {
                case GameType.SIMPLE:
                    await this.databaseService.simpleGames.update(gameName, {bestSoloTimes: createRandomScores(),
                                                                             bestMultiTimes: createRandomScores()});
                    break;
                case GameType.FREE:
                    await this.databaseService.freeGames.update(gameName, {bestSoloTimes: createRandomScores(),
                                                                           bestMultiTimes: createRandomScores()});
            }
        } catch (error) {
            throw new AbstractDataBaseError(error.message);
        }
    }
}
