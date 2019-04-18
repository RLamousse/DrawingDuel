// responses are generic so we don't want to define the tests in this file
// tslint:disable:typedef
import {expect} from "chai";
import * as HttpStatus from "http-status-codes";
import * as request from "supertest";
import {anything, instance, mock, verify, when} from "ts-mockito";
import {Message} from "../../../common/communication/messages/message";
import {
    GAME_MANAGER_FREE,
    GAME_MANAGER_SIMPLE,
} from "../../../common/communication/routes";
import {DatabaseError, NonExistentGameError} from "../../../common/errors/database.errors";
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

        when(mockSimpleGames.delete(anything())).thenResolve(SUCCESS_MESSAGE);
        when(mockSimpleGames.getAll()).thenResolve([]);
        when(mockSimpleGames.getAllWithQuery(anything())).thenResolve([]);
        when(mockSimpleGames.getFromId(anything())).thenResolve();

        when(mockFreeGames.delete(anything())).thenResolve(SUCCESS_MESSAGE);
        when(mockFreeGames.getAll()).thenResolve([]);
        when(mockFreeGames.getAllWithQuery(anything())).thenResolve([]);
        when(mockFreeGames.getFromId(anything())).thenResolve();

        container.rebind(types.DataBaseService).toConstantValue(instance(mockDataBaseService));
        app = container.get<Application>(types.Application).app;
    });

    describe("Simple Games", () => {
        it("should send empty array get all", async () => {
            return request(app)
                .get(GAME_MANAGER_SIMPLE)
                .expect(HttpStatus.OK)
                .then((response) => {
                    verify(mockSimpleGames.getAll()).once();
                    expect(response.body).to.eql([]);
                });
        });
        it("should send a empty array on get not deleted", async () => {
            return request(app)
                .get(GAME_MANAGER_SIMPLE)
                .query({filterDeleted: true})
                .expect(HttpStatus.OK)
                .then((response) => {
                    verify(mockSimpleGames.getAllWithQuery(anything())).once();
                    expect(response.body).to.eql([]);
                });
        });
        it("should send a success message on get one game", async () => {
            return request(app)
                .get(GAME_MANAGER_SIMPLE + "someGameTest")
                .expect(HttpStatus.OK);
        });
        it("should send an error if the game is not found", async () => {
            when(mockSimpleGames.getFromId(anything())).thenReject(new NonExistentGameError());

            return request(app)
                .get(GAME_MANAGER_SIMPLE + "notExistingGame")
                .expect(HttpStatus.NOT_FOUND);
        });
        it("should send an error if there was an error in the server", async () => {
            when(mockSimpleGames.getFromId(anything())).thenReject(new DatabaseError());

            return request(app)
                .get(GAME_MANAGER_SIMPLE + "/notExistingGame")
                .expect(HttpStatus.INTERNAL_SERVER_ERROR);
        });
    });

    describe("Free Games", () => {
        it("should send a empty array on get all", async () => {
            return request(app)
                .get(GAME_MANAGER_FREE)
                .expect(HttpStatus.OK)
                .then((response) => {
                    verify(mockFreeGames.getAll()).once();
                    expect(response.body).to.eql([]);
                });
        });
        it("should send a empty array on get all", async () => {
            return request(app)
                .get(GAME_MANAGER_FREE)
                .query({filterDeleted: true})
                .expect(HttpStatus.OK)
                .then((response) => {
                    verify(mockFreeGames.getAllWithQuery(anything())).once();
                    expect(response.body).to.eql([]);
                });
        });
        it("should send a success message on get one game", async () => {
            return request(app)
                .get(GAME_MANAGER_FREE + "someGameTest")
                .expect(HttpStatus.OK);
        });
        it("should send an error if the game is not found", async () => {
            when(mockFreeGames.getFromId(anything())).thenReject(new NonExistentGameError());

            return request(app)
                .get(GAME_MANAGER_FREE + "notExistingGame")
                .expect(HttpStatus.NOT_FOUND);
        });
        it("should send an error if there was an error in the server", async () => {
            when(mockFreeGames.getFromId(anything())).thenReject(new DatabaseError());

            return request(app)
                .get(GAME_MANAGER_FREE + "notExistingGame")
                .expect(HttpStatus.INTERNAL_SERVER_ERROR);
        });
    });
});
