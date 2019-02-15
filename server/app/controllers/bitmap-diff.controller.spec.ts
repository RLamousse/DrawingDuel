// tslint:disable:typedef
import { expect } from "chai";
import * as HttpStatus from "http-status-codes";
import * as request from "supertest";
import {Bitmap} from "../../../common/image/bitmap/bitmap";
import { Application } from "../app";
import { container } from "../inversify.config";
import types from "../types";
import {BMP_ERROR_MESSAGE, FORMAT_ERROR_MESSAGE} from "./controller-utils";

const errorResponse = (errorMessage: string) => {
    return {
        message: errorMessage,
        error: {},
    };
};

const mockedBitmapService = {
        getDiff: () => "filename",
};

const mockedBitmapWriter = {
        getBitmapBytes: (bitmap: Bitmap) => Buffer.of(0),
};

describe("Bitmap diff controller", () => {
    let app: Express.Application;

    beforeEach(() => {
        container.rebind(types.BitmapDiffService).toConstantValue(mockedBitmapService);
        container.rebind(types.BitmapWriter).toConstantValue(mockedBitmapWriter);
        app = container.get<Application>(types.Application).app;
    });

    it("should send an error when all images are missing", async () => {
        return request(app)
            .post("/api/image-diff")
            .field("name", "testDiff1")
            .expect(HttpStatus.INTERNAL_SERVER_ERROR)
            .then((response) => {
                expect(response.body).to.deep.equal(errorResponse(FORMAT_ERROR_MESSAGE));
            });
    });

    it("should send an error when original image is missing", async () => {
        return request(app)
            .post("/api/image-diff")
            .field("name", "testDiff2")
            .attach("modifiedImage", "./test/test_bitmaps/white640x480.bmp")
            .expect(HttpStatus.INTERNAL_SERVER_ERROR)
            .then((response) => {
                expect(response.body).to.deep.equal(errorResponse(FORMAT_ERROR_MESSAGE));
            });
    });

    it("should send an error when modified image is missing", async () => {
        return request(app)
            .post("/api/image-diff")
            .field("name", "testDiff3")
            .attach("originalImage", "./test/test_bitmaps/white640x480.bmp")
            .expect(HttpStatus.INTERNAL_SERVER_ERROR)
            .then((response) => {
                expect(response.body).to.deep.equal(errorResponse(FORMAT_ERROR_MESSAGE));
            });
    });

    it("should send an error when wrong image type is sent", async () => {
        return request(app)
            .post("/api/image-diff")
            .field("name", "testDiff4")
            .attach("originalImage", "./test/test_diffController/jobs.jpg")
            .attach("modifiedImage", "./test/test_diffController/jobs.jpg")
            .expect(HttpStatus.INTERNAL_SERVER_ERROR)
            .then((response) => {
                expect(response.body.message).to.equal(BMP_ERROR_MESSAGE);
            });
    });

    it("should send an error when image dimensions aren't 640x480", async () => {
        return request(app)
            .post("/api/image-diff")
            .field("name", "testDiff5")
            .attach("originalImage", "./test/test_bitmaps/black10x10.bmp")
            .attach("modifiedImage", "./test/test_bitmaps/white10x10.bmp")
            .expect(HttpStatus.INTERNAL_SERVER_ERROR)
            .then((response) => {
                expect(response.body.message).to.match(/Error: .+\.bmp bitmap file is not the right size\./);
            });
    });

    it("should send an error when no name specified", async () => {
        return request(app)
            .post("/api/image-diff")
            .attach("originalImage", "./test/test_bitmaps/black10x10.bmp")
            .attach("modifiedImage", "./test/test_bitmaps/black10x10.bmp")
            .expect(HttpStatus.INTERNAL_SERVER_ERROR)
            .then((response) => {
                expect(response.body).to.deep.equal(errorResponse(FORMAT_ERROR_MESSAGE));
            });
    });

    it("should send an success response for valid data", async () => {
        return request(app)
            .post("/api/image-diff")
            .field("name", "testDiff7")
            .attach("originalImage", "./test/test_bitmaps/pika.o.bmp")
            .attach("modifiedImage", "./test/test_bitmaps/pika.m.bmp")
            .expect(HttpStatus.OK)
            .then((response) => {
                expect(response.body).to.deep.equal(Buffer.from([0]));
            });
    });
});
