// tslint:disable
import { expect } from "chai";
import * as request from "supertest";
import { Application } from "../app";
import types from "../types";
import { container } from "../inversify.config";

const errorMessage = (error: Error) => {
    return {
        message: "error",
        error,
    }
};

describe("Bitmap diff controller", () => {
    let app: Express.Application;

    beforeEach(() => {
        container.rebind(types.BitmapDiffService).toConstantValue(1);
        app = container.get<Application>(types.Application).app;
    });

    it("should send an error when all images are missing", () => {
        request(app)
            .post("/api/image-diff")
            .field('name', 'testDiff')
            .then((response) => {
                expect(response.body).to.deep.equal(
                    errorMessage(new Error(`No originalImage bitmap file was found`)));
            });
    });

    it("should send an error when original image is missing", () => {
        request(app)
            .post("/api/image-diff")
            .field('name', 'testDiff')
            .attach('modifiedImage', './test/test_diffController/nope.bmp')
            .then((response) => {
                expect(response.body).to.deep.equal(
                    errorMessage(new Error(`No originalImage bitmap file was found`)));
            });
    });

    it("should send an error when modified image is missing", () => {
        request(app)
            .post("/api/image-diff")
            .field('name', 'testDiff')
            .attach('originalImage', './test/test_diffController/nope.bmp')
            .then((response) => {
                expect(response.body).to.deep.equal(
                    errorMessage(new Error(`No modifiedImage bitmap file was found`)));
            });
    });

    it("should send an error when wrong image type is sent", () => {
        request(app)
            .post("/api/image-diff")
            .field('name', 'testDiff')
            .then((response) => {
                expect(response.body).to.deep.equal(
                    errorMessage(new Error(`No original bitmap file was found`)));
            });
    });

    it("should send an error when image dimensions aren't 640x480", () => {
        request(app)
            .post("/api/image-diff")
            .field('name', 'testDiff')
            .attach('originalImage', './test/test_diffController/nope.bmp')
            .then((response) => {
                expect(response.body).to.deep.equal(
                    errorMessage(new Error(`originalImage bitmap file is not the right size`)));
            });
    });

    it("should send an error when no name specified", () => {
        request(app)
            .post("/api/image-diff")
            .attach('originalImage', './test/test_diffController/nope.bmp')
            .attach('modifiedImage', './test/test_diffController/nope.bmp')
            .expect(500)
            .then((response) => {
                expect(response.body).to.deep.equal(
                    errorMessage(new Error(`No name was specified`)));
            });
    });
});