import Axios from "axios";
import MockAdapter from "axios-mock-adapter";
import AxiosAdapter from "axios-mock-adapter";
import { expect } from "chai";
import * as fs from "fs";
import * as HttpStatus from "http-status-codes";
import * as os from "os";
import {DIFFERENCE_ERROR_MESSAGE, FORMAT_ERROR_MESSAGE, NAME_ERROR_MESSAGE} from "../controllers/controller-utils";

import {GAME_NAME_FIELD, NOT_EXISTING_GAME_MESSAGE_ERROR} from "./data-base.service";
import {DifferenceEvaluatorService} from "./difference-evaluator.service";
import { GameCreatorService } from "./game-creator.service";

const PATH_TO_TMP: string = os.tmpdir();
const GAME_CREATOR_SERVICE: GameCreatorService = new GameCreatorService(new DifferenceEvaluatorService());
const FILES_TO_COPY: String[] = ["original.bmp", "6diff-modified.bmp", "7diff-modified.bmp", "8diff-modified.bmp"];

describe("A service that creates a game", () => {

    before(() => {
        for (const FILE of FILES_TO_COPY) {
            // fs.createReadStream("./test/test_files_for_game_creator_service/" + FILE)
            //     .pipe(fs.createWriteStream(PATH_TO_TMP + FILE));
            fs.copyFile("./test/test_files_for_game_creator_service/" + FILE, PATH_TO_TMP + FILE, (err: Error) => {
                if (err) {
                    throw err;
                }
            });
        }
    });

    it("should throw a name error if the game name  is already in the data base", async () => {
        const MOCK: MockAdapter = new AxiosAdapter(Axios);

        MOCK.onGet("http://localhost:3000/api/data-base/get-game", { data: { [GAME_NAME_FIELD]: "nonExistingGameTest" } })
            .reply(HttpStatus.OK);

        try {
            await GAME_CREATOR_SERVICE.createSimpleGame( "nonExistingGameTest",
                                                         fs.readFileSync("test/test_files_for_game_creator_service/original.bmp"),
                                                         fs.readFileSync("test/test_files_for_game_creator_service/7diff-modified.bmp"));
        } catch (error) {
            return expect(error.message).to.be.equal(NAME_ERROR_MESSAGE);
        }

        return expect.fail();
    });

    it("should throw a format error if the strings of the files are not the name of existing files", async () => {

        try {
            await GAME_CREATOR_SERVICE.createSimpleGame( "someGameTest",
                                                         fs.readFileSync("test/test_files_for_game_creator_service/nonExistingFile.bmp"),
                                                         fs.readFileSync("test/test_files_for_game_creator_service/7diff-modified.bmp"));
        } catch (error) {
            return expect(error.message).to.be.equal(FORMAT_ERROR_MESSAGE);
        }

        return expect.fail();
    });

    it("should throw a difference error if there are less than 7 differences", async () => {

        const MOCK: MockAdapter = new AxiosAdapter(Axios);

        MOCK.onGet("http://localhost:3000/api/data-base/get-game", { data: { [GAME_NAME_FIELD]: "nonExistingGameTest" } })
            .reply(HttpStatus.INTERNAL_SERVER_ERROR, {message: NOT_EXISTING_GAME_MESSAGE_ERROR});

        MOCK.onGet("http://localhost:3000/api/image-diff/")
            .reply(HttpStatus.OK, {status: "ok",
                                   fileName: "original.bmp",
                                   filePath: "./test/test_files_for_game_creator_service/" + FILES_TO_COPY[1],
            });
        try {
            await GAME_CREATOR_SERVICE.createSimpleGame( "someGameTest",
                                                         fs.readFileSync("test/test_files_for_game_creator_service/original.bmp"),
                                                         fs.readFileSync("test/test_files_for_game_creator_service/6diff-modified.bmp"));
        } catch (error) {
            return expect(error.message).to.be.equal(DIFFERENCE_ERROR_MESSAGE);
        }

        return expect.fail();
    });

    it("should throw a difference error if there are more than 7 differences", async () => {

        const MOCK: MockAdapter = new AxiosAdapter(Axios);

        MOCK.onGet("http://localhost:3000/api/data-base/get-game", { data: { [GAME_NAME_FIELD]: "nonExistingGameTest" } })
            .reply(HttpStatus.INTERNAL_SERVER_ERROR, {message: NOT_EXISTING_GAME_MESSAGE_ERROR});

        MOCK.onGet("http://localhost:3000/api/image-diff/")
            .reply(HttpStatus.OK, {status: "ok",
                                   fileName: "original.bmp",
                                   filePath: "./test/test_files_for_game_creator_service/" + FILES_TO_COPY[3],
            });
        try {
            await GAME_CREATOR_SERVICE.createSimpleGame( "someGameTest",
                                                         fs.readFileSync("test/test_files_for_game_creator_service/original.bmp"),
                                                         fs.readFileSync("test/test_files_for_game_creator_service/8diff-modified.bmp"));
        } catch (error) {
            return expect(error.message).to.be.equal(DIFFERENCE_ERROR_MESSAGE);
        }

        return expect.fail();
    });

    it("should return a success message if everything is good", async () => {

        const MOCK: MockAdapter = new AxiosAdapter(Axios);

        MOCK.onGet("http://localhost:3000/api/data-base/get-game", { data: { [GAME_NAME_FIELD]: "nonExistingGameTest" } })
            .reply(HttpStatus.INTERNAL_SERVER_ERROR, {message: NOT_EXISTING_GAME_MESSAGE_ERROR});

        MOCK.onGet("http://localhost:3000/api/image-diff/")
            .reply(HttpStatus.OK, {status: "ok",
                                   fileName: "original.bmp",
                                   filePath: PATH_TO_TMP + FILES_TO_COPY[2],
            });

        MOCK.onPost("http://localhost:3000/api/data-base/add-game")
            .reply(HttpStatus.OK);

        expect((await GAME_CREATOR_SERVICE.createSimpleGame(
            "someGameTest",
            fs.readFileSync("test/test_files_for_game_creator_service/original.bmp"),
            fs.readFileSync("test/test_files_for_game_creator_service/7diff-modified.bmp"))).title).to.be.equal("Game created");
    });

    after(() => {
        for (const FILE of FILES_TO_COPY) {
            fs.unlink(PATH_TO_TMP + FILE, (error: Error) => {
                if (error) { throw error; }
            });
        }
    });
});
