// We want to use some magic numbers in the tests
/* tslint:disable:no-magic-numbers */
import Axios from "axios";
import MockAdapter from "axios-mock-adapter";
// tslint:disable-next-line:no-duplicate-imports Weird interaction between singletons and interface (olivier st-o approved)
import AxiosAdapter from "axios-mock-adapter";
import {expect} from "chai";
import * as HttpStatus from "http-status-codes";
import {Message} from "../../../common/communication/messages/message";
import {DB_FREE_GAME, DB_SIMPLE_GAME, SERVER_BASE_URL} from "../../../common/communication/routes";
import {ScoreNotGoodEnough} from "../../../common/errors/services.errors";
import {IRecordTime} from "../../../common/model/game/record-time";
import {ScoreTableService} from "./score-table.service";
import {NonExistentGameError} from "../../../common/errors/database.errors";

const scoreTableService: ScoreTableService = new ScoreTableService();
describe("ScoreTableService", () => {
    let axiosMock: MockAdapter;
    const SUCCESS_MESSAGE: Message = {title: "success", body: "success"};
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

    beforeEach(() => {
        axiosMock = new AxiosAdapter(Axios);
        axiosMock.onGet(SERVER_BASE_URL + DB_SIMPLE_GAME + "tom")
            .reply(HttpStatus.OK, {bestSoloTimes: INITIAL_SCORE_TABLE});
        axiosMock.onGet(SERVER_BASE_URL + DB_FREE_GAME + "tom")
            .reply(HttpStatus.NOT_FOUND);
    });

    describe("Modify scores", () => {
        it("should throw score error if null time inserted", async () => {

            return scoreTableService.updateTableScore("tom", EMPTY_TIME, true).catch((reason: ScoreNotGoodEnough) => {
                expect(reason.message).to.contain("null");
            });
        });

        it("should throw ScoreNotGoodEnough error if the score has a too high value", async () => {

            return scoreTableService.updateTableScore("tom", VERY_HIGHT_TIME_SCORE_BOY, true).catch((reason: ScoreNotGoodEnough) => {
                expect(reason.message).to.eql(ScoreNotGoodEnough.SCORE_NOT_GOOD_ENOUGH);
            });
        });

        it("should return 3 if the score deserves the third place", async () => {

            axiosMock.onPut(SERVER_BASE_URL + DB_SIMPLE_GAME + "tom")
                .reply(HttpStatus.OK, SUCCESS_MESSAGE);

            return scoreTableService.updateTableScore("tom", HIGHT_TIME_SCORE_BOY, true).then((value: number) => {
                expect(value).to.eql(3);
            });
        });

        it("should return 2 if the score deserves the second place", async () => {

            axiosMock.onPut(SERVER_BASE_URL + DB_SIMPLE_GAME + "tom")
                .reply(HttpStatus.OK, SUCCESS_MESSAGE);

            return scoreTableService.updateTableScore("tom", MIDDLE_TIME_SCORE_BOY, true).then((value: number) => {
                expect(value).to.eql(2);
            });
        });

        it("should return 1 if the score deserves the first place", async () => {

            axiosMock.onPut(SERVER_BASE_URL + DB_SIMPLE_GAME + "tom")
                .reply(HttpStatus.OK, SUCCESS_MESSAGE);

            return scoreTableService.updateTableScore("tom", LOW_TIME_SCORE_BOY, true).then((value: number) => {
                expect(value).to.eql(1);
            });
        });

        it("should throw ScoreNotGoodEnough error if the score is the same as third place", async () => {

            axiosMock.onPut(SERVER_BASE_URL + DB_SIMPLE_GAME + "tom")
                .reply(HttpStatus.OK, SUCCESS_MESSAGE);

            return scoreTableService.updateTableScore("tom", SAME_THAN_THIRD_SCORE, true).catch((reason: ScoreNotGoodEnough) => {
                expect(reason.message).to.eql(ScoreNotGoodEnough.SCORE_NOT_GOOD_ENOUGH);
            });
        });

        it("should return 3 if the score is the same as the one in second place", async () => {

            axiosMock.onPut(SERVER_BASE_URL + DB_SIMPLE_GAME + "tom")
                .reply(HttpStatus.OK, SUCCESS_MESSAGE);

            return scoreTableService.updateTableScore("tom", SAME_THAN_SECOND_SCORE, true).then((value: number) => {
                expect(value).to.eql(3);
            });
        });

        it("should return 2 if the score is the same as the one in first place", async () => {

            axiosMock.onPut(SERVER_BASE_URL + DB_SIMPLE_GAME + "tom")
                .reply(HttpStatus.OK, SUCCESS_MESSAGE);

            return scoreTableService.updateTableScore("tom", SAME_THAN_FIRST_SCORE, true).then((value: number) => {
                expect(value).to.eql(2);
            });
        });
    });
    describe("Reset scores", () => {
        it("should throw if the name is not an existing name", async () => {

            axiosMock.onGet(SERVER_BASE_URL + DB_FREE_GAME + "tom")
                .reply(HttpStatus.NOT_FOUND);
            axiosMock.onGet(SERVER_BASE_URL + DB_SIMPLE_GAME + "tom")
                .reply(HttpStatus.NOT_FOUND);

            return scoreTableService.resetScores("tom").catch((reason: NonExistentGameError) => {
                expect(reason.message).to.eql(NonExistentGameError.NON_EXISTENT_GAME_ERROR_MESSAGE);
            });
        });

        it("should not throw if the name is an existing name", async () => {

            axiosMock.onPut(SERVER_BASE_URL + DB_SIMPLE_GAME + "tom")
                .reply(HttpStatus.OK, SUCCESS_MESSAGE);

            return scoreTableService.resetScores("tom");
        });
    });
});
