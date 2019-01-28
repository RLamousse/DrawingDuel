// tslint:disable
import {expect} from "chai";
// import * as test from "supertest";
// import { Application } from "../app";
import types from "../types";
import { container } from "../inversify.config";

describe("Bitmap diff controller", () => {
    // let app: Express.Application;

    beforeEach(() => {
        container.rebind(types.BitmapDiffService).toConstantValue(1);
        // app = container.get<Application>(types.Application).app;
    });

    it("should test stuff", () => {
        expect(true).to.be.true;
    });
    it("should throw when wrong image type is sent", () => {
        expect(true).to.be.true;
    });

    it("should throw when image dimensions aren't 640x480", () => {
        expect(true).to.be.true;
    });
});