import {expect} from "chai";
import {DataBaseService} from "./data-base.service";
import {EMPTY_ID_ERROR_MESSAGE} from "./db/collection.service";
import {ALREADY_EXISTING_USER_MESSAGE_ERROR, NON_EXISTING_USER_ERROR_MESSAGE} from "./db/users.collection.service";
import {IUser} from "../../../common/model/user";
import {
    ALREADY_EXISTING_GAME_MESSAGE_ERROR,
    GAME_FORMAT_ERROR_MESSAGE,
    NON_EXISTING_GAME_ERROR_MESSAGE
} from "./db/simple-games.collection.service";
import {ISimpleGame} from "../../../common/model/game/simple-game";
import {customIndexOf, deepCompare} from "../../../common/util/util";
import {IFreeGame} from "../../../common/model/game/free-game";

// Here we do not mock the real data-base, because we want to test the communication between the server and the database
describe("A service that communicates with the data-base", () => {

    const SUCCESS_MESSAGE: string = "success";

    const dataBaseService: DataBaseService = new DataBaseService();
    describe("User Names", () => {
        describe("Adding an user to the data-base", () => {

            it("should throw a format error if the username is empty", async () => {
                try {
                    // @ts-ignore
                    await dataBaseService.users.create({userName: ""});
                } catch (error) {
                    return expect(error.message).to.equal(EMPTY_ID_ERROR_MESSAGE);
                }

                return expect.fail();
            });

            it("should throw an already existing username error if the username is already in the database(added twice)", async () => {
                try {
                    await dataBaseService.users.create({userName: "alreadyExistingUserTest"});
                    await dataBaseService.users.create({userName: "alreadyExistingUserTest"});
                } catch (error) {
                    // cleanup
                    if (error.message === ALREADY_EXISTING_USER_MESSAGE_ERROR) {
                        await dataBaseService.users.delete("alreadyExistingUserTest");
                    }

                    return expect(error.message).to.equal(ALREADY_EXISTING_USER_MESSAGE_ERROR);
                }

                return expect.fail();
            });

            it("should have a success message when added an non-existing user", async () => {
                expect((await dataBaseService.users.create({userName: "someUserTest"})).body).to.contain(SUCCESS_MESSAGE);
                // cleanup
                await dataBaseService.users.delete("someUserTest");
            });

        });

        describe("Deleting a user from the data-base", () => {

            it("should throw a format error if the username is empty", async () => {
                try {
                    await dataBaseService.users.delete("");
                } catch (error) {
                    return expect(error.message).to.equal(EMPTY_ID_ERROR_MESSAGE);
                }

                return expect.fail();
            });

            it("should throw a not existing username error if the username does not exist in the database", async () => {
                try {
                    await dataBaseService.users.delete("notExistingUserTest");
                } catch (error) {
                    return expect(error.message).to.equal(NON_EXISTING_USER_ERROR_MESSAGE);
                }

                return expect.fail();
            });

            it("should have a success message when deleting an existing user", async () => {
                await dataBaseService.users.create({userName: "someUserTest"});
                expect((await dataBaseService.users.delete("someUserTest")).body).to.contain(SUCCESS_MESSAGE);
            });

        });

        describe("Getting an user from the data-base", () => {

            it("should throw a format error if the username is empty", async () => {
                try {
                    await dataBaseService.users.getFromId("");
                } catch (error) {
                    return expect(error.message).to.equal(EMPTY_ID_ERROR_MESSAGE);
                }

                return expect.fail();
            });

            it("should throw a not existing username error if the username does not exist in the database", async () => {
                try {
                    await dataBaseService.users.getFromId("notExistingUserTest");
                } catch (error) {
                    return expect(error.message).to.equal(NON_EXISTING_USER_ERROR_MESSAGE);
                }

                return expect.fail();
            });

            it("should return existing user", async () => {
                const THE_USER_I_CREATED: IUser = {userName: "someUserTest"};
                await dataBaseService.users.create(THE_USER_I_CREATED);
                // @ts-ignore the data-base modifies the attributes given ti it by a create, and generates an id_ attribute
                delete THE_USER_I_CREATED._id;
                expect((await dataBaseService.users.getFromId("someUserTest"))).to.eql(THE_USER_I_CREATED);
                await dataBaseService.users.delete("someUserTest");
            });
        });

        describe("Getting all users from the data-base", () => {

            it("should have a return all users", async () => {
                const USERS_ARRAY: IUser[] = [{userName: "someUserTest"}, {userName: "someUserTest2"}, {userName: "someUserTest3"}];
                await dataBaseService.users.create(USERS_ARRAY[0]);
                await dataBaseService.users.create(USERS_ARRAY[1]);
                await dataBaseService.users.create(USERS_ARRAY[2]);
                // @ts-ignore the data-base modifies the attributes given ti it by a create, and generates an id_ attribute
                USERS_ARRAY.forEach((item) => { delete item._id });
                expect((await dataBaseService.users.getAll())).to.eql(USERS_ARRAY);
                await dataBaseService.users.delete("someUserTest");
                await dataBaseService.users.delete("someUserTest2");
                await dataBaseService.users.delete("someUserTest3");
            });

        });

    });
    describe("Simple Games", () => {

        describe("Adding a game to the data-base", () => {

            it("should throw a format error if the game has the wrong format(null)", async () => {
                try {
                    // @ts-ignore we need to give a null argument for testing
                    await dataBaseService.simpleGames.create(null);
                } catch (error) {
                    return expect(error.message).to.equal(GAME_FORMAT_ERROR_MESSAGE);
                }

                return expect.fail();
            });

            it("should throw a format error if the game has a missing element", async () => {
                // we want to give a partial game to the database
                // @ts-ignore
                const partialGame: ISimpleGame = {
                    gameName: "someGameTest",
                    bestSoloTimes: [],
                    bestMultiTimes: [],
                    originalImage: "someImage",
                    modifiedImage: "someOtherImage",
                };
                try {
                    await dataBaseService.simpleGames.create(partialGame);
                } catch (error) {
                    return expect(error.message).to.equal(GAME_FORMAT_ERROR_MESSAGE);
                }

                return expect.fail();
            });

            it("should throw an already existing game error if the game is already in the database(added twice)", async () => {
                const alreadyExistingGame: ISimpleGame = {
                    gameName: "someGameTest",
                    originalImage: "someImage",
                    modifiedImage: "someOtherImage",
                    bestSoloTimes: [{name: "name", time: 123}, {name: "name", time: 123}, {name: "name", time: 123}],
                    bestMultiTimes: [{name: "name", time: 123}, {name: "name", time: 123}, {name: "name", time: 123}],
                    diffData: [],
                };
                await dataBaseService.simpleGames.create(alreadyExistingGame);
                try {
                    await dataBaseService.simpleGames.create(alreadyExistingGame);
                } catch (error) {
                    // cleanup
                    if (error.message === ALREADY_EXISTING_GAME_MESSAGE_ERROR) {
                        await dataBaseService.simpleGames.delete("someGameTest");
                    }

                    return expect(error.message).to.equal(ALREADY_EXISTING_GAME_MESSAGE_ERROR);
                }

                return expect.fail();
            });

            it("should have a success message when added a non-existing game", async () => {
                const someGame: ISimpleGame = {
                    gameName: "someGameTest",
                    originalImage: "someImage",
                    modifiedImage: "someOtherImage",
                    bestSoloTimes: [{name: "name", time: 123}, {name: "name", time: 123}, {name: "name", time: 123}],
                    bestMultiTimes: [{name: "name", time: 123}, {name: "name", time: 123}, {name: "name", time: 123}],
                    diffData: [],
                };
                expect((await dataBaseService.simpleGames.create(someGame)).body).to.contain(SUCCESS_MESSAGE);
                // cleanup
                await dataBaseService.simpleGames.delete("someGameTest");
            });

        });

        describe("Deleting a game from the data-base", () => {

            it("should throw a format error if the game name is an empty string", async () => {
                try {
                    await dataBaseService.simpleGames.delete("");
                } catch (error) {
                    return expect(error.message).to.equal(EMPTY_ID_ERROR_MESSAGE);
                }

                return expect.fail();
            });

            it("should throw a not existing game error if the game name does not exist in the database", async () => {
                try {
                    await dataBaseService.simpleGames.delete("notExistingGameTest");
                } catch (error) {
                    return expect(error.message).to.equal(NON_EXISTING_GAME_ERROR_MESSAGE);
                }

                return expect.fail();
            });

            it("should have a success message when deleting an existing game", async () => {
                const someGame: ISimpleGame = {
                    gameName: "someGameTest",
                    originalImage: "someImage",
                    modifiedImage: "someOtherImage",
                    bestSoloTimes: [{name: "name", time: 123}, {name: "name", time: 123}, {name: "name", time: 123}],
                    bestMultiTimes: [{name: "name", time: 123}, {name: "name", time: 123}, {name: "name", time: 123}],
                    diffData: [],
                };
                await dataBaseService.simpleGames.create(someGame);
                expect((await dataBaseService.simpleGames.delete("someGameTest")).body).to.contain(SUCCESS_MESSAGE);
            });

            it("should have a success message when getting an existing game", async () => {
                const someGame: ISimpleGame = {
                    gameName: "someGameTest",
                    originalImage: "someImage",
                    modifiedImage: "someOtherImage",
                    bestSoloTimes: [{name: "name", time: 123}, {name: "name", time: 123}, {name: "name", time: 123}],
                    bestMultiTimes: [{name: "name", time: 123}, {name: "name", time: 123}, {name: "name", time: 123}],
                    diffData: [],
                };
                await dataBaseService.simpleGames.create(someGame);
                // @ts-ignore the data-base modifies the attributes given ti it by a create, and generates an id_ attribute
                delete someGame._id;
                expect(await dataBaseService.simpleGames.getFromId("someGameTest")).to.eql(someGame);
                //cleanup
                await dataBaseService.simpleGames.delete("someGameTest");
            });

            it("should have a success message when getting all existing game", async () => {
                const someGame: ISimpleGame = {
                    gameName: "someGameTest",
                    originalImage: "someImage",
                    modifiedImage: "someOtherImage",
                    bestSoloTimes: [{name: "name", time: 123}, {name: "name", time: 123}, {name: "name", time: 123}],
                    bestMultiTimes: [{name: "name", time: 123}, {name: "name", time: 123}, {name: "name", time: 123}],
                    diffData: [],
                };
                await dataBaseService.simpleGames.create(someGame);
                // @ts-ignore the data-base modifies the attributes given ti it by a create, and generates an id_ attribute
                delete someGame._id;
                expect(customIndexOf(await dataBaseService.simpleGames.getAll(), someGame,
                    (a: ISimpleGame, b: ISimpleGame): boolean => {
                        return deepCompare(a, b);
                    })).to.be.greaterThan(-1);
                //cleanup
                await dataBaseService.simpleGames.delete("someGameTest");
            });
        });

        describe("Getting a game from the data-base", () => {

            it("should throw a format error if the username is empty", async () => {
                try {
                    await dataBaseService.simpleGames.getFromId("");
                } catch (error) {
                    return expect(error.message).to.equal(EMPTY_ID_ERROR_MESSAGE);
                }

                return expect.fail();
            });

            it("should throw a not existing game error if the game does not exist in the database", async () => {
                try {
                    await dataBaseService.simpleGames.getFromId("notExistingGameTest");
                } catch (error) {
                    return expect(error.message).to.equal(NON_EXISTING_GAME_ERROR_MESSAGE);
                }

                return expect.fail();
            });

            it("should have a success message when getting an existing game", async () => {
                const someGame: ISimpleGame = {
                    gameName: "someGameTest",
                    originalImage: "someImage",
                    modifiedImage: "someOtherImage",
                    bestSoloTimes: [{name: "name", time: 123}, {name: "name", time: 123}, {name: "name", time: 123}],
                    bestMultiTimes: [{name: "name", time: 123}, {name: "name", time: 123}, {name: "name", time: 123}],
                    diffData: [],
                };
                await dataBaseService.simpleGames.create(someGame);
                // @ts-ignore the data-base modifies the attributes given ti it by a create, and generates an id_ attribute
                delete someGame._id;
                expect(await dataBaseService.simpleGames.getFromId("someGameTest")).to.eql(someGame);
                //cleanup
                await dataBaseService.simpleGames.delete("someGameTest");
            });
        });

        describe("Getting all games from the data-base", () => {

            it("should have a success message when getting all existing game", async () => {
                const someGame: ISimpleGame = {
                    gameName: "someGameTest",
                    originalImage: "someImage",
                    modifiedImage: "someOtherImage",
                    bestSoloTimes: [{name: "name", time: 123}, {name: "name", time: 123}, {name: "name", time: 123}],
                    bestMultiTimes: [{name: "name", time: 123}, {name: "name", time: 123}, {name: "name", time: 123}],
                    diffData: [],
                };
                await dataBaseService.simpleGames.create(someGame);
                // @ts-ignore the data-base modifies the attributes given ti it by a create, and generates an id_ attribute
                delete someGame._id;
                expect(customIndexOf(await dataBaseService.simpleGames.getAll(), someGame,
                    (a: ISimpleGame, b: ISimpleGame): boolean => {
                        return deepCompare(a, b);
                    })).to.be.greaterThan(-1);
                //cleanup
                await dataBaseService.simpleGames.delete("someGameTest");
            });

        });

    });
    describe("Free Games", () => {

        describe("Adding a game to the data-base", () => {

            it("should throw a format error if the game has the wrong format(null)", async () => {
                try {
                    // @ts-ignore we need to give a null argument for testing
                    await dataBaseService.freeGames.create(null);
                } catch (error) {
                    return expect(error.message).to.equal(GAME_FORMAT_ERROR_MESSAGE);
                }

                return expect.fail();
            });

            it("should throw a format error if the game has a missing element", async () => {
                // we want to give a partial game to the database
                // @ts-ignore
                const partialGame: IFreeGame = {
                    gameName: "someGameTest",
                    bestSoloTimes: [],
                    bestMultiTimes: [],
                };
                try {
                    await dataBaseService.freeGames.create(partialGame);
                } catch (error) {
                    return expect(error.message).to.equal(GAME_FORMAT_ERROR_MESSAGE);
                }

                return expect.fail();
            });

            it("should throw an already existing game error if the game is already in the database(added twice)", async () => {
                const alreadyExistingGame: IFreeGame = {
                    gameName: "someGameTest",
                    bestSoloTimes: [{name: "name", time: 123}, {name: "name", time: 123}, {name: "name", time: 123}],
                    bestMultiTimes: [{name: "name", time: 123}, {name: "name", time: 123}, {name: "name", time: 123}],
                    scenes: {originalObjects: [], modifiedObjects: []},
                };
                await dataBaseService.freeGames.create(alreadyExistingGame);
                try {
                    await dataBaseService.freeGames.create(alreadyExistingGame);
                } catch (error) {
                    // cleanup
                    if (error.message === ALREADY_EXISTING_GAME_MESSAGE_ERROR) {
                        await dataBaseService.freeGames.delete("someGameTest");
                    }

                    return expect(error.message).to.equal(ALREADY_EXISTING_GAME_MESSAGE_ERROR);
                }

                return expect.fail();
            });

            it("should have a success message when added a non-existing game", async () => {
                const someGame: IFreeGame = {
                    gameName: "someGameTest",
                    bestSoloTimes: [{name: "name", time: 123}, {name: "name", time: 123}, {name: "name", time: 123}],
                    bestMultiTimes: [{name: "name", time: 123}, {name: "name", time: 123}, {name: "name", time: 123}],
                    scenes: {originalObjects: [], modifiedObjects: []},
                };
                expect((await dataBaseService.freeGames.create(someGame)).body).to.contain(SUCCESS_MESSAGE);
                // cleanup
                await dataBaseService.freeGames.delete("someGameTest");
            });

        });

        describe("Deleting a game from the data-base", () => {

            it("should throw a format error if the game name is an empty string", async () => {
                try {
                    await dataBaseService.freeGames.delete("");
                } catch (error) {
                    return expect(error.message).to.equal(EMPTY_ID_ERROR_MESSAGE);
                }

                return expect.fail();
            });

            it("should throw a not existing game error if the game name does not exist in the database", async () => {
                try {
                    await dataBaseService.freeGames.delete("notExistingGameTest");
                } catch (error) {
                    return expect(error.message).to.equal(NON_EXISTING_GAME_ERROR_MESSAGE);
                }

                return expect.fail();
            });

            it("should have a success message when deleting an existing game", async () => {
                const someGame: IFreeGame = {
                    gameName: "someGameTest",
                    bestSoloTimes: [{name: "name", time: 123}, {name: "name", time: 123}, {name: "name", time: 123}],
                    bestMultiTimes: [{name: "name", time: 123}, {name: "name", time: 123}, {name: "name", time: 123}],
                    scenes: {originalObjects: [], modifiedObjects: []},
                };
                await dataBaseService.freeGames.create(someGame);
                expect((await dataBaseService.freeGames.delete("someGameTest")).body).to.contain(SUCCESS_MESSAGE);
            });

            it("should have a success message when getting an existing game", async () => {
                const someGame: IFreeGame = {
                    gameName: "someGameTest",
                    bestSoloTimes: [{name: "name", time: 123}, {name: "name", time: 123}, {name: "name", time: 123}],
                    bestMultiTimes: [{name: "name", time: 123}, {name: "name", time: 123}, {name: "name", time: 123}],
                    scenes: {originalObjects: [], modifiedObjects: []},
                };
                await dataBaseService.freeGames.create(someGame);
                // @ts-ignore the data-base modifies the attributes given ti it by a create, and generates an id_ attribute
                delete someGame._id;
                expect(await dataBaseService.freeGames.getFromId("someGameTest")).to.eql(someGame);
                //cleanup
                await dataBaseService.freeGames.delete("someGameTest");
            });

            it("should have a success message when getting all existing game", async () => {
                const someGame: ISimpleGame = {
                    gameName: "someGameTest",
                    originalImage: "someImage",
                    modifiedImage: "someOtherImage",
                    bestSoloTimes: [{name: "name", time: 123}, {name: "name", time: 123}, {name: "name", time: 123}],
                    bestMultiTimes: [{name: "name", time: 123}, {name: "name", time: 123}, {name: "name", time: 123}],
                    diffData: [],
                };
                await dataBaseService.simpleGames.create(someGame);
                // @ts-ignore the data-base modifies the attributes given ti it by a create, and generates an id_ attribute
                delete someGame._id;
                expect(customIndexOf(await dataBaseService.simpleGames.getAll(), someGame,
                    (a: ISimpleGame, b: ISimpleGame): boolean => {
                        return deepCompare(a, b);
                    })).to.be.greaterThan(-1);
                //cleanup
                await dataBaseService.simpleGames.delete("someGameTest");
            });
        });

        describe("Getting a game from the data-base", () => {

            it("should throw a format error if the username is empty", async () => {
                try {
                    await dataBaseService.freeGames.getFromId("");
                } catch (error) {
                    return expect(error.message).to.equal(EMPTY_ID_ERROR_MESSAGE);
                }

                return expect.fail();
            });

            it("should throw a not existing game error if the game does not exist in the database", async () => {
                try {
                    await dataBaseService.freeGames.getFromId("notExistingGameTest");
                } catch (error) {
                    return expect(error.message).to.equal(NON_EXISTING_GAME_ERROR_MESSAGE);
                }

                return expect.fail();
            });

            it("should have a success message when getting an existing game", async () => {
                const someGame: IFreeGame = {
                    gameName: "someGameTest",
                    bestSoloTimes: [{name: "name", time: 123}, {name: "name", time: 123}, {name: "name", time: 123}],
                    bestMultiTimes: [{name: "name", time: 123}, {name: "name", time: 123}, {name: "name", time: 123}],
                    scenes: {originalObjects: [], modifiedObjects: []},
                };
                await dataBaseService.freeGames.create(someGame);
                // @ts-ignore the data-base modifies the attributes given ti it by a create, and generates an id_ attribute
                delete someGame._id;
                expect(await dataBaseService.freeGames.getFromId("someGameTest")).to.eql(someGame);
                //cleanup
                await dataBaseService.freeGames.delete("someGameTest");
            });
        });

        describe("Getting all games from the data-base", () => {

            it("should have a success message when getting all existing game", async () => {
                const someGame: IFreeGame = {
                    gameName: "someGameTest",
                    bestSoloTimes: [{name: "name", time: 123}, {name: "name", time: 123}, {name: "name", time: 123}],
                    bestMultiTimes: [{name: "name", time: 123}, {name: "name", time: 123}, {name: "name", time: 123}],
                    scenes: {originalObjects: [], modifiedObjects: []},
                };
                await dataBaseService.freeGames.create(someGame);
                // @ts-ignore the data-base modifies the attributes given ti it by a create, and generates an id_ attribute
                delete someGame._id;
                expect(customIndexOf(await dataBaseService.freeGames.getAll(), someGame,
                    (a: IFreeGame, b: IFreeGame): boolean => {
                        return deepCompare(a, b);
                    })).to.be.greaterThan(-1);
                //cleanup
                await dataBaseService.freeGames.delete("someGameTest");
            });

        });

    });


});
