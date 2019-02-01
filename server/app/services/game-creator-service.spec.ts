// import { expect } from "chai";
// import * as fs from "fs";
// import {DIFFERENCE_ERROR_MESSAGE, FORMAT_ERROR_MESSAGE, GAME_NAME_FIELD, NAME_ERROR_MESSAGE} from "../controllers/game-creator.controller";
// import { GameCreatorService } from "./game-creator.service";
//
// const GAME_CREATOR_SERVICE: GameCreatorService = new GameCreatorService();
// const FILES_TO_COPY: String[] = ["original.bmp", "6diff-modified.bmp", "7diff-modified.bmp", "8diff-modified.bmp"];
//
// describe("Game creator service", () => {
//
//     before(() => {
//         for (const FILE of FILES_TO_COPY) {
//             fs.createReadStream("./test/test_files_for_game_creator_service/" + FILE)
//                 .pipe(fs.createWriteStream("./tmp/" + FILE));
//         }
//         // TODO create a game called existingGameTest
//     });
//
//     beforeEach(() => {
//         // TODO remove nonExistingGameTest if there is any
//     });
//
//     it("should throw a format error if the strings of the files are not the name of existing files", () => {
//         expect(() => GAME_CREATOR_SERVICE.createSimpleGame( "nonExistingGameTest", "nonExistingFile.bmp", "7diff-modified.bmp"))
//             .to.throw(FORMAT_ERROR_MESSAGE);
//     });
//
//     it("should throw a difference error if the files have less than 7 difference", () => {
//         expect(() => GAME_CREATOR_SERVICE.createSimpleGame( "nonExistingGameTest", "original.bmp", "6diff-modified.bmp"))
//             .to.throw(DIFFERENCE_ERROR_MESSAGE);
//     });
//
//     it("should throw a difference error if the files have less than 7 difference(swaped original and modified files)", () => {
//         expect(() => GAME_CREATOR_SERVICE.createSimpleGame( "nonExistingGameTest", "6diff-modified.bmp", "original.bmp"))
//             .to.throw(DIFFERENCE_ERROR_MESSAGE);
//     });
//
//     it("should throw a difference error if the files have more than 7 difference", () => {
//         expect(() => GAME_CREATOR_SERVICE.createSimpleGame( "nonExistingGameTest", "original.bmp", "8diff-modified.bmp"))
//             .to.throw(DIFFERENCE_ERROR_MESSAGE);
//     });
//
//     it("should throw a difference error if the files have more than 7 difference(swaped original and modified files)", () => {
//         expect(() => GAME_CREATOR_SERVICE.createSimpleGame( "nonExistingGameTest", "8diff-modified.bmp", "original.bmp"))
//             .to.throw(DIFFERENCE_ERROR_MESSAGE);
//     });
//
//     it("should throw a name error if the name of the game already exists", () => {
//         expect(() => GAME_CREATOR_SERVICE.createSimpleGame( "existingGameTest", "original.bmp", "7diff-modified.bmp"))
//             .to.throw(NAME_ERROR_MESSAGE);
//     });
//
//     it("should throw a name error if the name of the game already exists(swaped original and modified files)", () => {
//         expect(() => GAME_CREATOR_SERVICE.createSimpleGame( "existingGameTest", "7diff-modified.bmp", "original.bmp"))
//             .to.throw(NAME_ERROR_MESSAGE);
//     });
//
//     it("should return the created game confirm message", () => {
//         expect(GAME_CREATOR_SERVICE.createSimpleGame( "nonExistingGameTest", "original.bmp", "7diff-modified.bmp"))
//             .to.deep.equal({title: GAME_NAME_FIELD, body: "nonExistingGameTest"});
//     });
//
//     it("should return the created game confirm message(swaped original and modified files)", () => {
//         // console.log(gameCreatorService.createSimpleGame( "", "", ""));
//         expect(GAME_CREATOR_SERVICE.createSimpleGame( "nonExistingGameTest", "7diff-modified.bmp", "original.bmp"))
//             .to.deep.equal({title: GAME_NAME_FIELD, body: "nonExistingGameTest"});
//     });
//
//     after(() => {
//         for (const FILE of FILES_TO_COPY) {
//             fs.unlink("./tmp/" + FILE, (error: Error) => {
//                 if (error) { throw error; }
//             });
//         }
//         // TODO remove the game called existingGameTest
//     });
// });
