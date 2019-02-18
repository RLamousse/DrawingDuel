// tslint:disable:typedef
import { expect } from "chai";
import * as HttpStatus from "http-status-codes";
import * as request from "supertest";
import {anything, anyString, instance, mock, when} from "ts-mockito";
import {IDiffValidatorControllerRequest} from "../../../common/communication/requests/diff-validator-controller.request";
import {IDiffValidatorControllerResponse} from "../../../common/communication/response/diff-validator-controller.response";
import {ORIGIN} from "../../../common/model/point";
import { Application } from "../app";
import { container } from "../inversify.config";
import {DiffValidatorService} from "../services/diff-validator.service";
import types from "../types";
import {FORMAT_ERROR_MESSAGE} from "./controller-utils";

const errorResponse = (errorMessage: string) => {
    return {
        message: errorMessage,
        error: {},
    };
};

describe("Diff validator controller", () => {
    let app: Express.Application;
    beforeEach(() => {
        const mockedDiffValidatorService = mock(DiffValidatorService);
        when(mockedDiffValidatorService.hasDifference(anyString(), anything()))
            .thenResolve(true);

        container.rebind(types.DiffValidatorService).toConstantValue(instance(mockedDiffValidatorService));

        app = container.get<Application>(types.Application).app;
    });

    it("should send an error if the game name is missing", async () => {
        return request(app)
            .get("/api/diff-validator")
            .send({coord: ORIGIN})
            .expect(HttpStatus.INTERNAL_SERVER_ERROR)
            .then((response) => {
                expect(response.body).to.eql(errorResponse(FORMAT_ERROR_MESSAGE));
            });
    });

    it("should send an error if the clicked coord is missing", async () => {
        return request(app)
            .get("/api/diff-validator")
            .send({gameName: "ayylmao"})
            .expect(HttpStatus.INTERNAL_SERVER_ERROR)
            .then((response) => {
                expect(response.body).to.eql(errorResponse(FORMAT_ERROR_MESSAGE));
            });
    });

    it("should return a valid response in normal conditions", async () => {
        const body: IDiffValidatorControllerRequest = {
            gameName: "test3",
            coord: ORIGIN,
        };
        const expectedResponse: IDiffValidatorControllerResponse = {
            validDifference: true,
        };

        return request(app)
            .get("/api/diff-validator")
            .send(body)
            .expect(HttpStatus.OK)
            .then((response) => {
                expect(response.body).to.eql(expectedResponse);
            });
    });
});
