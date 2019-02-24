// tslint:disable:no-magic-numbers
import Axios from "axios";
// tslint:disable-next-line:no-duplicate-imports Weird interaction between singletons and interface (olivier st-o approved)
import MockAdapter from "axios-mock-adapter";
import AxiosAdapter from "axios-mock-adapter";
import {expect} from "chai";
import * as fs from "fs";
import * as HttpStatus from "http-status-codes";
import {anything, instance, mock, when} from "ts-mockito";
import {ISimpleDifferenceData} from "../../../common/model/game/simple-game";
import {IPoint, ORIGIN} from "../../../common/model/point";
import {DIFFERENCE_ERROR_MESSAGE, NAME_ERROR_MESSAGE} from "../controllers/controller-utils";
import {NON_EXISTING_GAME_ERROR_MESSAGE} from "./db/simple-games.collection.service";
import {DifferenceEvaluatorService} from "./difference-evaluator.service";
import {EXPECTED_DIFF_NUMBER, GameCreatorService} from "./game-creator.service";
import {ImageUploadService} from "./image-upload.service";
import {Themes} from "../../../common/free-game-json-interface/FreeGameCreatorInterface/free-game-enum";
import {FreeGameCreatorService} from "./free-game-creator.service";

describe("A service that creates a game", () => {

    let axiosMock: MockAdapter;
    let mockedDifferenceEvaluatorServiceMock: DifferenceEvaluatorService;
    let mockedImageUploadService: ImageUploadService;
    let mockedFreeGameCreatorService: FreeGameCreatorService;

    const createdMockedDiffData: (diffCount: number) => ISimpleDifferenceData = (diffCount: number) => {
        const mockedDifferenceData: Map<number, IPoint[]> = new Map();
        for (let i: number = 0; i < diffCount; i++) {
            mockedDifferenceData.set(i, [ORIGIN]);
        }

        return Array.from(mockedDifferenceData.entries());
    };

    const getMockedService: () => GameCreatorService = () => {
        return new GameCreatorService(
            instance(mockedDifferenceEvaluatorServiceMock),
            instance(mockedImageUploadService),
            instance(mockedFreeGameCreatorService),
        );
    };

    beforeEach(() => {
        axiosMock = new AxiosAdapter(Axios);

        mockedDifferenceEvaluatorServiceMock = mock(DifferenceEvaluatorService);
        mockedImageUploadService = mock(ImageUploadService);
        mockedFreeGameCreatorService = mock(FreeGameCreatorService);

        when(mockedDifferenceEvaluatorServiceMock.getSimpleNDifferences(anything())).thenReturn(createdMockedDiffData(EXPECTED_DIFF_NUMBER));
        when(mockedImageUploadService.uploadImage(anything())).thenResolve("");
    });

    describe("Create simple game", () => {

        it("should throw a name error if the game name is already in the data base", async () => {

            axiosMock.onGet("http://localhost:3000/api/data-base/games/simple/nonExistingGameTest")
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

            axiosMock.onGet("http://localhost:3000/api/data-base/games/simple/someGameTest")
                .reply(HttpStatus.NOT_FOUND, {message: NON_EXISTING_GAME_ERROR_MESSAGE});
            axiosMock.onGet("http://localhost:3000/api/data-base/games/free/someGameTest")
                .reply(HttpStatus.NOT_FOUND, {message: NON_EXISTING_GAME_ERROR_MESSAGE});

            axiosMock.onPost("http://localhost:3000/api/image-diff/")
                .reply(HttpStatus.OK, fs.readFileSync("test/test_files_for_game_creator_service/6diff-modified.bmp"));

            when(mockedDifferenceEvaluatorServiceMock.getSimpleNDifferences(anything())).thenReturn(createdMockedDiffData(EXPECTED_DIFF_NUMBER - 1));

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

            axiosMock.onGet("http://localhost:3000/api/data-base/games/simple/someGameTest")
                .reply(HttpStatus.NOT_FOUND, {message: NON_EXISTING_GAME_ERROR_MESSAGE});
            axiosMock.onGet("http://localhost:3000/api/data-base/games/free/someGameTest")
                .reply(HttpStatus.NOT_FOUND, {message: NON_EXISTING_GAME_ERROR_MESSAGE});

            axiosMock.onPost("http://localhost:3000/api/image-diff/")
                .reply(HttpStatus.OK, fs.readFileSync("test/test_files_for_game_creator_service/8diff-modified.bmp"));

            when(mockedDifferenceEvaluatorServiceMock.getSimpleNDifferences(anything())).thenReturn(createdMockedDiffData(EXPECTED_DIFF_NUMBER + 1));

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

        it("should throw on diff image microservice call error", async () => {
            axiosMock.onGet("http://localhost:3000/api/data-base/games/simple/someGameTest")
                .reply(HttpStatus.NOT_FOUND, {message: NON_EXISTING_GAME_ERROR_MESSAGE});
            axiosMock.onGet("http://localhost:3000/api/data-base/games/free/someGameTest")
                .reply(HttpStatus.NOT_FOUND, {message: NON_EXISTING_GAME_ERROR_MESSAGE});

            axiosMock.onPost("http://localhost:3000/api/image-diff/")
                .reply(HttpStatus.INTERNAL_SERVER_ERROR, {message: "error"});

            return getMockedService()
                    .createSimpleGame(
                        "someGameTest",
                        fs.readFileSync("test/test_files_for_game_creator_service/original.bmp"),
                        fs.readFileSync("test/test_files_for_game_creator_service/7diff-modified.bmp"))
                    .catch((reason: Error) => {
                        expect(reason.message).to.eql("game diff: error");
                    });
        });

        it("should throw on differenceEvaluatorService call error", async () => {
            axiosMock.onGet("http://localhost:3000/api/data-base/games/simple/someGameTest")
                .reply(HttpStatus.NOT_FOUND, {message: NON_EXISTING_GAME_ERROR_MESSAGE});
            axiosMock.onGet("http://localhost:3000/api/data-base/games/free/someGameTest")
                .reply(HttpStatus.NOT_FOUND, {message: NON_EXISTING_GAME_ERROR_MESSAGE});

            axiosMock.onPost("http://localhost:3000/api/image-diff/")
                .reply(HttpStatus.OK, fs.readFileSync("test/test_files_for_game_creator_service/7diff-modified.bmp"));

            when(mockedDifferenceEvaluatorServiceMock.getSimpleNDifferences(anything())).thenThrow(new Error("error"));

            return getMockedService()
                .createSimpleGame(
                    "someGameTest",
                    fs.readFileSync("test/test_files_for_game_creator_service/original.bmp"),
                    fs.readFileSync("test/test_files_for_game_creator_service/7diff-modified.bmp"))
                .catch((reason: Error) => {
                    expect(reason.message).to.eql("bmp diff counting: error");
                });
        });

        it("should throw on db get game call error", async () => {
            axiosMock.onGet("http://localhost:3000/api/data-base/games/simple/someGameTest")
                .reply(HttpStatus.INTERNAL_SERVER_ERROR, {message: "error"});

            return getMockedService()
                .createSimpleGame(
                    "someGameTest",
                    fs.readFileSync("test/test_files_for_game_creator_service/original.bmp"),
                    fs.readFileSync("test/test_files_for_game_creator_service/7diff-modified.bmp"))
                .catch((reason: Error) => {
                    expect(reason.message).to.eql("dataBase: error");
                });
        });

        it("should throw on ImageUploadService call error", async () => {
            axiosMock.onGet("http://localhost:3000/api/data-base/games/simple/someGameTest")
                .reply(HttpStatus.NOT_FOUND, {message: NON_EXISTING_GAME_ERROR_MESSAGE});
            axiosMock.onGet("http://localhost:3000/api/data-base/games/free/someGameTest")
                .reply(HttpStatus.NOT_FOUND, {message: NON_EXISTING_GAME_ERROR_MESSAGE});

            axiosMock.onPost("http://localhost:3000/api/image-diff/")
                .reply(HttpStatus.OK, fs.readFileSync("test/test_files_for_game_creator_service/7diff-modified.bmp"));

            when(mockedImageUploadService.uploadImage(anything())).thenThrow(new Error("error"));

            return getMockedService()
                .createSimpleGame(
                    "someGameTest",
                    fs.readFileSync("test/test_files_for_game_creator_service/original.bmp"),
                    fs.readFileSync("test/test_files_for_game_creator_service/7diff-modified.bmp"))
                .catch((reason: Error) => {
                    expect(reason.message).to.eql("dataBase: error");
                });
        });

        it("should throw on db create game call error", async () => {

            axiosMock.onGet("http://localhost:3000/api/data-base/games/simple/someGameTest")
                .reply(HttpStatus.NOT_FOUND, {message: NON_EXISTING_GAME_ERROR_MESSAGE});
            axiosMock.onGet("http://localhost:3000/api/data-base/games/free/someGameTest")
                .reply(HttpStatus.NOT_FOUND, {message: NON_EXISTING_GAME_ERROR_MESSAGE});

            axiosMock.onPost("http://localhost:3000/api/image-diff/")
                .reply(HttpStatus.OK, fs.readFileSync("test/test_files_for_game_creator_service/7diff-modified.bmp"));

            axiosMock.onPost("http://localhost:3000/api/data-base/games/simple/")
                .reply(HttpStatus.INTERNAL_SERVER_ERROR, new Error("error"));

            return getMockedService()
                .createSimpleGame(
                    "someGameTest",
                    fs.readFileSync("test/test_files_for_game_creator_service/original.bmp"),
                    fs.readFileSync("test/test_files_for_game_creator_service/7diff-modified.bmp"))
                .catch((reason: Error) => {
                    expect(reason.message).to.eql("dataBase: Unable to create game: error");
                });
        });

        it("should return a success message if everything is good", async () => {

            axiosMock.onGet("http://localhost:3000/api/data-base/games/simple/someGameTest")
                .reply(HttpStatus.NOT_FOUND, {message: NON_EXISTING_GAME_ERROR_MESSAGE});
            axiosMock.onGet("http://localhost:3000/api/data-base/games/free/someGameTest")
                .reply(HttpStatus.NOT_FOUND, {message: NON_EXISTING_GAME_ERROR_MESSAGE});

            axiosMock.onPost("http://localhost:3000/api/image-diff/")
                .reply(HttpStatus.OK, fs.readFileSync("test/test_files_for_game_creator_service/7diff-modified.bmp"));

            axiosMock.onPost("http://localhost:3000/api/data-base/games/simple/")
                .reply(HttpStatus.OK);

            when(mockedDifferenceEvaluatorServiceMock.getSimpleNDifferences(anything())).thenReturn(createdMockedDiffData(EXPECTED_DIFF_NUMBER));

            return expect((await getMockedService()
                .createSimpleGame(
                "someGameTest",
                fs.readFileSync("test/test_files_for_game_creator_service/original.bmp"),
                fs.readFileSync("test/test_files_for_game_creator_service/7diff-modified.bmp"))).title)
                .to.be.equal("Game created");
        });
    });
    //TODO mock the free game creator class
    describe("Create free game", () => {

        it("should throw a name error if the game name is already in the free games data base(simple game name existence)", async () => {

            axiosMock.onGet("http://localhost:3000/api/data-base/games/simple/nonExistingGameTest")
                .reply(HttpStatus.NOT_FOUND);
            axiosMock.onGet("http://localhost:3000/api/data-base/games/free/nonExistingGameTest")
                .reply(HttpStatus.OK);

            try {
                await getMockedService()
                    .createFreeGame( "nonExistingGameTest",
                        0,
                        Themes.Geometry,
                        []);
            } catch (error) {
                return expect(error.message).to.be.equal(NAME_ERROR_MESSAGE);
            }

            return expect.fail();
        });

        it("should throw a name error if the game name is already in the simple games data base(free game name existence)", async () => {

            axiosMock.onGet("http://localhost:3000/api/data-base/games/simple/nonExistingGameTest")
                .reply(HttpStatus.OK);

            try {
                await getMockedService()
                    .createFreeGame( "nonExistingGameTest",
                        0,
                        Themes.Geometry,
                        []);
            } catch (error) {
                return expect(error.message).to.be.equal(NAME_ERROR_MESSAGE);
            }

            return expect.fail();
        });

        it("should throw error on db get simple game call(simple name existence testing)", async () => {
            axiosMock.onGet("http://localhost:3000/api/data-base/games/simple/someGameTest")
                .reply(HttpStatus.INTERNAL_SERVER_ERROR, {message: "error"});

            return getMockedService()
                .createFreeGame( "someGameTest",
                    0,
                    Themes.Geometry,
                    [])
                .catch((reason: Error) => {
                    expect(reason.message).to.eql("dataBase: error");
                });
        });

        it("should throw error on db get free game call(free game name existence testing)", async () => {

            axiosMock.onGet("http://localhost:3000/api/data-base/games/simple/someGameTest")
                .reply(HttpStatus.NOT_FOUND, {message: NON_EXISTING_GAME_ERROR_MESSAGE});
            axiosMock.onGet("http://localhost:3000/api/data-base/games/free/someGameTest")
                .reply(HttpStatus.INTERNAL_SERVER_ERROR, {message: "error"});

            return getMockedService()
                .createFreeGame( "someGameTest",
                    0,
                    Themes.Geometry,
                    [])
                .catch((reason: Error) => {
                    expect(reason.message).to.eql("dataBase: error");
                });
        });

        //TODO wrong number of objects
        //TODO wrong theme
        //TODO wrong modTypes

        it("should throw error on db create game call", async () => {

            axiosMock.onGet("http://localhost:3000/api/data-base/games/simple/someGameTest")
                .reply(HttpStatus.NOT_FOUND, {message: NON_EXISTING_GAME_ERROR_MESSAGE});
            axiosMock.onGet("http://localhost:3000/api/data-base/games/free/someGameTest")
                .reply(HttpStatus.NOT_FOUND, {message: NON_EXISTING_GAME_ERROR_MESSAGE});

            axiosMock.onPost("http://localhost:3000/api/data-base/games/free/")
                .reply(HttpStatus.INTERNAL_SERVER_ERROR, new Error("error"));

            return getMockedService()
                .createFreeGame( "someGameTest",
                    100,
                    Themes.Geometry,
                    [])//TODO phil modtypes
                .catch((reason: Error) => {
                    expect(reason.message).to.eql("dataBase: Unable to create game: error");
                });
        });

        it("should return a success message if everything is good", async () => {

            axiosMock.onGet("http://localhost:3000/api/data-base/games/simple/someGameTest")
                .reply(HttpStatus.NOT_FOUND, {message: NON_EXISTING_GAME_ERROR_MESSAGE});
            axiosMock.onGet("http://localhost:3000/api/data-base/games/free/someGameTest")
                .reply(HttpStatus.NOT_FOUND, {message: NON_EXISTING_GAME_ERROR_MESSAGE});

            axiosMock.onPost("http://localhost:3000/api/data-base/games/free/")
                .reply(HttpStatus.OK);

            return expect((await getMockedService()
                .createFreeGame( "someGameTest",
                    100,
                    Themes.Geometry,
                    [])).title)//TODO phil modtypes
                .to.be.equal("Game created");
        });
    });
});
