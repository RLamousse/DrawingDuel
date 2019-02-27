// tslint:disable:typedef
import {expect} from "chai";
import * as Httpstatus from "http-status-codes";
import * as request from "supertest";
import {USERNAME_ADD, USERNAME_RELEASE} from "../../../common/communication/routes";
import {NoUsernameInRequestError} from "../../../common/errors/controller.errors";
import {Application} from "../app";
import {container} from "../inversify.config";
import types from "../types";

const mockedUsernameService = {
    checkAvailability: () => ({username: "validUsernameAdd", available: true}),
    releaseUsername: () => ({username: "validUsernameRelease", available: true}),
};

const errorResponse = (errorMessage: string) => {
    return {
        status: "error",
        error: errorMessage,
    };
};

const okResponse = (username: string, available: boolean) => {
    return {
        username: username,
        available: available,
    };
};

describe("username controller", () => {
    let app: Express.Application;

    beforeEach(() => {
        container.rebind(types.UserNameService).toConstantValue(mockedUsernameService);
        app = container.get<Application>(types.Application).app;
    });

    // Test postRequest to add username
    it("should send an error when no username is passed to add", async () => {
        return request(app)
            .post(USERNAME_ADD)
            .expect(Httpstatus.INTERNAL_SERVER_ERROR)
            .then((response) => {
                expect(response.body).to.eql(
                    errorResponse(NoUsernameInRequestError.NO_USERNAME_IN_REQUEST_ERROR_MESSAGE));
            });
    });

    it("should send an okResponse with available=true with right username when a username is add", async () => {
        return request(app)
            .post(USERNAME_ADD)
            .send("mockedString")
            .expect(Httpstatus.OK)
            .then((response) => {
                expect(response.body).to.eql(
                    okResponse("validUsernameAdd", true));
            });
    });

    // Test postRequest to release username
    it("should send an error when no username is passed to release", async () => {
        return request(app)
            .post(USERNAME_RELEASE)
            .expect(Httpstatus.INTERNAL_SERVER_ERROR)
            .then((response) => {
                expect(response.body).to.eql(
                    errorResponse(NoUsernameInRequestError.NO_USERNAME_IN_REQUEST_ERROR_MESSAGE));
            });
    });

    it("should send an okResponse with available=true with right username when a username is released", async () => {
        return request(app)
            .post(USERNAME_RELEASE)
            .send("mockedString")
            .expect(Httpstatus.OK)
            .then((response) => {
                expect(response.body).to.eql(
                    okResponse("validUsernameRelease", true));
            });
    });
});
