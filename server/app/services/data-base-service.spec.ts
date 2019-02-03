import {expect} from "chai";
import {USERNAME_FORMAT_ERROR_MESSAGE} from "../controllers/data-base.controller";
import {
    ALREADY_EXISTING_USER_MESSAGE_ERROR,
    DataBaseService
} from "./data-base.service";

describe("A service that communicates with the data-base", () => {

    // beforeEach(() => {
    // });

    describe("Creating the database", () => {

        it("should initiate mongo client without errors", () => {
            expect(() => {new DataBaseService();}).to.not.throw();
        });

    });

    const DATA_BASE_SERVICE: DataBaseService = new DataBaseService();

    describe("Adding an user to the data-base", () => {

        it("should throw a format error if the username is not a string(undefined)", async () => {
            try {
                // @ts-ignore
                await DATA_BASE_SERVICE.addUser(null);
            } catch (error) {
                return expect(error.message).to.equal(USERNAME_FORMAT_ERROR_MESSAGE);
            }

            return expect.fail();
        });

        it("should throw a format error if the username is an empty string", async () => {
            try {
                await DATA_BASE_SERVICE.addUser("");
            } catch (error) {
                return expect(error.message).to.equal(USERNAME_FORMAT_ERROR_MESSAGE);
            }

            return expect.fail();
        });

        it("should throw an already existing username error if the username is already in the database(added twice)", async () => {
            try {
                await DATA_BASE_SERVICE.addUser("alreadyExistingTestUser");
                await DATA_BASE_SERVICE.addUser("alreadyExistingTestUser");
            } catch (error) {
                if (error.message === ALREADY_EXISTING_USER_MESSAGE_ERROR) {
                    await DATA_BASE_SERVICE.deleteUser("alreadyExistingTestUser");
                }

                return expect(error.message).to.equal(ALREADY_EXISTING_USER_MESSAGE_ERROR);
            }

            return expect.fail();
        });

    });

});
