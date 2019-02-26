/* tslint:disable:max-file-line-count null no-empty */
// tslint:disable:typedef
import {expect} from "chai";
import * as HttpStatus from "http-status-codes";
import * as request from "supertest";
import {anything, instance, mock, when} from "ts-mockito";
import {Message} from "../../../common/communication/messages/message";
import {IFreeGame} from "../../../common/model/game/free-game";
import {ISimpleGame} from "../../../common/model/game/simple-game";
import {IUser} from "../../../common/model/user";
import {Application} from "../app";
import {container} from "../inversify.config";
import {DataBaseService} from "../services/data-base.service";
import {DATA_BASE_MESSAGE_ERROR} from "../services/db/collection.service";
import {FreeGamesCollectionService} from "../services/db/free-games.collection.service";
import {
    NON_EXISTING_GAME_ERROR_MESSAGE,
    SimpleGamesCollectionService
} from "../services/db/simple-games.collection.service";
import {UsersCollectionService} from "../services/db/users.collection.service";
import types from "../types";

// @ts-ignore
const errorResponse = (errorMessage: string) => {
    return {
        message: errorMessage,
        error: {},
    };
};

// @ts-ignore
const SUCCESS_MESSAGE: Message = {title: "success", body: "success"};

describe("Data-base controller", () => {
    let app: Express.Application;
    let mockDataBaseService: DataBaseService;
    let mockUsers: UsersCollectionService;
    // @ts-ignore
    let mockSimpleGames: SimpleGamesCollectionService;
    // @ts-ignore
    let mockFreeGames: FreeGamesCollectionService;

    beforeEach(() => {
        mockDataBaseService = mock(DataBaseService);

        mockUsers = mock(UsersCollectionService);
        mockSimpleGames = mock(SimpleGamesCollectionService);
        mockFreeGames = mock(FreeGamesCollectionService);

        when(mockDataBaseService.users).thenReturn(instance(mockUsers));
        when(mockDataBaseService.simpleGames).thenReturn(instance(mockSimpleGames));
        when(mockDataBaseService.freeGames).thenReturn(instance(mockFreeGames));

        when(mockUsers.create(anything())).thenResolve(SUCCESS_MESSAGE);
        when(mockUsers.delete(anything())).thenResolve(SUCCESS_MESSAGE);

        when(mockSimpleGames.create(anything())).thenResolve(SUCCESS_MESSAGE);
        when(mockSimpleGames.delete(anything())).thenResolve(SUCCESS_MESSAGE);
        when(mockSimpleGames.getAll()).thenResolve([]);
        when(mockSimpleGames.getFromId(anything())).thenResolve();

        when(mockFreeGames.create(anything())).thenResolve(SUCCESS_MESSAGE);
        when(mockFreeGames.delete(anything())).thenResolve(SUCCESS_MESSAGE);
        when(mockFreeGames.getAll()).thenResolve([]);
        when(mockFreeGames.getFromId(anything())).thenResolve();

        container.rebind(types.DataBaseService).toConstantValue(instance(mockDataBaseService));
        app = container.get<Application>(types.Application).app;
    });

    describe("Users", () => {
        it("should send a success message on create", async () => {
            const requestToSend: IUser = {userName: "mike"};

            return request(app)
                .post("/api/data-base/users")
                .send(requestToSend)
                .expect(HttpStatus.OK)
                .then((response) => {
                    expect(response.body).to.eql(SUCCESS_MESSAGE);
                });
        });
        it("should send a success message on delete", async () => {
            return request(app)
                .delete("/api/data-base/users/mike")
                .expect(HttpStatus.OK)
                .then((response) => {
                    expect(response.body).to.eql(SUCCESS_MESSAGE);
                });
        });
    });

    describe("Simple Games", () => {
        it("should send a success message on create", async () => {
            const requestToSend: ISimpleGame = {gameName: "someGameTest",
                                                bestSoloTimes: [],
                                                bestMultiTimes: [],
                                                originalImage: "",
                                                modifiedImage: "",
                                                diffData: [],
            };

            return request(app)
                .post("/api/data-base/games/simple")
                .send(requestToSend)
                .expect(HttpStatus.OK)
                .then((response) => {
                    expect(response.body).to.eql(SUCCESS_MESSAGE);
                });
        });
        it("should send a success message on delete", async () => {
            return request(app)
                .delete("/api/data-base/games/simple/someGameTest")
                .expect(HttpStatus.OK)
                .then((response) => {
                    expect(response.body).to.eql(SUCCESS_MESSAGE);
                });
        });
        it("should send a success message on get all", async () => {
            return request(app)
                .get("/api/data-base/games/simple")
                .expect(HttpStatus.OK)
                .then((response) => {
                    expect(response.body).to.eql([]);
                });
        });
        it("should send a success message on get one game", async () => {
            return request(app)
                .get("/api/data-base/games/simple/someGameTest")
                .expect(HttpStatus.OK)
                .then((response) => {
                    expect(true).to.be.equal(true);
                });
        });
        it("should send an error if the game is not found", async () => {
            when(mockSimpleGames.getFromId(anything())).thenReject(new Error(NON_EXISTING_GAME_ERROR_MESSAGE));

            return request(app)
                .get("/api/data-base/games/simple/notExistingGame")
                .expect(HttpStatus.NOT_FOUND)
                .then((response) => {
                    expect(true).to.be.equal(true);
                });
        });
        it("should send an error if there was an error in the server", async () => {
            when(mockSimpleGames.getFromId(anything())).thenReject(new Error(DATA_BASE_MESSAGE_ERROR));

            return request(app)
                .get("/api/data-base/games/simple/notExistingGame")
                .expect(HttpStatus.INTERNAL_SERVER_ERROR)
                .then((response) => {
                    expect(true).to.be.equal(true);
                });
        });
    });

    describe("Free Games", () => {
        it("should send an success message on create", async () => {
            const requestToSend: IFreeGame = {gameName: "someGameTest",
                                              bestSoloTimes: [],
                                              bestMultiTimes: [],
                                              scenes: {
                                                  originalObjects: [],
                                                  modifiedObjects: [],
                                              },
            };

            return request(app)
                .post("/api/data-base/games/free")
                .send(requestToSend)
                .expect(HttpStatus.OK)
                .then((response) => {
                    expect(response.body).to.eql(SUCCESS_MESSAGE);
                });
        });
        it("should send a success message on delete", async () => {
            return request(app)
                .delete("/api/data-base/games/free/someGameTest")
                .expect(HttpStatus.OK)
                .then((response) => {
                    expect(response.body).to.eql(SUCCESS_MESSAGE);
                });
        });
        it("should send a success message on get all", async () => {
            return request(app)
                .get("/api/data-base/games/free")
                .expect(HttpStatus.OK)
                .then((response) => {
                    expect(response.body).to.eql([]);
                });
        });
        it("should send a success message on get one game", async () => {
            return request(app)
                .get("/api/data-base/games/free/someGameTest")
                .expect(HttpStatus.OK)
                .then((response) => {
                    expect(true).to.be.equal(true);
                });
        });
        it("should send an error if the game is not found", async () => {
            when(mockFreeGames.getFromId(anything())).thenReject(new Error(NON_EXISTING_GAME_ERROR_MESSAGE));

            return request(app)
                .get("/api/data-base/games/free/notExistingGame")
                .expect(HttpStatus.NOT_FOUND)
                .then((response) => {
                    expect(true).to.be.equal(true);
                });
        });
        it("should send an error if there was an error in the server", async () => {
            when(mockFreeGames.getFromId(anything())).thenReject(new Error(DATA_BASE_MESSAGE_ERROR));

            return request(app)
                .get("/api/data-base/games/free/notExistingGame")
                .expect(HttpStatus.INTERNAL_SERVER_ERROR)
                .then((response) => {
                    expect(true).to.be.equal(true);
                });
        });
    });
});
