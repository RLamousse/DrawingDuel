/* tslint:disable */
import {expect} from 'chai';
import * as supertest from 'supertest';
import {Message} from '../../../common/communication/message';
import {Application} from '../app';
import {container} from '../inversify.config';
import TYPES from '../types';
import types from '../types';

const mockedHelloWorld = {
    title: 'Hello world',
    body: 'Time is whatever',
};

const mockedAbout = {
    title: 'About test',
    body: "Mocked",
};

const mockedIndexService = {
    about: () => mockedAbout,

    helloWorld: async () => {
        return Promise.resolve(mockedHelloWorld);
    },
};

describe("Index controller", () => {
    let app: Express.Application;

    beforeEach(() => {
        container.rebind(types.BitmapDiffService).toConstantValue(mockedIndexService);
        app = container.get<Application>(TYPES.Application).app;
    });

    it("should return correct helloWorld message", async () => {
        return supertest(app)
            .get("/api/index")
            .expect("Content-Type", /json/)
            .expect(200)
            .then((response) => {
                expect((response.body) as Message).to.deep.equal(mockedHelloWorld,
                                                                 "did not receive correct message");
            });
    });

    it("should return about message from injected IndexService", async () => {
        return supertest(app)
            .get("/api/index/about")
            .expect("Content-type", /json/)
            .expect(200)
            .then((response) => {
                expect(response.body).to.deep.equal(mockedAbout,
                                                    "message does not match mocked one");
            });
    });
});
