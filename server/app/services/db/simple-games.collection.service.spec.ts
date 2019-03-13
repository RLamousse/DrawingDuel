import {fail} from "assert";
import {Collection} from "mongodb";
import {ISimpleGame} from "../../../../common/model/game/simple-game";
import {SimpleGamesCollectionService} from "./simple-games.collection.service";

describe("A db service for simple games", () => {

    let simpleGamesCollectionService: SimpleGamesCollectionService;

    beforeEach(() => {
        let mockCollection: Collection<ISimpleGame>;

        simpleGamesCollectionService = new SimpleGamesCollectionService();
    });

    it("should not create an invalid game", () => {
        fail();
    });

    it("should not create a game that already exists", () => {
        fail();
    });

    it("should create a game", () => {
        fail();
    });

    it("should throw if a game ID is empty on deletion", () => {
        fail();
    });

    it("should throw if the specified game does not exist", () => {
        fail();
    });

    it("should delete a game", () => {
        fail();
    });

    it("should throw if a game ID is empty on get", () => {
        fail();
    });

    it("should get a game from an ID", () => {
        fail();
    });
});
