import { expect } from "chai";
import { GameCreatorService } from "./game-creator.service";

const gameCreatorService: GameCreatorService = new GameCreatorService();

describe("A sample service", () => {

    before(() => {
        // TODO copy bmp files from test/test_files_for_game_creator_service to tmp/
    });

    it("should throw a format error if the strings are not the name of existing files", (done: Function) => {
        expect(() => gameCreatorService.createSimpleGame("", "", "")).to.throw();
        done();
    });

    after(() => {
        // TODO delete all copied files from the beginning
    });
});
