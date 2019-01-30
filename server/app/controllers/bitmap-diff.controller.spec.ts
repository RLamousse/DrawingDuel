// tslint:disable
import { expect } from "chai";
import * as request from "supertest";
import { Application } from "../app";
import types from "../types";
import { container } from "../inversify.config";

const errorResponse = (errorMessage: string) => {
    return {
        status: "error",
        error: errorMessage,
    }
};

const okResponse = (fileName: string, filePath: string) => {
    return {
        status: "ok",
        fileName: fileName,
        filePath: filePath,
    }
};

const mockedBitmapService = {
        getDiff: () => "filename"
};

const mockedBitmapWriter = {
        write: () => "filePath"
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
            .field('name', 'testDiff1')
            .then((response) => {
                expect(response.body).to.deep.equal(
                    errorResponse("Error: No files were included in request"));
            });
    });

    it("should send an error when original image is missing", async () => {
        return request(app)
            .post("/api/image-diff")
            .field('name', 'testDiff2')
            .attach('modifiedImage', './test/test_bitmaps/white640x480.bmp')
            .then((response) => {
                expect(response.body).to.deep.equal(
                    errorResponse("Error: No originalImage bitmap file was found"));
            });
    });

    it("should send an error when modified image is missing", async () => {
        return request(app)
            .post("/api/image-diff")
            .field('name', 'testDiff3')
            .attach('originalImage', './test/test_bitmaps/white640x480.bmp')
            .then((response) => {
                expect(response.body).to.deep.equal(
                    errorResponse("Error: No modifiedImage bitmap file was found"));
            });
    });

    it("should send an error when wrong image type is sent", async () => {
        return request(app)
            .post("/api/image-diff")
            .field('name', 'testDiff4')
            .attach('originalImage', './test/test_diffController/jobs.jpg')
            .attach('modifiedImage', './test/test_diffController/jobs.jpg')
            .then((response) => {
                expect(response.body.message).to.equal("Error: Only bmp's are allowed!");
            });
    });

    it("should send an error when image dimensions aren't 640x480", async () => {
        return request(app)
            .post("/api/image-diff")
            .field('name', 'testDiff5')
            .attach('originalImage', './test/test_bitmaps/black10x10.bmp')
            .attach('modifiedImage', './test/test_bitmaps/white10x10.bmp')
            .expect(500)
            .then((response) => {
                expect(response.body.error).to.match(/Error: \w+\.bmp bitmap file is not the right size/);
            });
    });

    it("should send an error when no name specified", async () => {
        return request(app)
            .post("/api/image-diff")
            .attach('originalImage', './test/test_bitmaps/black10x10.bmp')
            .attach('modifiedImage', './test/test_bitmaps/black10x10.bmp')
            .expect(500)
            .then((response) => {
                expect(response.body).to.deep.equal(
                    errorResponse("Error: No name was specified"));
            });
    });

    it("should send an success response for valid data", async () => {
        return request(app)
            .post("/api/image-diff")
            .field('name', 'testDiff7')
            .attach('originalImage', './test/test_bitmaps/pika.o.bmp')
            .attach('modifiedImage', './test/test_bitmaps/pika.m.bmp')
            .expect(200)
            .then((response) => {
                expect(response.body).to.deep.equal(okResponse("testDiff7", "filePath"));
            });
    });
});
