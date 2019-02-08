// tslint:disable:typedef
import { expect } from "chai";
import * as HttpStatus from "http-status-codes";
import * as request from "supertest";
import {IDiffValidatorControllerRequest} from "../../../common/communication/requests/diff-validator-controller.request";
import {ORIGIN} from "../../../common/model/IPoint";
import { Application } from "../app";
import { container } from "../inversify.config";
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
        // container.rebind(types.BitmapDiffService).toConstantValue(mockedBitmapService);
        // container.rebind(types.BitmapWriter).toConstantValue(mockedBitmapWriter);
        app = container.get<Application>(types.Application).app;
    });

    it("should send an error if the game name is missing", async () => {
        return request(app)
            .post("/api/diff-validator")
            .send({coord: ORIGIN})
            .expect(HttpStatus.INTERNAL_SERVER_ERROR)
            .then((response) => {
                expect(response.body).to.deep.equal(errorResponse(FORMAT_ERROR_MESSAGE));
            });
    });

    it("should send an error if the clicked coord is missing", async () => {
        return request(app)
            .post("/api/diff-validator")
            .send({gameName: "ayylmao"})
            .expect(HttpStatus.INTERNAL_SERVER_ERROR)
            .then((response) => {
                expect(response.body).to.deep.equal(errorResponse(FORMAT_ERROR_MESSAGE));
            });
    });

    it("should return a valid response in normal conditions", async () => {
        const body: IDiffValidatorControllerRequest = {
            gameName: "test3",
            coord: ORIGIN,
        };

        return request(app)
            .post("/api/diff-validator")
            .send(body)
            .expect(HttpStatus.OK)
            .then((response) => {
                expect(response.body).to.deep.equal(errorResponse(FORMAT_ERROR_MESSAGE));
            });
    });
});
