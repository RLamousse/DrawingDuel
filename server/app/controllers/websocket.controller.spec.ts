import { expect } from "chai";
import { EventEmitter } from "events";
import * as io from "socket.io";
import { container } from "../inversify.config";
import types from "../types";
import { WebsocketController } from "./websocket.controller";


describe("Websocket controller", () => {
    let controller: WebsocketController;

    beforeEach(() => {
        controller = container.get<WebsocketController>(types.WebsocketController);
    });

    it("should initialize", () => {
        // tslint:disable-next-line:no-unused-expression
        expect(controller).to.exist;
    });

    it("should return a socket with listeners", () => {
        expect(controller.registerSocket(new EventEmitter() as io.Socket)
        .eventNames().length).to.be.greaterThan(0);
    });
});
