// tslint:disable:typedef
import { expect } from "chai";
import * as HttpStatus from "http-status-codes";
import * as request from "supertest";
import {anything, anyString, instance, when, mock} from "ts-mockito";
import {Message} from "../../../common/communication/messages/message";
import { Application } from "../app";
import { container } from "../inversify.config";
import {GameCreatorService} from "../services/game-creator.service";
import types from "../types";
import {BMP_ERROR_MESSAGE, FORMAT_ERROR_MESSAGE} from "./controller-utils";

const errorResponse = (errorMessage: string) => {
    return {
        message: errorMessage,
        error: {},
    };
};

const successMessage: Message = {title: "Game created", body: "The game was successfully created!"};

describe("Game creator controller", () => {
    let app: Express.Application;
    let mockedGameCreatorService: GameCreatorService;

    beforeEach(() => {
        mockedGameCreatorService = mock(GameCreatorService);
        when(mockedGameCreatorService.createSimpleGame(anyString(), anything(), anything())).thenResolve(successMessage);
        container.rebind(types.GameCreatorService).toConstantValue(instance(mockedGameCreatorService));
        app = container.get<Application>(types.Application).app;
    });

    it("should send an error when all images are missing", async () => {
        return request(app)
            .post("/api/game-creator/create-simple-game")
            .field("gameName", "testDiff1")
            .expect(HttpStatus.INTERNAL_SERVER_ERROR)
            .then((response) => {
                expect(response.body).to.eql(errorResponse(FORMAT_ERROR_MESSAGE));
            });
    });

    it("should send an error when original image is missing", async () => {
        return request(app)
            .post("/api/game-creator/create-simple-game")
            .field("gameName", "testDiff2")
            .attach("modifiedImage", "./test/test_bitmaps/white640x480.bmp")
            .expect(HttpStatus.INTERNAL_SERVER_ERROR)
            .then((response) => {
                expect(response.body).to.eql(errorResponse(FORMAT_ERROR_MESSAGE));
            });
    });

    it("should send an error when modified image is missing", async () => {
        return request(app)
            .post("/api/game-creator/create-simple-game")
            .field("gameName", "testDiff3")
            .attach("originalImage", "./test/test_bitmaps/white640x480.bmp")
            .expect(HttpStatus.INTERNAL_SERVER_ERROR)
            .then((response) => {
                expect(response.body).to.eql(errorResponse(FORMAT_ERROR_MESSAGE));
            });
    });

    it("should send an error when wrong image type is sent", async () => {
        return request(app)
            .post("/api/game-creator/create-simple-game")
            .field("gameName", "testDiff4")
            .attach("originalImage", "./test/test_diffController/jobs.jpg")
            .attach("modifiedImage", "./test/test_diffController/jobs.jpg")
            .expect(HttpStatus.INTERNAL_SERVER_ERROR)
            .then((response) => {
                expect(response.body.message).to.equal(BMP_ERROR_MESSAGE);
            });
    });

    it("should send an error when no name specified", async () => {
        return request(app)
            .post("/api/game-creator/create-simple-game")
            .attach("originalImage", "./test/test_bitmaps/black10x10.bmp")
            .attach("modifiedImage", "./test/test_bitmaps/black10x10.bmp")
            .expect(HttpStatus.INTERNAL_SERVER_ERROR)
            .then((response) => {
                expect(response.body).to.eql(errorResponse(FORMAT_ERROR_MESSAGE));
            });
    });

    it("should send an success response for valid data", async () => {
        return request(app)
            .post("/api/game-creator/create-simple-game")
            .field("gameName", "testDiff7")
            .attach("originalImage", "./test/test_bitmaps/pika.o.bmp")
            .attach("modifiedImage", "./test/test_bitmaps/pika.m.bmp")
            .expect(HttpStatus.OK)
            .then((response) => {
                expect(response.body).to.eql(successMessage);
            });
    });
});
