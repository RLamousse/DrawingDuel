import Axios from "axios";
import MockAdapter from "axios-mock-adapter";
// tslint:disable-next-line:no-duplicate-imports Weird interaction between singletons and interface (olivier st-o approved)
import AxiosAdapter from "axios-mock-adapter";
import {expect} from "chai";
import * as HttpStatus from "http-status-codes";
import {DifferenceCluster, ISimpleDifferenceData, ISimpleGame} from "../../../common/model/game/simple-game";
import {IPoint, ORIGIN} from "../../../common/model/point";
import {NON_EXISTING_GAME_ERROR_MESSAGE} from "./db/simple-games.collection.service";
import {DiffValidatorService, INVALID_POINT_ERROR_MESSAGE, NO_DIFFERENCE_AT_POINT_ERROR_MESSAGE} from "./diff-validator.service";
import {EXPECTED_DIFF_NUMBER} from "./game-creator.service";

describe("A service validating if there is a difference at a coord for a game", () => {

    let axiosMock: MockAdapter;
    const diffValidatorService: DiffValidatorService = new DiffValidatorService();

    const createdMockedDiffData: (diffCount: number) => ISimpleDifferenceData = (diffCount: number) => {
        const mockedDifferenceData: Map<number, IPoint[]> = new Map();
        for (let i: number = 0; i < diffCount; i++) {
            mockedDifferenceData.set(i, [ORIGIN]);
        }

        return Array.from(mockedDifferenceData.entries());
    };

    const mockedSimpleGame: ISimpleGame = {
        gameName: "simpleGame",
        originalImage: "",
        modifiedImage: "",
        bestSoloTimes: [],
        bestMultiTimes: [],
        diffData: createdMockedDiffData(EXPECTED_DIFF_NUMBER),
    };

    beforeEach(() => {
        axiosMock = new AxiosAdapter(Axios);
    });

    it("should throw if the point is out of bounds (x < 0)", async () => {
        return diffValidatorService.getDifferenceCluster("game", {x: -1, y: 0})
            .catch((reason: Error) => {
                expect(reason.message).to.equal(INVALID_POINT_ERROR_MESSAGE);
            });
    });
    it("should throw if the point is out of bounds (y < 0)", async () => {
        return diffValidatorService.getDifferenceCluster("game", {x: 0, y: -1})
            .catch((reason: Error) => {
                expect(reason.message).to.equal(INVALID_POINT_ERROR_MESSAGE);
            });
    });
    it("should throw if the specified gameName is not valid", async () => {
        axiosMock.onGet("http://localhost:3000/api/data-base/games/simple/notAValidGame")
            .reply(HttpStatus.NOT_FOUND, {message: NON_EXISTING_GAME_ERROR_MESSAGE});

        return diffValidatorService.getDifferenceCluster("notAValidGame", ORIGIN)
            .catch((reason: Error) => {
                expect(reason.message).to.equal(NON_EXISTING_GAME_ERROR_MESSAGE);
            });
    });
    it("should return an empty list when the point is not part of a difference group", async () => {
        axiosMock.onGet("http://localhost:3000/api/data-base/games/simple/game")
            .reply(HttpStatus.OK, mockedSimpleGame);

        return diffValidatorService.getDifferenceCluster("game", {x: 42, y: 42})
            .catch((error: Error) => {
                expect(error.message).to.eql(NO_DIFFERENCE_AT_POINT_ERROR_MESSAGE);
            });
    });
    it("should return a difference group", async () => {
        axiosMock.onGet("http://localhost:3000/api/data-base/games/simple/game")
            .reply(HttpStatus.OK, mockedSimpleGame);

        return diffValidatorService.getDifferenceCluster("game", {x: 0, y: 0})
            .then((value: DifferenceCluster) => {
                return expect(value).to.eql(mockedSimpleGame.diffData[0]);
            });
    });
});
