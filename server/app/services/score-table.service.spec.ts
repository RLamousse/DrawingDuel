// We want to use some magic numbers in the tests
/* tslint:disable:no-magic-numbers */
import {expect} from "chai";
import {anything, instance, mock, when} from "ts-mockito";
import {
    AbstractDataBaseError,
    InvalidGameInfoError,
    NonExistentGameError
} from "../../../common/errors/database.errors";
import {ScoreNotGoodEnough} from "../../../common/errors/services.errors";
import {IFreeGame} from "../../../common/model/game/free-game";
import {IRecordTime} from "../../../common/model/game/record-time";
import {ISimpleGame} from "../../../common/model/game/simple-game";
import {DataBaseService} from "./data-base.service";
import {FreeGamesCollectionService} from "./db/free-games.collection.service";
import {SimpleGamesCollectionService} from "./db/simple-games.collection.service";
import {ScoreTableService} from "./score-table.service";

describe("ScoreTableService", () => {
    // @ts-ignore
    const EMPTY_TIME: IRecordTime = null;
    const VERY_HIGHT_TIME_SCORE_BOY: IRecordTime = {name: "Tommy", time: 15};
    const HIGHT_TIME_SCORE_BOY: IRecordTime = {name: "Tommy", time: 7};
    const MIDDLE_TIME_SCORE_BOY: IRecordTime = {name: "Phil", time: 3};
    const LOW_TIME_SCORE_BOY: IRecordTime = {name: "Bob", time: 1};
    const SAME_THAN_FIRST_SCORE: IRecordTime = {name: "Peter", time: 2};
    const SAME_THAN_SECOND_SCORE: IRecordTime = {name: "Jane", time: 5};
    const SAME_THAN_THIRD_SCORE: IRecordTime = {name: "Anthony", time: 10};
    const INITIAL_SCORE_TABLE: IRecordTime[] = [{name: "Paul", time: 2},
                                                {name: "Jack", time: 5},
                                                {name: "Bill", time: 10}];

    let mockedDataBaseService: DataBaseService;
    let mockedSimpleGames: SimpleGamesCollectionService;
    let mockedFreeGames: FreeGamesCollectionService;

    const initScoreTableService: () => ScoreTableService = () => {
        when(mockedDataBaseService.simpleGames).thenReturn(instance(mockedSimpleGames));
        when(mockedDataBaseService.freeGames).thenReturn(instance(mockedFreeGames));

        return new ScoreTableService(instance(mockedDataBaseService));
    };

    beforeEach(() => {
        mockedDataBaseService = mock(DataBaseService);
        mockedSimpleGames = mock(SimpleGamesCollectionService);
        mockedFreeGames = mock(FreeGamesCollectionService);
        when(mockedFreeGames.getFromId(anything())).thenReject(new NonExistentGameError());
        when(mockedSimpleGames.getFromId(anything()))
            .thenResolve({bestSoloTimes: JSON.parse(JSON.stringify(INITIAL_SCORE_TABLE)),
                          bestMultiTimes: JSON.parse(JSON.stringify(INITIAL_SCORE_TABLE))} as ISimpleGame);
    });

    describe("Modify scores", () => {
        it("should throw score error if null time inserted", async () => {

            return initScoreTableService().updateTableScore("tom", EMPTY_TIME, true).catch((reason: ScoreNotGoodEnough) => {
                expect(reason.message).to.contain("null");
            });
        });

        it("should throw ScoreNotGoodEnough error if the score has a too high value", async () => {

            return initScoreTableService().updateTableScore("tom", VERY_HIGHT_TIME_SCORE_BOY, true).catch((reason: ScoreNotGoodEnough) => {
                expect(reason.message).to.eql(ScoreNotGoodEnough.SCORE_NOT_GOOD_ENOUGH);
            });
        });

        it("should throw if the data-base throws unpredicted error(update simple game)", async () => {

            when(mockedSimpleGames.update(anything(), anything())).thenReject(new InvalidGameInfoError());

            return initScoreTableService().updateTableScore("tom", HIGHT_TIME_SCORE_BOY, true)
                .catch((reason: AbstractDataBaseError) => {
                expect(reason.message).to.eql(new AbstractDataBaseError(InvalidGameInfoError.GAME_INFO_FORMAT_ERROR_MESSAGE).message);
            });
        });

        it("should return 3 if the score deserves the third place(simple games)", async () => {

            when(mockedSimpleGames.update(anything(), anything())).thenResolve();

            return initScoreTableService().updateTableScore("tom", HIGHT_TIME_SCORE_BOY, true).then((value: number) => {
                expect(value).to.eql(3);
            });
        });

        it("should return 2 if the score deserves the second place(simple games)", async () => {

            when(mockedSimpleGames.update(anything(), anything())).thenResolve();

            return initScoreTableService().updateTableScore("tom", MIDDLE_TIME_SCORE_BOY, true).then((value: number) => {
                expect(value).to.eql(2);
            });
        });

        it("should return 1 if the score deserves the first place(simple games)", async () => {

            when(mockedSimpleGames.update(anything(), anything())).thenResolve();

            return initScoreTableService().updateTableScore("tom", LOW_TIME_SCORE_BOY, true).then((value: number) => {
                expect(value).to.eql(1);
            });
        });

        it("should return 1 if the score deserves the first place(free games)", async () => {

            when(mockedFreeGames.getFromId(anything()))
                .thenResolve({bestSoloTimes: JSON.parse(JSON.stringify(INITIAL_SCORE_TABLE)),
                              bestMultiTimes: JSON.parse(JSON.stringify(INITIAL_SCORE_TABLE))} as IFreeGame);
            when(mockedFreeGames.update(anything(), anything())).thenResolve();

            return initScoreTableService().updateTableScore("tom", LOW_TIME_SCORE_BOY, true).then((value: number) => {
                expect(value).to.eql(1);
            });
        });

        it("should throw ScoreNotGoodEnough error if the score is the same as third place", async () => {

            when(mockedSimpleGames.update(anything(), anything())).thenResolve();

            return initScoreTableService().updateTableScore("tom", SAME_THAN_THIRD_SCORE, true).catch((reason: ScoreNotGoodEnough) => {
                expect(reason.message).to.eql(ScoreNotGoodEnough.SCORE_NOT_GOOD_ENOUGH);
            });
        });

        it("should return 3 if the score is the same as the one in second place(simple games)", async () => {

            when(mockedSimpleGames.update(anything(), anything())).thenResolve();

            return initScoreTableService().updateTableScore("tom", SAME_THAN_SECOND_SCORE, true).then((value: number) => {
                expect(value).to.eql(3);
            });
        });

        it("should return 2 if the score is the same as the one in first place(simple games)", async () => {

            when(mockedSimpleGames.update(anything(), anything())).thenResolve();

            return initScoreTableService().updateTableScore("tom", SAME_THAN_FIRST_SCORE, true).then((value: number) => {
                expect(value).to.eql(2);
            });
        });
    });
    describe("Reset scores", () => {
        it("should throw if the name is not an existing name", async () => {

            when(mockedSimpleGames.getFromId(anything())).thenReject(new NonExistentGameError());

            return initScoreTableService().resetScores("tom").catch((reason: NonExistentGameError) => {
                expect(reason.message).to.eql(NonExistentGameError.NON_EXISTENT_GAME_ERROR_MESSAGE);
            });
        });

        it("should throw if the data-base throws unpredicted error(get simple game)", async () => {

            when(mockedSimpleGames.getFromId(anything())).thenReject(new InvalidGameInfoError());

            return initScoreTableService().resetScores("tom").catch((reason: AbstractDataBaseError) => {
                expect(reason.message).to.eql((new AbstractDataBaseError(InvalidGameInfoError.GAME_INFO_FORMAT_ERROR_MESSAGE).message));
            });
        });

        it("should throw if the data-base throws unpredicted error(get free game)", async () => {

            when(mockedFreeGames.getFromId(anything())).thenReject(new InvalidGameInfoError());

            return initScoreTableService().resetScores("tom").catch((reason: AbstractDataBaseError) => {
                expect(reason.message).to.eql((new AbstractDataBaseError(InvalidGameInfoError.GAME_INFO_FORMAT_ERROR_MESSAGE).message));
            });
        });

        it("should not throw if the name is an existing name(simple)", async () => {

            when(mockedFreeGames.update(anything(), anything())).thenResolve();

            return initScoreTableService().resetScores("tom");
        });

        it("should not throw if the name is an existing name(free)", async () => {

            when(mockedFreeGames.getFromId(anything()))
                .thenResolve({bestSoloTimes: JSON.parse(JSON.stringify(INITIAL_SCORE_TABLE)),
                              bestMultiTimes: JSON.parse(JSON.stringify(INITIAL_SCORE_TABLE))} as IFreeGame);
            when(mockedFreeGames.update(anything(), anything())).thenResolve();

            return initScoreTableService().resetScores("tom");
        });

        it("should throw if the data-base throws unpredicted error(update simple game)", async () => {

            when(mockedSimpleGames.update(anything(), anything())).thenReject(new InvalidGameInfoError());

            return initScoreTableService().resetScores("tom").catch((reason: AbstractDataBaseError) => {
                expect(reason.message).to.eql((new AbstractDataBaseError(InvalidGameInfoError.GAME_INFO_FORMAT_ERROR_MESSAGE).message));
            });
        });
    });
});
