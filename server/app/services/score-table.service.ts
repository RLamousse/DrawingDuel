import {inject, injectable} from "inversify";
import {AbstractDataBaseError, NonExistentGameError} from "../../../common/errors/database.errors";
import {ScoreNotGoodEnough} from "../../../common/errors/services.errors";
import {GameType, IGame} from "../../../common/model/game/game";
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

    public async updateTableScore(gameName: string, newScore: IRecordTime, gameType: GameType): Promise<number> {

        const responseFromDB: IScoreResponse = await this.tryGetTableFromDB(gameName, gameType) as IScoreResponse;
        const position: number = ScoreTableService.insertTime(responseFromDB.table, newScore);
        await this.putTableInDB(gameName, responseFromDB, gameType);

        return position;
    }

    private async tryGetTableFromDB (gameName: string, gameType?: GameType): Promise<IScoreResponse|boolean> {
        let gameToModify: IGame;
        let isSimple: boolean = false;
        if (await this.databaseService.freeGames.contains(gameName)) {
            try {
                gameToModify = await this.databaseService.freeGames.getFromId(gameName);
            } catch (error) {
                throw new AbstractDataBaseError(error.message);
            }
        } else if (await this.databaseService.simpleGames.contains(gameName)) {
            try {
                gameToModify = await this.databaseService.simpleGames.getFromId(gameName);
            } catch (error) {
                throw new AbstractDataBaseError(error.message);
            }
            isSimple = true;
        } else {
            throw new NonExistentGameError();
        }

        if (gameType === undefined) {
            return isSimple;
        }

        return {table: gameType === GameType.SOLO ? gameToModify.bestSoloTimes : gameToModify.bestMultiTimes, isSimple: isSimple};
    }

    private async putTableInDB(gameName: string, tableToPost: IScoreResponse, gameType: GameType): Promise<void> {
        const dataToSend: Partial<IGame> = gameType === GameType.SOLO ? {bestSoloTimes: tableToPost.table} :
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
            throw new AbstractDataBaseError(error.message);
        }
    }
}
