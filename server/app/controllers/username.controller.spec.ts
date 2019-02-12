// tslint:disable:typedef
import { expect } from "chai";
import * as Httpstatus from "http-status-codes";
import * as request from "supertest";
import { Application } from "../app";
import { container } from "../inversify.config";
import types from "../types";

const mockedUsernameService = {
    checkAvailability: () => ({ username: "validUsernameAdd", available: true }),
    releaseUsername: () => ({ username: "validUsernameRelease", available: true }),
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
            .post("/api/usernames/add")
            .expect(Httpstatus.INTERNAL_SERVER_ERROR)
            .then((response) => {
                expect(response.body).to.deep.equal(
                    errorResponse("Error: no username to add was included in the request"));
            });
    });

    it("should send an okResponse with available=true with right username when a username is add", async () => {
        return request(app)
            .post("/api/usernames/add")
            .send("mockedString")
            .expect(Httpstatus.OK)
            .then((response) => {
                expect(response.body).to.deep.equal(
                    okResponse("validUsernameAdd", true));
            });
    });

    // Test postRequest to release username
    it("should send an error when no username is passed to release", async () => {
        return request(app)
            .post("/api/usernames/release")
            .expect(Httpstatus.INTERNAL_SERVER_ERROR)
            .then((response) => {
                expect(response.body).to.deep.equal(
                    errorResponse("Error: no username to release included in the request"));
            });
    });

    it("should send an okResponse with available=true with right username when a username is released", async () => {
        return request(app)
            .post("/api/usernames/release")
            .send("mockedString")
            .expect(Httpstatus.OK)
            .then((response) => {
                expect(response.body).to.deep.equal(
                    okResponse("validUsernameRelease", true));
            });
    });
});
