import { expect } from "chai";
import {DIFFERENCE_ERROR_MESSAGE, FORMAT_ERROR_MESSAGE, GAME_NAME_KEY, NAME_ERROR_MESSAGE} from "../controllers/game-creator.controller";
import { GameCreatorService } from "./game-creator.service";

const gameCreatorService: GameCreatorService = new GameCreatorService();

describe("Game creator service", () => {

    before(() => {
        // TODO copy bmp files from test/test_files_for_game_creator_service to tmp/
    });

    it("should throw a format error if the strings are not the name of existing files", () => {
        expect(() => gameCreatorService.createSimpleGame( "", "", ""))
            .to.throw(FORMAT_ERROR_MESSAGE);
    });

    it("should throw a difference error if the files don't have 7 difference", () => {
        expect(() => gameCreatorService.createSimpleGame( "", "", ""))
            .to.throw(DIFFERENCE_ERROR_MESSAGE);
    });

    it("should throw a difference error if the files don't have 7 difference (original image and modified image swaped)", () => {
        expect(() => gameCreatorService.createSimpleGame( "", "", ""))
            .to.throw(DIFFERENCE_ERROR_MESSAGE);
    });

    it("should throw a name error if the name of the game already exists", () => {
        expect(() => gameCreatorService.createSimpleGame( "", "", ""))
            .to.throw(NAME_ERROR_MESSAGE);
    });

    it("should return the created game confirm message", () => {
        expect(gameCreatorService.createSimpleGame( "game 1", "", ""))
            .to.deep.equal({title: GAME_NAME_KEY, body: "game 1"});
    });

    it("should return the created game confirm message(original image and modified image swaped)", () => {
        // console.log(gameCreatorService.createSimpleGame( "", "", ""));
        expect(gameCreatorService.createSimpleGame( "game 1", "", ""))
            .to.deep.equal({title: GAME_NAME_KEY, body: "game 1"});
    });

    after(() => {
        // TODO delete all copied files from the beginning
    });
});
