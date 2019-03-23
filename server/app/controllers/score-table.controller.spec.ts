// responses are generique so we don't want to define the tests in this file
// tslint:disable:typedef
import {expect} from "chai";
import * as HttpStatus from "http-status-codes";
import * as request from "supertest";
import {anything, anyString, instance, mock, when} from "ts-mockito";
import {MODIFY_SCORES} from "../../../common/communication/routes";
import {RequestFormatError} from "../../../common/errors/controller.errors";
import {Application} from "../app";
import {container} from "../inversify.config";
import {ScoreTableService} from "../services/score-table.service";
import types from "../types";

const errorResponse = (errorMessage: string) => {
    return {
        message: errorMessage,
        error: {},
    };
};

describe("Score Table controller", () => {
    let app: Express.Application;
    let scoreTableService: ScoreTableService;

    beforeEach(() => {
        scoreTableService = mock(ScoreTableService);
        when(scoreTableService.updateTableScore(anyString(), anything(), anything())).thenResolve(0);
        container.rebind(types.ScoreTableService).toConstantValue(instance(scoreTableService));
        app = container.get<Application>(types.Application).app;
    });

    describe("Modify scores", () => {
        it("should send an error when newTime is missing", async () => {
            return request(app)
                .put(MODIFY_SCORES)
                .send({gameName: "testName", isSolo: true})
                .expect(HttpStatus.INTERNAL_SERVER_ERROR)
                .then((response) => {
                    expect(response.body).to.eql(errorResponse(RequestFormatError.FORMAT_ERROR_MESSAGE));
                });
        });

        it("should send an error when the new time name is missing", async () => {
            return request(app)
                .put(MODIFY_SCORES)
                .send({gameName: "testName", newTime: {time: 123}, isSolo: true})
                .expect(HttpStatus.INTERNAL_SERVER_ERROR)
                .then((response) => {
                    expect(response.body).to.eql(errorResponse(RequestFormatError.FORMAT_ERROR_MESSAGE));
                });
        });

        it("should send an error when the new time time is missing", async () => {
            return request(app)
                .put(MODIFY_SCORES)
                .send({gameName: "testName", newTime: {name: "testBoy"}, isSolo: true})
                .expect(HttpStatus.INTERNAL_SERVER_ERROR)
                .then((response) => {
                    expect(response.body).to.eql(errorResponse(RequestFormatError.FORMAT_ERROR_MESSAGE));
                });
        });

        it("should send an error when isSolo is missing", async () => {
            return request(app)
                .put(MODIFY_SCORES)
                .send({gameName: "testName", newTime: {name: "testBoy", time: 123}})
                .expect(HttpStatus.INTERNAL_SERVER_ERROR)
                .then((response) => {
                    expect(response.body).to.eql(errorResponse(RequestFormatError.FORMAT_ERROR_MESSAGE));
                });
        });

        it("should send an error when no name specified", async () => {
            return request(app)
                .put(MODIFY_SCORES)
                .send({newTime: {name: "testBoy", time: 123}, isSolo: true})
                .expect(HttpStatus.INTERNAL_SERVER_ERROR)
                .then((response) => {
                    expect(response.body).to.eql(errorResponse(RequestFormatError.FORMAT_ERROR_MESSAGE));
                });
        });

        it("should send an success response for valid data", async () => {
            return request(app)
                .put(MODIFY_SCORES)
                .send({gameName: "testName", newTime: {name: "testBoy", time: 123}, isSolo: true})
                .expect(HttpStatus.OK)
                .then((response) => {
                    expect(response.body).to.eql(0);
                });
        });
    });
});
