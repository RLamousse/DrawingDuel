// tslint:disable:no-magic-numbers
import Axios from "axios";
import MockAdapter from "axios-mock-adapter";
// tslint:disable-next-line:no-duplicate-imports Weird interaction between singletons and interface (olivier st-o approved)
import AxiosAdapter from "axios-mock-adapter";
import { expect } from "chai";
import * as fs from "fs";
import * as HttpStatus from "http-status-codes";
import {anything, instance, mock, when} from "ts-mockito";
import {IPoint, ORIGIN} from "../../../common/model/point";
import {DIFFERENCE_ERROR_MESSAGE, NAME_ERROR_MESSAGE} from "../controllers/controller-utils";
import {NON_EXISTING_GAME_ERROR_MESSAGE} from "./db/games.collection.service";
import {DifferenceEvaluatorService} from "./difference-evaluator.service";
import {EXPECTED_DIFF_NUMBER, GameCreatorService} from "./game-creator.service";
import {ImageUploadService} from "./image-upload.service";

describe("A service that creates a game", () => {

    let axiosMock: MockAdapter;
    let mockedDifferenceEvaluatorServiceMock: DifferenceEvaluatorService;
    let mockedImageUploadService: ImageUploadService;

    beforeEach(() => {
        axiosMock = new AxiosAdapter(Axios);

        mockedDifferenceEvaluatorServiceMock = mock(DifferenceEvaluatorService);
        mockedImageUploadService = mock(ImageUploadService);

        when(mockedImageUploadService.uploadImage(anything())).thenResolve("");
    });

    it("should throw a name error if the game name is already in the data base", async () => {

        axiosMock.onGet("http://localhost:3000/api/data-base/games/nonExistingGameTest")
            .reply(HttpStatus.OK);

        try {
            await getMockedService()
                .createSimpleGame( "nonExistingGameTest",
                                   fs.readFileSync("test/test_files_for_game_creator_service/original.bmp"),
                                   fs.readFileSync("test/test_files_for_game_creator_service/7diff-modified.bmp"));
        } catch (error) {
            return expect(error.message).to.be.equal(NAME_ERROR_MESSAGE);
        }

        return expect.fail();
    });

    it("should throw a difference error if there are less than 7 differences", async () => {

        axiosMock.onGet("http://localhost:3000/api/data-base/games/someGameTest")
            .reply(HttpStatus.NOT_FOUND, {message: NON_EXISTING_GAME_ERROR_MESSAGE});

        axiosMock.onPost("http://localhost:3000/api/image-diff/")
            .reply(HttpStatus.OK, fs.readFileSync("test/test_files_for_game_creator_service/6diff-modified.bmp"));

        when(mockedDifferenceEvaluatorServiceMock.getNDifferences(anything())).thenReturn(createdMockedDiffData(EXPECTED_DIFF_NUMBER - 1));

        try {
            await getMockedService()
                .createSimpleGame( "someGameTest",
                                   fs.readFileSync("test/test_files_for_game_creator_service/original.bmp"),
                                   fs.readFileSync("test/test_files_for_game_creator_service/6diff-modified.bmp"));
        } catch (error) {
            return expect(error.message).to.be.equal(DIFFERENCE_ERROR_MESSAGE);
        }

        return expect.fail();
    });

    it("should throw a difference error if there are more than 7 differences", async () => {

        axiosMock.onGet("http://localhost:3000/api/data-base/games/someGameTest")
            .reply(HttpStatus.NOT_FOUND, {message: NON_EXISTING_GAME_ERROR_MESSAGE});

        axiosMock.onPost("http://localhost:3000/api/image-diff/")
            .reply(HttpStatus.OK, fs.readFileSync("test/test_files_for_game_creator_service/8diff-modified.bmp"));

        when(mockedDifferenceEvaluatorServiceMock.getNDifferences(anything())).thenReturn(createdMockedDiffData(EXPECTED_DIFF_NUMBER + 1));

        try {
            await getMockedService()
                .createSimpleGame( "someGameTest",
                                   fs.readFileSync("test/test_files_for_game_creator_service/original.bmp"),
                                   fs.readFileSync("test/test_files_for_game_creator_service/8diff-modified.bmp"));
        } catch (error) {
            return expect(error.message).to.be.equal(DIFFERENCE_ERROR_MESSAGE);
        }

        return expect.fail();
    });

    it("should return a success message if everything is good", async () => {

        axiosMock.onGet("http://localhost:3000/api/data-base/games/someGameTest")
            .reply(HttpStatus.NOT_FOUND, {message: NON_EXISTING_GAME_ERROR_MESSAGE});

        axiosMock.onPost("http://localhost:3000/api/image-diff/")
            .reply(HttpStatus.OK, fs.readFileSync("test/test_files_for_game_creator_service/7diff-modified.bmp"));

        axiosMock.onPost("http://localhost:3000/api/data-base/games")
            .reply(HttpStatus.OK);

        when(mockedDifferenceEvaluatorServiceMock.getNDifferences(anything())).thenReturn(createdMockedDiffData(EXPECTED_DIFF_NUMBER));

        expect((await getMockedService()
            .createSimpleGame(
            "someGameTest",
            fs.readFileSync("test/test_files_for_game_creator_service/original.bmp"),
            fs.readFileSync("test/test_files_for_game_creator_service/7diff-modified.bmp"))).title).to.be.equal("Game created");
    });

    const createdMockedDiffData = (diffCount: number) => {
        const mockedDifferenceData: Map<number, IPoint[]> = new Map();
        for (let i: number = 0; i < diffCount; i++) {
            mockedDifferenceData.set(i, [ORIGIN]);
        }

        return mockedDifferenceData;
    };

    const getMockedService = () => {
        return new GameCreatorService(
            instance(mockedDifferenceEvaluatorServiceMock),
            instance(mockedImageUploadService),
        );
    } ;
});
