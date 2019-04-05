import { expect } from "chai";
import { EventEmitter } from "events";
import * as io from "socket.io";
import { WebsocketMessage } from "../../../common/communication/messages/message";
import { container } from "../inversify.config";
import types from "../types";
import { WebsocketController } from "./websocket.controller";

class Socket {
    public constructor () {
        this.emitValue = "";
        this.eventValue = "";
        this.id = "max";
        this.emit = this.emit.bind(this);
    }
    public eventValue: string;
    public emitValue: string;
    public id: string;
    public broadcast: Object = {
        emit: (event: string, message: WebsocketMessage<string>) => {
            this.eventValue = event;
            this.emitValue = message.body;
        },
    };
    public emit(event: string, message: WebsocketMessage<string>): void {
        this.eventValue = event;
        this.emitValue = message.body;
    }
}

const radioTower = {
    broadcast: () => {
    },
};

describe("Websocket controller", () => {
    let controller: WebsocketController;

    beforeEach(() => {
        controller = container.get<WebsocketController>(types.WebsocketController);
        container.rebind(types.RadioTowerService).toConstantValue(radioTower);
    });

    it("should initialize", () => {
        return expect(controller).to.exist;
    });

    it("should return a socket with listeners", () => {
        expect(controller.registerSocket(new EventEmitter() as io.Socket)
        .eventNames().length).to.be.greaterThan(0);
    });

    it("should add user when he connects", () => {
        const socket: Socket = new Socket();
        controller["userConnectionRoutine"]("Maxime", socket as unknown as io.Socket);
        expect(controller["sockets"].size).to.be.greaterThan(0);
    });

    it("should remove user when he disconnects", () => {
        const socket: Socket = new Socket();
        controller["userConnectionRoutine"]("Maxime", socket as unknown as io.Socket);
        controller["userDisconnectionRoutine"](socket as unknown as io.Socket);
        expect(controller["sockets"].size).to.equal(0);
    });
});
