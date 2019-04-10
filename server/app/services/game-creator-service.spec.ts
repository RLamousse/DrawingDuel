/* tslint:disable:max-file-line-count */
// tslint:disable:no-magic-numbers
import Axios from "axios";
import MockAdapter from "axios-mock-adapter";
// tslint:disable-next-line:no-duplicate-imports Weird interaction between singletons and interface (olivier st-o approved)
import AxiosAdapter from "axios-mock-adapter";
import {expect} from "chai";
import * as fs from "fs";
import * as HttpStatus from "http-status-codes";
import {anything, instance, mock, when} from "ts-mockito";
import {DIFF_CREATOR_BASE, SERVER_BASE_URL} from "../../../common/communication/routes";
import {
    AbstractDataBaseError,
    AlreadyExistentGameError,
    NonExistentThemeError
} from "../../../common/errors/database.errors";
import {AbstractServiceError, DifferenceCountError} from "../../../common/errors/services.errors";
import {
    ModificationType,
    Themes
} from "../../../common/free-game-json-interface/FreeGameCreatorInterface/free-game-enum";
import {ISimpleDifferenceData} from "../../../common/model/game/simple-game";
import {getOrigin, IPoint} from "../../../common/model/point";
import {DataBaseService} from "./data-base.service";
import {FreeGamesCollectionService} from "./db/free-games.collection.service";
import {SimpleGamesCollectionService} from "./db/simple-games.collection.service";
import {DifferenceEvaluatorService} from "./difference-evaluator.service";
import {FreeGameCreatorService} from "./free-game-creator.service";
import {EXPECTED_DIFF_NUMBER, GameCreatorService} from "./game-creator.service";
import {ImageUploadService} from "./image-upload.service";

describe("A service that creates a game", () => {

    let axiosMock: MockAdapter;
    let mockedDifferenceEvaluatorServiceMock: DifferenceEvaluatorService;
    let mockedImageUploadService: ImageUploadService;
    let mockedFreeGameCreatorService: FreeGameCreatorService;
    let mockedDataBaseService: DataBaseService;
    let mockedSimpleGames: SimpleGamesCollectionService;
    let mockedFreeGames: FreeGamesCollectionService;

    const createdMockedDiffData: (diffCount: number) => ISimpleDifferenceData = (diffCount: number) => {
        const mockedDifferenceData: Map<number, IPoint[]> = new Map();
        for (let i: number = 0; i < diffCount; i++) {
            mockedDifferenceData.set(i, [getOrigin()]);
        }

        return Array.from(mockedDifferenceData.entries());
    };

    const getMockedService: () => GameCreatorService = () => {
        when(mockedDataBaseService.simpleGames).thenReturn(instance(mockedSimpleGames));
        when(mockedDataBaseService.freeGames).thenReturn(instance(mockedFreeGames));

        return new GameCreatorService(
            instance(mockedDifferenceEvaluatorServiceMock),
            instance(mockedDataBaseService),
            instance(mockedImageUploadService),
            instance(mockedFreeGameCreatorService),
        );
    };

    beforeEach(() => {
        axiosMock = new AxiosAdapter(Axios);

        mockedDataBaseService = mock(DataBaseService);
        mockedSimpleGames = mock(SimpleGamesCollectionService);
        mockedFreeGames = mock(FreeGamesCollectionService);
        mockedDifferenceEvaluatorServiceMock = mock(DifferenceEvaluatorService);
        mockedImageUploadService = mock(ImageUploadService);
        mockedFreeGameCreatorService = mock(FreeGameCreatorService);

        when(mockedSimpleGames.contains(anything())).thenResolve(false);
        when(mockedFreeGames.contains(anything())).thenResolve(false);
        when(mockedDifferenceEvaluatorServiceMock.getSimpleNDifferences(anything()))
            .thenReturn(createdMockedDiffData(EXPECTED_DIFF_NUMBER));
        when(mockedImageUploadService.uploadImage(anything())).thenResolve("");
        when(mockedFreeGameCreatorService.generateIScenes(anything(), anything(), Themes.Geometry))
            .thenReturn({originalObjects: [], modifiedObjects: [], differentObjects: []});
    });

    describe("Create simple game", () => {

        it("should throw a name error if the game name is already in the data base", async () => {

            when(mockedSimpleGames.contains(anything())).thenResolve(true);

            try {
                await getMockedService()
                    .createSimpleGame( "nonExistingGameTest",
                                       fs.readFileSync("test/test_files_for_game_creator_service/original.bmp"),
                                       fs.readFileSync("test/test_files_for_game_creator_service/7diff-modified.bmp"));
            } catch (error) {
                return expect(error.message).to.be.equal(AlreadyExistentGameError.ALREADY_EXISTENT_GAME_ERROR_MESSAGE);
            }

            return expect.fail();
        });

        it("should throw a difference error if there are less than 7 differences", async () => {

            axiosMock.onPost(SERVER_BASE_URL + DIFF_CREATOR_BASE)
                .reply(HttpStatus.OK, fs.readFileSync("test/test_files_for_game_creator_service/6diff-modified.bmp"));

            when(mockedDifferenceEvaluatorServiceMock.getSimpleNDifferences(anything()))
                .thenReturn(createdMockedDiffData(EXPECTED_DIFF_NUMBER - 1));

            try {
                await getMockedService()
                    .createSimpleGame( "someGameTest",
                                       fs.readFileSync("test/test_files_for_game_creator_service/original.bmp"),
                                       fs.readFileSync("test/test_files_for_game_creator_service/6diff-modified.bmp"));
            } catch (error) {
                return expect(error.message).to.be.equal(DifferenceCountError.DIFFERENCE_COUNT_ERROR_MESSAGE);
            }

            return expect.fail();
        });

        it("should throw a difference error if there are more than 7 differences", async () => {

            axiosMock.onPost(SERVER_BASE_URL + DIFF_CREATOR_BASE)
                .reply(HttpStatus.OK, fs.readFileSync("test/test_files_for_game_creator_service/8diff-modified.bmp"));

            when(mockedDifferenceEvaluatorServiceMock.getSimpleNDifferences(anything()))
                .thenReturn(createdMockedDiffData(EXPECTED_DIFF_NUMBER + 1));

            try {
                await getMockedService()
                    .createSimpleGame( "someGameTest",
                                       fs.readFileSync("test/test_files_for_game_creator_service/original.bmp"),
                                       fs.readFileSync("test/test_files_for_game_creator_service/8diff-modified.bmp"));
            } catch (error) {
                return expect(error.message).to.be.equal(DifferenceCountError.DIFFERENCE_COUNT_ERROR_MESSAGE);
            }

            return expect.fail();
        });

        it("should throw on diff image microservice call error", async () => {

            axiosMock.onPost(SERVER_BASE_URL + DIFF_CREATOR_BASE)
                .reply(HttpStatus.INTERNAL_SERVER_ERROR, {message: "error"});

            return getMockedService()
                    .createSimpleGame(
                        "someGameTest",
                        fs.readFileSync("test/test_files_for_game_creator_service/original.bmp"),
                        fs.readFileSync("test/test_files_for_game_creator_service/7diff-modified.bmp"))
                    .catch((reason: Error) => {
                        expect(reason.message).to.contain("game diff: error");
                    });
        });

        it("should throw on differenceEvaluatorService call error", async () => {

            axiosMock.onPost(SERVER_BASE_URL + DIFF_CREATOR_BASE)
                .reply(HttpStatus.OK, fs.readFileSync("test/test_files_for_game_creator_service/7diff-modified.bmp"));

            when(mockedDifferenceEvaluatorServiceMock.getSimpleNDifferences(anything())).thenThrow(new Error("error"));

            return getMockedService()
                .createSimpleGame(
                    "someGameTest",
                    fs.readFileSync("test/test_files_for_game_creator_service/original.bmp"),
                    fs.readFileSync("test/test_files_for_game_creator_service/7diff-modified.bmp"))
                .catch((reason: Error) => {
                    expect(reason.message).to.contain("bmp diff counting: error");
                });
        });

        it("should throw on db get game call error", async () => {
            when(mockedSimpleGames.contains(anything())).thenReject(new Error("error"));

            return getMockedService()
                .createSimpleGame(
                    "someGameTest",
                    fs.readFileSync("test/test_files_for_game_creator_service/original.bmp"),
                    fs.readFileSync("test/test_files_for_game_creator_service/7diff-modified.bmp"))
                .catch((reason: Error) => {
                    expect(reason.message).to.eql(new AbstractDataBaseError("error").message);
                });
        });

        it("should throw on ImageUploadService call error", async () => {

            axiosMock.onPost(SERVER_BASE_URL + DIFF_CREATOR_BASE)
                .reply(HttpStatus.OK, fs.readFileSync("test/test_files_for_game_creator_service/7diff-modified.bmp"));

            when(mockedImageUploadService.uploadImage(anything())).thenThrow(new Error("error"));

            return getMockedService()
                .createSimpleGame(
                    "someGameTest",
                    fs.readFileSync("test/test_files_for_game_creator_service/original.bmp"),
                    fs.readFileSync("test/test_files_for_game_creator_service/7diff-modified.bmp"))
                .catch((reason: Error) => {
                    expect(reason.message).to.eql(new AbstractServiceError("error").message);
                });
        });

        it("should throw on db create game call error", async () => {

            axiosMock.onPost(SERVER_BASE_URL + DIFF_CREATOR_BASE)
                .reply(HttpStatus.OK, fs.readFileSync("test/test_files_for_game_creator_service/7diff-modified.bmp"));

            when(mockedSimpleGames.create(anything())).thenReject(new Error("error"));

            return getMockedService()
                .createSimpleGame(
                    "someGameTest",
                    fs.readFileSync("test/test_files_for_game_creator_service/original.bmp"),
                    fs.readFileSync("test/test_files_for_game_creator_service/7diff-modified.bmp"))
                .catch((reason: Error) => {
                    expect(reason.message).to.eql(new AbstractDataBaseError("error").message);
                });
        });

        it("should return a success message if everything is good", async () => {

            axiosMock.onPost(SERVER_BASE_URL + DIFF_CREATOR_BASE)
                .reply(HttpStatus.OK, fs.readFileSync("test/test_files_for_game_creator_service/7diff-modified.bmp"));

            when(mockedSimpleGames.create(anything())).thenResolve({title: "Game created", body: "hurray"});

            when(mockedDifferenceEvaluatorServiceMock.getSimpleNDifferences(anything()))
                .thenReturn(createdMockedDiffData(EXPECTED_DIFF_NUMBER));

            return expect((await getMockedService()
                .createSimpleGame(
                "someGameTest",
                fs.readFileSync("test/test_files_for_game_creator_service/original.bmp"),
                fs.readFileSync("test/test_files_for_game_creator_service/7diff-modified.bmp"))).title)
                .to.be.equal("Game created");
        });
    });

    describe("Create free game", () => {

        it("should throw a name error if the game name is already in the free games data base(simple game name existence)", async () => {

            when(mockedFreeGames.contains(anything())).thenResolve(true);

            try {
                await getMockedService()
                    .createFreeGame( "nonExistingGameTest",
                                     0,
                                     Themes.Geometry,
                                     [ModificationType.add, ModificationType.remove, ModificationType.changeColor]);
            } catch (error) {
                return expect(error.message).to.be.equal(AlreadyExistentGameError.ALREADY_EXISTENT_GAME_ERROR_MESSAGE);
            }

            return expect.fail();
        });

        it("should throw a name error if the game name is already in the simple games data base(free game name existence)", async () => {

            when(mockedSimpleGames.contains(anything())).thenResolve(true);

            try {
                await getMockedService()
                    .createFreeGame( "nonExistingGameTest",
                                     0,
                                     Themes.Geometry,
                                     [ModificationType.add, ModificationType.remove, ModificationType.changeColor]);
            } catch (error) {
                return expect(error.message).to.be.equal(AlreadyExistentGameError.ALREADY_EXISTENT_GAME_ERROR_MESSAGE);
            }

            return expect.fail();
        });

        it("should throw error on db get simple game call", async () => {

            when(mockedSimpleGames.contains(anything())).thenReject(new Error("error"));

            return getMockedService()
                .createFreeGame( "someGameTest",
                                 0,
                                 Themes.Geometry,
                                 [ModificationType.add, ModificationType.remove, ModificationType.changeColor])
                .catch((reason: Error) => {
                    expect(reason.message).to.eql(new AbstractDataBaseError("error").message);
                });
        });

        it("should throw error on db get free game call", async () => {

            when(mockedFreeGames.contains(anything())).thenReject(new Error("error"));

            return getMockedService()
                .createFreeGame( "someGameTest",
                                 0,
                                 Themes.Geometry,
                                 [ModificationType.add, ModificationType.remove, ModificationType.changeColor])
                .catch((reason: Error) => {
                    expect(reason.message).to.eql(new AbstractDataBaseError("error").message);
                });
        });

        it("should throw error if the theme is other than Geometry", async () => {

            when(mockedFreeGames.create(anything())).thenReject(new Error("error"));

            return getMockedService()
                .createFreeGame( "someGameTest",
                                 100,
                                 Themes.Sanic,
                                 [ModificationType.add, ModificationType.remove, ModificationType.changeColor])
                .catch((reason: Error) => {
                    expect(reason.message).to.eql(NonExistentThemeError.NON_EXISTING_THEME_ERROR_MESSAGE);
                });
        });

        it("should throw error on db create game call", async () => {

            when(mockedFreeGames.create(anything())).thenReject(new Error("error"));

            return getMockedService()
                .createFreeGame( "someGameTest",
                                 100,
                                 Themes.Geometry,
                                 [ModificationType.add, ModificationType.remove, ModificationType.changeColor])
                .catch((reason: Error) => {
                    expect(reason.message).to.eql(new AbstractDataBaseError("error").message);
                });
        });

        it("should return a success message if everything is good", async () => {

            when(mockedFreeGames.create(anything())).thenResolve();

            when(mockedFreeGameCreatorService.generateIScenes(anything(), anything(), Themes.Geometry))
                .thenReturn({originalObjects: [], modifiedObjects: [], differentObjects: []});

            return expect((await getMockedService()
                .createFreeGame( "someGameTest",
                                 100,
                                 Themes.Geometry,
                                 [ModificationType.add, ModificationType.remove, ModificationType.changeColor])).title)
                .to.be.equal("Game created");
        });
    });
});
