/* tslint:disable:max-file-line-count */
// tslint:disable:typedef
import {expect} from "chai";
import * as HttpStatus from "http-status-codes";
import * as request from "supertest";
import {anything, anyString, instance, mock, when} from "ts-mockito";
import {ICreateFreeGameRequest} from "../../../common/communication/requests/game-creator.controller.request";
import {FREE_GAME_CREATION_ROUTE, SIMPLE_GAME_CREATION_ROUTE} from "../../../common/communication/routes";
import {IllegalImageFormatError} from "../../../common/errors/bitmap.errors";
import {RequestFormatError} from "../../../common/errors/controller.errors";
import {
    ModificationType,
    Themes
} from "../../../common/free-game-json-interface/FreeGameCreatorInterface/free-game-enum";
import {Application} from "../app";
import {container} from "../inversify.config";
import {GameCreatorService} from "../services/game-creator.service";
import types from "../types";
import {GAME_CREATION_SUCCESS_MESSAGE} from "./controller-utils";

const errorResponse = (errorMessage: string) => {
    return {
        message: errorMessage,
        error: {},
    };
};

describe("Game creator controller", () => {
    let app: Express.Application;
    let mockedGameCreatorService: GameCreatorService;

    beforeEach(() => {
        mockedGameCreatorService = mock(GameCreatorService);
        when(mockedGameCreatorService.createSimpleGame(anyString(), anything(), anything())).thenResolve(GAME_CREATION_SUCCESS_MESSAGE);
        when(mockedGameCreatorService.createFreeGame(anyString(), anything(), anything(), anything()))
            .thenResolve(GAME_CREATION_SUCCESS_MESSAGE);
        container.rebind(types.GameCreatorService).toConstantValue(instance(mockedGameCreatorService));
        app = container.get<Application>(types.Application).app;
    });

    describe("Create simple game", () => {
        it("should send an error when all images are missing", async () => {
            return request(app)
                .post(SIMPLE_GAME_CREATION_ROUTE)
                .field("gameName", "testDiff1")
                .expect(HttpStatus.INTERNAL_SERVER_ERROR)
                .then((response) => {
                    expect(response.body).to.eql(errorResponse(RequestFormatError.FORMAT_ERROR_MESSAGE));
                });
        });

        it("should send an error when original image is missing", async () => {
            return request(app)
                .post(SIMPLE_GAME_CREATION_ROUTE)
                .field("gameName", "testDiff2")
                .attach("modifiedImage", "./test/test_bitmaps/white640x480.bmp")
                .expect(HttpStatus.INTERNAL_SERVER_ERROR)
                .then((response) => {
                    expect(response.body).to.eql(errorResponse(RequestFormatError.FORMAT_ERROR_MESSAGE));
                });
        });

        it("should send an error when modified image is missing", async () => {
            return request(app)
                .post(SIMPLE_GAME_CREATION_ROUTE)
                .field("gameName", "testDiff3")
                .attach("originalImage", "./test/test_bitmaps/white640x480.bmp")
                .expect(HttpStatus.INTERNAL_SERVER_ERROR)
                .then((response) => {
                    expect(response.body).to.eql(errorResponse(RequestFormatError.FORMAT_ERROR_MESSAGE));
                });
        });

        it("should send an error when wrong image type is sent", async () => {
            return request(app)
                .post(SIMPLE_GAME_CREATION_ROUTE)
                .field("gameName", "testDiff4")
                .attach("originalImage", "./test/test_diffController/jobs.jpg")
                .attach("modifiedImage", "./test/test_diffController/jobs.jpg")
                .expect(HttpStatus.INTERNAL_SERVER_ERROR)
                .then((response) => {
                    expect(response.body.message)
                        .to.equal(IllegalImageFormatError.ILLEGAL_IMAGE_FORMAT_MESSAGE_ERROR);
                });
        });

        it("should send an error when no name specified", async () => {
            return request(app)
                .post(SIMPLE_GAME_CREATION_ROUTE)
                .attach("originalImage", "./test/test_bitmaps/black10x10.bmp")
                .attach("modifiedImage", "./test/test_bitmaps/black10x10.bmp")
                .expect(HttpStatus.INTERNAL_SERVER_ERROR)
                .then((response) => {
                    expect(response.body).to.eql(errorResponse(RequestFormatError.FORMAT_ERROR_MESSAGE));
                });
        });

        it("should send an success response for valid data", async () => {
            return request(app)
                .post(SIMPLE_GAME_CREATION_ROUTE)
                .field("gameName", "testDiff7")
                .attach("originalImage", "./test/test_bitmaps/pika.o.bmp")
                .attach("modifiedImage", "./test/test_bitmaps/pika.m.bmp")
                .expect(HttpStatus.OK)
                .then((response) => {
                    expect(response.body).to.eql(GAME_CREATION_SUCCESS_MESSAGE);
                });
        });
    });

    describe("Create free game", () => {

        it("should send an error when there is no request", async () => {
            return request(app)
                .post(FREE_GAME_CREATION_ROUTE)
                .expect(HttpStatus.INTERNAL_SERVER_ERROR)
                .then((response) => {
                    expect(response.body).to.eql(errorResponse(RequestFormatError.FORMAT_ERROR_MESSAGE));
                });
        });

        it("should send an error when no name is specified", async () => {

            // @ts-ignore
            const freeRequest: ICreateFreeGameRequest = {
                objectQuantity: 1000,
                theme: Themes.Geometry,
                modificationTypes: [ModificationType.changeColor, ModificationType.remove, ModificationType.add],
            };

            return request(app)
                .post(FREE_GAME_CREATION_ROUTE)
                .send(freeRequest)
                .expect(HttpStatus.INTERNAL_SERVER_ERROR)
                .then((response) => {
                    expect(response.body).to.eql(errorResponse(RequestFormatError.FORMAT_ERROR_MESSAGE));
                });
        });

        it("should send an error when no object quantity is specified", async () => {

            // @ts-ignore
            const freeRequest: ICreateFreeGameRequest = {
                gameName: "someGameTest",
                theme: Themes.Geometry,
                modificationTypes: [ModificationType.changeColor, ModificationType.remove, ModificationType.add],
            };

            return request(app)
                .post(FREE_GAME_CREATION_ROUTE)
                .send(freeRequest)
                .expect(HttpStatus.INTERNAL_SERVER_ERROR)
                .then((response) => {
                    expect(response.body).to.eql(errorResponse(RequestFormatError.FORMAT_ERROR_MESSAGE));
                });
        });

        it("should send an error when the object quantity is lesser than 7 and items are to be deleted", async () => {

            const freeRequest: ICreateFreeGameRequest = {
                gameName: "someGameTest",
                objectQuantity: 6,
                theme: Themes.Geometry,
                modificationTypes: [ModificationType.remove],
            };

            return request(app)
                .post(FREE_GAME_CREATION_ROUTE)
                .send(freeRequest)
                .expect(HttpStatus.INTERNAL_SERVER_ERROR)
                .then((response) => {
                    expect(response.body).to.eql(errorResponse(RequestFormatError.FORMAT_ERROR_MESSAGE));
                });
        });

        it("should send a success message when the object quantity is lesser than 7 and items are not to be deleted", async () => {

            const freeRequest: ICreateFreeGameRequest = {
                gameName: "someGameTest",
                objectQuantity: 6,
                theme: Themes.Geometry,
                modificationTypes: [ModificationType.add],
            };

            return request(app)
                .post(FREE_GAME_CREATION_ROUTE)
                .send(freeRequest)
                .expect(HttpStatus.OK)
                .then((response) => {
                    expect(response.body).to.eql(GAME_CREATION_SUCCESS_MESSAGE);
                });
        });

        it("should send an error when the object quantity is lesser than 0", async () => {

            const freeRequest: ICreateFreeGameRequest = {
                gameName: "someGameTest",
                objectQuantity: -1,
                theme: Themes.Geometry,
                modificationTypes: [ModificationType.add],
            };

            return request(app)
                .post(FREE_GAME_CREATION_ROUTE)
                .send(freeRequest)
                .expect(HttpStatus.INTERNAL_SERVER_ERROR)
                .then((response) => {
                    expect(response.body).to.eql(errorResponse(RequestFormatError.FORMAT_ERROR_MESSAGE));
                });
        });

        it("should send an error when the object quantity is greater than 1000", async () => {

            const freeRequest: ICreateFreeGameRequest = {
                gameName: "someGameTest",
                objectQuantity: 1001,
                theme: Themes.Geometry,
                modificationTypes: [ModificationType.changeColor, ModificationType.remove, ModificationType.add],
            };

            return request(app)
                .post(FREE_GAME_CREATION_ROUTE)
                .send(freeRequest)
                .expect(HttpStatus.INTERNAL_SERVER_ERROR)
                .then((response) => {
                    expect(response.body).to.eql(errorResponse(RequestFormatError.FORMAT_ERROR_MESSAGE));
                });
        });

        it("should send an error when no theme is specified", async () => {

            // @ts-ignore
            const freeRequest: ICreateFreeGameRequest = {
                gameName: "freeGame",
                objectQuantity: 1000,
                modificationTypes: [ModificationType.changeColor, ModificationType.remove, ModificationType.add],
            };

            return request(app)
                .post(FREE_GAME_CREATION_ROUTE)
                .send(freeRequest)
                .expect(HttpStatus.INTERNAL_SERVER_ERROR)
                .then((response) => {
                    expect(response.body).to.eql(errorResponse(RequestFormatError.FORMAT_ERROR_MESSAGE));
            });
        });

        it("should send an error when the wrong theme is specified", async () => {

            const freeRequest: ICreateFreeGameRequest = {
                gameName: "freeGame",
                objectQuantity: 1000,
                // @ts-ignore
                theme: "Non-existing-theme",
                modificationTypes: [ModificationType.changeColor, ModificationType.remove, ModificationType.add],
            };

            return request(app)
                .post(FREE_GAME_CREATION_ROUTE)
                .send(freeRequest)
                .expect(HttpStatus.INTERNAL_SERVER_ERROR)
                .then((response) => {
                    expect(response.body).to.eql(errorResponse(RequestFormatError.FORMAT_ERROR_MESSAGE));
            });
        });

        it("should send an error when the wrong theme is specified", async () => {

            const freeRequest: ICreateFreeGameRequest = {
                gameName: "freeGame",
                objectQuantity: 1000,
                // @ts-ignore
                theme: "Non-existing-theme",
                modificationTypes: [ModificationType.changeColor, ModificationType.remove, ModificationType.add],
            };

            return request(app)
                .post(FREE_GAME_CREATION_ROUTE)
                .send(freeRequest)
                .expect(HttpStatus.INTERNAL_SERVER_ERROR)
                .then((response) => {
                    expect(response.body).to.eql(errorResponse(RequestFormatError.FORMAT_ERROR_MESSAGE));
            });
        });

        it("should send an error when no modification types are specified", async () => {

            // @ts-ignore
            const freeRequest: ICreateFreeGameRequest = {
                gameName: "freeGame",
                objectQuantity: 1000,
                theme: Themes.Sanic,
            };

            return request(app)
                .post(FREE_GAME_CREATION_ROUTE)
                .send(freeRequest)
                .expect(HttpStatus.INTERNAL_SERVER_ERROR)
                .then((response) => {
                    expect(response.body).to.eql(errorResponse(RequestFormatError.FORMAT_ERROR_MESSAGE));
            });
        });

        it("should send an error when too much modification types are requested", async () => {

            // @ts-ignore
            const freeRequest: ICreateFreeGameRequest = {
                gameName: "freeGame",
                objectQuantity: 1000,
                theme: Themes.Sanic,
                modificationTypes: [ModificationType.changeColor, ModificationType.remove, ModificationType.add, ModificationType.add],
            };

            return request(app)
                .post(FREE_GAME_CREATION_ROUTE)
                .send(freeRequest)
                .expect(HttpStatus.INTERNAL_SERVER_ERROR)
                .then((response) => {
                    expect(response.body).to.eql(errorResponse(RequestFormatError.FORMAT_ERROR_MESSAGE));
            });
        });

        it("should send an error when none modification types are requested", async () => {

            const freeRequest: ICreateFreeGameRequest = {
                gameName: "freeGame",
                objectQuantity: 1000,
                theme: Themes.Sanic,
                modificationTypes: [],
            };

            return request(app)
                .post(FREE_GAME_CREATION_ROUTE)
                .send(freeRequest)
                .expect(HttpStatus.INTERNAL_SERVER_ERROR)
                .then((response) => {
                    expect(response.body).to.eql(errorResponse(RequestFormatError.FORMAT_ERROR_MESSAGE));
            });
        });

        it("should send an error when the modification types are wrong", async () => {

            const freeRequest: ICreateFreeGameRequest = {
                gameName: "freeGame",
                objectQuantity: 1000,
                theme: Themes.Sanic,
                // tslint:disable-next-line:no-magic-numbers
                modificationTypes: [ModificationType.add, 4],
            };

            return request(app)
                .post(FREE_GAME_CREATION_ROUTE)
                .send(freeRequest)
                .expect(HttpStatus.INTERNAL_SERVER_ERROR)
                .then((response) => {
                    expect(response.body).to.eql(errorResponse(RequestFormatError.FORMAT_ERROR_MESSAGE));
            });
        });

        it("should send an success response for valid data", async () => {

            const freeRequest: ICreateFreeGameRequest = {
                gameName: "freeGame",
                objectQuantity: 1000,
                theme: Themes.Sanic,
                modificationTypes: [ModificationType.add, ModificationType.remove],
            };

            return request(app)
                .post(FREE_GAME_CREATION_ROUTE)
                .send(freeRequest)
                .expect(HttpStatus.OK)
                .then((response) => {
                    expect(response.body).to.eql(GAME_CREATION_SUCCESS_MESSAGE);
            });
        });
    });
});
