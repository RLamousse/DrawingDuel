describe("A service that communicates with the data-base", () => {

    /*
    See you un sprint 2
     */

    // beforeEach(() => {
    // });

    // describe("Creating the database", () => {
    //
    //     it("should initiate mongo client without errors", () => {
    //         expect(() => {new DataBaseService();}).to.not.throw();
    //     });
    //
    // });
    //
    // const DATA_BASE_SERVICE: DataBaseService = new DataBaseService();
    //
    // describe("Adding an user to the data-base", () => {
    //
    //     it("should throw a format error if the username is not a string(undefined)", async () => {
    //         try {
    //             // @ts-ignore
    //             await DATA_BASE_SERVICE.addUser(null);
    //         } catch (error) {
    //             return expect(error.message).to.equal(USERNAME_FORMAT_ERROR_MESSAGE);
    //         }
    //
    //         return expect.fail();
    //     });
    //
    //     it("should throw a format error if the username is an empty string", async () => {
    //         try {
    //             await DATA_BASE_SERVICE.addUser("");
    //         } catch (error) {
    //             return expect(error.message).to.equal(USERNAME_FORMAT_ERROR_MESSAGE);
    //         }
    //
    //         return expect.fail();
    //     });
    //
    //     it("should throw an already existing username error if the username is already in the database(added twice)", async () => {
    //         try {
    //             await DATA_BASE_SERVICE.addUser("alreadyExistingTestUser");
    //             await DATA_BASE_SERVICE.addUser("alreadyExistingTestUser");
    //         } catch (error) {
    //             // cleanup
    //             if (error.message === ALREADY_EXISTING_USER_MESSAGE_ERROR) {
    //                 await DATA_BASE_SERVICE.deleteUser("alreadyExistingTestUser");
    //             }
    //
    //             return expect(error.message).to.equal(ALREADY_EXISTING_USER_MESSAGE_ERROR);
    //         }
    //
    //         return expect.fail();
    //     });
    //
    //     it("should have a success message when added an non-existing user", async () => {
    //         expect((await DATA_BASE_SERVICE.addUser("notExistingTestUser")).title).to.equal("User added");
    //         // cleanup
    //         await DATA_BASE_SERVICE.deleteUser("notExistingTestUser");
    //     });
    //
    // });
    //
    // describe("Deleting a user from the data-base", () => {
    //
    //     it("should throw a format error if the username is not a string(undefined)", async () => {
    //         try {
    //             // @ts-ignore
    //             await DATA_BASE_SERVICE.deleteUser(null);
    //         } catch (error) {
    //             return expect(error.message).to.equal(USERNAME_FORMAT_ERROR_MESSAGE);
    //         }
    //
    //         return expect.fail();
    //     });
    //
    //     it("should throw a format error if the username is an empty string", async () => {
    //         try {
    //             await DATA_BASE_SERVICE.deleteUser("");
    //         } catch (error) {
    //             return expect(error.message).to.equal(USERNAME_FORMAT_ERROR_MESSAGE);
    //         }
    //
    //         return expect.fail();
    //     });
    //
    //     it("should throw a not existing username error if the username does not exist in the database", async () => {
    //         try {
    //             await DATA_BASE_SERVICE.deleteUser("notExistingTestUser2");
    //         } catch (error) {
    //             return expect(error.message).to.equal(NOT_EXISTING_USER_MESSAGE_ERROR);
    //         }
    //
    //         return expect.fail();
    //     });
    //
    //     it("should have a success message when deleting an existing user", async () => {
    //         await DATA_BASE_SERVICE.addUser("alreadyExistingTestUser2");
    //         expect((await DATA_BASE_SERVICE.deleteUser("alreadyExistingTestUser2")).title).to.equal("User deleted");
    //     });
    //
    // });
    //
    // describe("Adding a game to the data-base", () => {
    //
    //     it("should throw a format error if the game has the wrong format(undefined)", async () => {
    //         try {
    //             // @ts-ignore
    //             await DATA_BASE_SERVICE.addGame(null);
    //         } catch (error) {
    //             return expect(error.message).to.equal(GAME_FORMAT_ERROR_MESSAGE);
    //         }
    //
    //         return expect.fail();
    //     });
    //
    //     it("should throw a format error if the game has a missing element", async () => {
    //         const partialGame: object = {
    //             isSimpleGame: true,
    //             gameName: "name",
    //             modifiedImage: "image",
    //             bestSoloTimes: [{name: "name", time: 123}, {name: "name", time: 123}, {name: "name", time: 123}],
    //             bestMultiTimes: [{name: "name", time: 123}, {name: "name", time: 123}, {name: "name", time: 123}],
    //         };
    //         try {
    //             // @ts-ignore
    //             await DATA_BASE_SERVICE.addGame(partialGame);
    //         } catch (error) {
    //             return expect(error.message).to.equal(GAME_FORMAT_ERROR_MESSAGE);
    //         }
    //
    //         return expect.fail();
    //     });
    //
    //     it("should throw an already existing game error if the game is already in the database(added twice)", async () => {
    //         const alreadyExistingGame: Game = {
    //             isSimpleGame: true,
    //             gameName: "alreadyExistingGame",
    //             modifiedImage: "image",
    //             originalImage: "image",
    //             bestSoloTimes: [{name: "name", time: 123}, {name: "name", time: 123}, {name: "name", time: 123}],
    //             bestMultiTimes: [{name: "name", time: 123}, {name: "name", time: 123}, {name: "name", time: 123}],
    //         };
    //         try {
    //             await DATA_BASE_SERVICE.addGame(alreadyExistingGame);
    //             await DATA_BASE_SERVICE.addGame(alreadyExistingGame);
    //         } catch (error) {
    //             // cleanup
    //             if (error.message === ALREADY_EXISTING_GAME_MESSAGE_ERROR) {
    //                 await DATA_BASE_SERVICE.deleteGame("alreadyExistingGame");
    //             }
    //
    //             return expect(error.message).to.equal(ALREADY_EXISTING_GAME_MESSAGE_ERROR);
    //         }
    //
    //         return expect.fail();
    //     });
    //
    //     it("should have a success message when added an non-existing game", async () => {
    //         const notExistingGame: Game = {
    //             isSimpleGame: true,
    //             gameName: "notExistingGame",
    //             modifiedImage: "image",
    //             originalImage: "image",
    //             bestSoloTimes: [{name: "name", time: 123}, {name: "name", time: 123}, {name: "name", time: 123}],
    //             bestMultiTimes: [{name: "name", time: 123}, {name: "name", time: 123}, {name: "name", time: 123}],
    //         };
    //         expect((await DATA_BASE_SERVICE.addGame(notExistingGame)).title).to.equal("game added");
    //         // cleanup
    //         await DATA_BASE_SERVICE.deleteGame("notExistingGame");
    //     });
    //
    // });
    //
    // describe("Deleting a game from the data-base", () => {
    //
    //     it("should throw a format error if the game name is not a string(undefined)", async () => {
    //         try {
    //             // @ts-ignore
    //             await DATA_BASE_SERVICE.deleteGame(null);
    //         } catch (error) {
    //             return expect(error.message).to.equal(GAME_FORMAT_ERROR_MESSAGE);
    //         }
    //
    //         return expect.fail();
    //     });
    //
    //     it("should throw a format error if the game name is an empty string", async () => {
    //         try {
    //             await DATA_BASE_SERVICE.deleteGame("");
    //         } catch (error) {
    //             return expect(error.message).to.equal(GAME_FORMAT_ERROR_MESSAGE);
    //         }
    //
    //         return expect.fail();
    //     });
    //
    //     it("should throw a not existing game error if the game name does not exist in the database", async () => {
    //         try {
    //             await DATA_BASE_SERVICE.deleteGame("notExistingTestGame");
    //         } catch (error) {
    //             return expect(error.message).to.equal(NOT_EXISTING_GAME_MESSAGE_ERROR);
    //         }
    //
    //         return expect.fail();
    //     });
    //
    //     it("should have a success message when deleting an existing game", async () => {
    //         const existingGame: Game = {
    //             isSimpleGame: true,
    //             gameName: "existingGame",
    //             modifiedImage: "image",
    //             originalImage: "image",
    //             bestSoloTimes: [{name: "name", time: 123}, {name: "name", time: 123}, {name: "name", time: 123}],
    //             bestMultiTimes: [{name: "name", time: 123}, {name: "name", time: 123}, {name: "name", time: 123}],
    //         };
    //         // console.dir(existingGame);
    //         await DATA_BASE_SERVICE.addGame(existingGame);
    //         expect((await DATA_BASE_SERVICE.deleteGame("existingGame")).title).to.equal("Game deleted");
    //     });
    //
    // });
    //
    // describe("Testing a game that is going to be added to the data-base", () => {
    //
    //     it("should throw a format error if the game has the wrong format(undefined)", async () => {
    //         try {
    //             // @ts-ignore
    //             await DATA_BASE_SERVICE.testGameStructure(null);
    //         } catch (error) {
    //             return expect(error.message).to.equal(GAME_FORMAT_ERROR_MESSAGE);
    //         }
    //
    //         return expect.fail();
    //     });
    //
    //     it("should throw a format error if the game has a missing element", async () => {
    //         const partialGame: object = {
    //             isSimpleGame: true,
    //             gameName: "name",
    //             modifiedImage: "image",
    //             bestSoloTimes: [{name: "name", time: 123}, {name: "name", time: 123}, {name: "name", time: 123}],
    //             bestMultiTimes: [{name: "name", time: 123}, {name: "name", time: 123}, {name: "name", time: 123}],
    //         };
    //         try {
    //             // @ts-ignore
    //             await DATA_BASE_SERVICE.testGameStructure(partialGame);
    //         } catch (error) {
    //             return expect(error.message).to.equal(GAME_FORMAT_ERROR_MESSAGE);
    //         }
    //
    //         return expect.fail();
    //     });
    //
    // });

});
