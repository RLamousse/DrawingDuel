// tslint:disable:typedef
import { expect } from "chai";
import { container } from "../inversify.config";
import types from "../types";
import { WebsocketController } from "./websocket.controller";

describe("Websocket controller", () => {
    let controller: WebsocketController;

    beforeEach(() => {
        controller = container.get<WebsocketController>(types.WebsocketController);
    });

    it("should initialize", () => {
        expect(controller).to.exist;
    });
});
