// tslint:disable:typedef
import { expect } from "chai";
import * as HttpStatus from "http-status-codes";
import * as request from "supertest";
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

describe("Bitmap diff controller", () => {
    let app: Express.Application;

    beforeEach(() => {
        // container.rebind(types.BitmapDiffService).toConstantValue(mockedBitmapService);
        // container.rebind(types.BitmapWriter).toConstantValue(mockedBitmapWriter);
        app = container.get<Application>(types.Application).app;
    });

    it("should send an error when all images are missing", async () => {
        return request(app)
            .post("/api/diff-validator")
            .field("name", "testDiff1")
            .expect(HttpStatus.INTERNAL_SERVER_ERROR)
            .then((response) => {
                expect(response.body).to.deep.equal(errorResponse(FORMAT_ERROR_MESSAGE));
            });
    });
});
