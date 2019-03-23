// responses are generic so we don't want to define the tests in this file
// tslint:disable:typedef
import {expect} from "chai";
import * as HttpStatus from "http-status-codes";
import * as request from "supertest";
import {anything, instance, mock, when} from "ts-mockito";
import {Message} from "../../../common/communication/messages/message";
import {DB_FREE_GAME, DB_SIMPLE_GAME} from "../../../common/communication/routes";
import {DatabaseError, NonExistentGameError} from "../../../common/errors/database.errors";
import {IFreeGame} from "../../../common/model/game/free-game";
import {ISimpleGame} from "../../../common/model/game/simple-game";
import {Application} from "../app";
import {container} from "../inversify.config";
import {DataBaseService} from "../services/data-base.service";
import {FreeGamesCollectionService} from "../services/db/free-games.collection.service";
import {SimpleGamesCollectionService} from "../services/db/simple-games.collection.service";
import types from "../types";

const SUCCESS_MESSAGE: Message = {title: "success", body: "success"};

describe("Data-base controller", () => {
    let app: Express.Application;
    let mockDataBaseService: DataBaseService;
    let mockSimpleGames: SimpleGamesCollectionService;
    let mockFreeGames: FreeGamesCollectionService;

    beforeEach(() => {
        mockDataBaseService = mock(DataBaseService);

        mockSimpleGames = mock(SimpleGamesCollectionService);
        mockFreeGames = mock(FreeGamesCollectionService);

        when(mockDataBaseService.simpleGames).thenReturn(instance(mockSimpleGames));
        when(mockDataBaseService.freeGames).thenReturn(instance(mockFreeGames));

        when(mockSimpleGames.create(anything())).thenResolve(SUCCESS_MESSAGE);
        when(mockSimpleGames.update(anything(), anything())).thenResolve(SUCCESS_MESSAGE);
        when(mockSimpleGames.delete(anything())).thenResolve(SUCCESS_MESSAGE);
        when(mockSimpleGames.getAll()).thenResolve([]);
        when(mockSimpleGames.getFromId(anything())).thenResolve();

        when(mockFreeGames.create(anything())).thenResolve(SUCCESS_MESSAGE);
        when(mockFreeGames.update(anything(), anything())).thenResolve(SUCCESS_MESSAGE);
        when(mockFreeGames.delete(anything())).thenResolve(SUCCESS_MESSAGE);
        when(mockFreeGames.getAll()).thenResolve([]);
        when(mockFreeGames.getFromId(anything())).thenResolve();

        container.rebind(types.DataBaseService).toConstantValue(instance(mockDataBaseService));
        app = container.get<Application>(types.Application).app;
    });

    describe("Simple Games", () => {
        it("should send a success message on create", async () => {
            const requestToSend: ISimpleGame = {
                gameName: "someGameTest",
                bestSoloTimes: [],
                bestMultiTimes: [],
                originalImage: "",
                modifiedImage: "",
                diffData: [],
            };

            return request(app)
                .post(DB_SIMPLE_GAME)
                .send(requestToSend)
                .expect(HttpStatus.OK)
                .then((response) => {
                    expect(response.body).to.eql(SUCCESS_MESSAGE);
                });
        });
        it("should send a success message on update", async () => {
            const requestToSend: Partial<ISimpleGame> = {
                bestSoloTimes: [],
                bestMultiTimes: [],
                originalImage: "",
                diffData: [],
            };

            return request(app)
                .put(DB_SIMPLE_GAME + "someGameTest")
                .send(requestToSend)
                .expect(HttpStatus.OK)
                .then((response) => {
                    expect(response.body).to.eql(SUCCESS_MESSAGE);
                });
        });
        it("should send a success message on delete", async () => {
            return request(app)
                .delete(DB_SIMPLE_GAME + "someGameTest")
                .expect(HttpStatus.OK)
                .then((response) => {
                    expect(response.body).to.eql(SUCCESS_MESSAGE);
                });
        });
        it("should send a success message on get all", async () => {
            return request(app)
                .get(DB_SIMPLE_GAME)
                .expect(HttpStatus.OK)
                .then((response) => {
                    expect(response.body).to.eql([]);
                });
        });
        it("should send a success message on get one game", async () => {
            return request(app)
                .get(DB_SIMPLE_GAME + "someGameTest")
                .expect(HttpStatus.OK)
                .then((response) => {
                    expect(true).to.be.equal(true);
                });
        });
        it("should send an error if the game is not found", async () => {
            when(mockSimpleGames.getFromId(anything())).thenReject(new NonExistentGameError());

            return request(app)
                .get(DB_SIMPLE_GAME + "notExistingGame")
                .expect(HttpStatus.NOT_FOUND)
                .then((response) => {
                    expect(true).to.be.equal(true);
                });
        });
        it("should send an error if there was an error in the server", async () => {
            when(mockSimpleGames.getFromId(anything())).thenReject(new DatabaseError());

            return request(app)
                .get(DB_SIMPLE_GAME + "/notExistingGame")
                .expect(HttpStatus.INTERNAL_SERVER_ERROR)
                .then((response) => {
                    expect(true).to.be.equal(true);
                });
        });
    });

    describe("Free Games", () => {
        it("should send an success message on create", async () => {
            const requestToSend: IFreeGame = {
                gameName: "someGameTest",
                bestSoloTimes: [],
                bestMultiTimes: [],
                scenes: {
                    originalObjects: [],
                    modifiedObjects: [],
                },
            };

            return request(app)
                .post(DB_FREE_GAME)
                .send(requestToSend)
                .expect(HttpStatus.OK)
                .then((response) => {
                    expect(response.body).to.eql(SUCCESS_MESSAGE);
                });
        });
        it("should send a success message on update", async () => {
            const requestToSend: Partial<IFreeGame> = {
                bestSoloTimes: [],
                bestMultiTimes: [],
            };

            return request(app)
                .put(DB_FREE_GAME + "someGameTest")
                .send(requestToSend)
                .expect(HttpStatus.OK)
                .then((response) => {
                    expect(response.body).to.eql(SUCCESS_MESSAGE);
                });
        });
        it("should send a success message on delete", async () => {
            return request(app)
                .delete(DB_FREE_GAME + "someGameTest")
                .expect(HttpStatus.OK)
                .then((response) => {
                    expect(response.body).to.eql(SUCCESS_MESSAGE);
                });
        });
        it("should send a success message on get all", async () => {
            return request(app)
                .get(DB_FREE_GAME)
                .expect(HttpStatus.OK)
                .then((response) => {
                    expect(response.body).to.eql([]);
                });
        });
        it("should send a success message on get one game", async () => {
            return request(app)
                .get(DB_FREE_GAME + "someGameTest")
                .expect(HttpStatus.OK)
                .then((response) => {
                    expect(true).to.be.equal(true);
                });
        });
        it("should send an error if the game is not found", async () => {
            when(mockFreeGames.getFromId(anything())).thenReject(new NonExistentGameError());

            return request(app)
                .get(DB_FREE_GAME + "notExistingGame")
                .expect(HttpStatus.NOT_FOUND)
                .then((response) => {
                    expect(true).to.be.equal(true);
                });
        });
        it("should send an error if there was an error in the server", async () => {
            when(mockFreeGames.getFromId(anything())).thenReject(new DatabaseError());

            return request(app)
                .get(DB_FREE_GAME + "/notExistingGame")
                .expect(HttpStatus.INTERNAL_SERVER_ERROR)
                .then((response) => {
                    expect(true).to.be.equal(true);
                });
        });
    });
});
