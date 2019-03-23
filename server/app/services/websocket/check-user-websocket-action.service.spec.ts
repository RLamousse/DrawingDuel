import { expect } from "chai";
import { WebsocketMessage } from "../../../../common/communication/messages/message";
import { SocketEvent } from "../../../../common/communication/socket-events";
import { UsernameService } from "../username.service";
import { CheckUserWebsocketActionService } from "./check-user-websocket-action.service";

class Socket {
    public constructor () {
        this.emitValue = false;
        this.eventValue = "";
    }
    public eventValue: string;
    public emitValue: boolean;
    public emit(event: string, message: WebsocketMessage<boolean>): void {
        this.eventValue = event;
        this.emitValue = message.body;
    }
}

describe("CheckUserWebsocketService", () => {

    let service: CheckUserWebsocketActionService;
    let provider: UsernameService;
    let socket: Socket;
    beforeEach(() => {
        provider = new UsernameService();
        service = new CheckUserWebsocketActionService(provider);
        socket = new Socket();
    });

    it("should return true if user is free", () => {
        const message: WebsocketMessage<string> = {
            title: SocketEvent.USERNAME_CHECK,
            body: "Maxime",
        };

        return expect(service.execute(message, socket as unknown as SocketIO.Socket)).to.be.equal("Maxime");
    });

    it("should return false if user is taken", () => {
        const message: WebsocketMessage<string> = {
            title: SocketEvent.USERNAME_CHECK,
            body: "Maxime",
        };
        service.execute(message, socket as unknown as SocketIO.Socket);
        // We are testing another condition after
        // tslint:disable-next-line: no-unused-expression
        expect(socket.emitValue).to.be.true;

        return expect(service.execute(message, socket as unknown as SocketIO.Socket)).to.be.equal("");
    });

    it("should free username successfully", () => {
        const message: WebsocketMessage<string> = {
            title: SocketEvent.USERNAME_CHECK,
            body: "Maxime",
        };
        service.execute(message, socket as unknown as SocketIO.Socket);
        service.removeUsername("Maxime");

        return expect(service.execute(message, socket as unknown as SocketIO.Socket)).to.be.equal("Maxime");
    });
});
