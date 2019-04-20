import {expect} from "chai";
import sinon = require("sinon");
import {Server} from "socket.io";
import {createWebsocketMessage, WebsocketMessage} from "../../../../common/communication/messages/message";
import {SocketEvent} from "../../../../common/communication/socket-events";
import {RadioTowerService} from "./radio-tower.service";

class FakeServer {

    public constructor() {
        this.emitValue = "";
        this.eventValue = "";
        this.socketsCalled = false;
        this.inCalled = false;
        this.toCalled = false;
    }

    // tslint:disable-next-line:no-any
    public sockets: any = {
        emit: (event: string, message: WebsocketMessage<string>) => {
            this.socketsCalled = true;
            this.eventValue = event;
            this.emitValue = message.body;
        },
    };

    public eventValue: string;
    public emitValue: string;
    public inCalled: boolean;
    public toCalled: boolean;
    public socketsCalled: boolean;

    // tslint:disable-next-line:no-any
    public in(room: string): any {
        return {
            emit: (event: string, message: WebsocketMessage<string>) => {
                this.inCalled = true;
                this.eventValue = event;
                this.emitValue = message.body;
            },
        };
    }

    // tslint:disable-next-line:no-any
    public to(succ: string): any {
        return {
            emit: (event: string, message: WebsocketMessage<string>) => {
                this.toCalled = true;
                this.eventValue = event;
                this.emitValue = message.body;
            },
        };
    }

    public emit(event: string, message: WebsocketMessage<string>): void {
        this.eventValue = event;
        this.emitValue = message.body;
    }
}

describe("Radio Tower Service", () => {

    let service: RadioTowerService;
    let server: FakeServer;
    beforeEach(() => {
        service = new RadioTowerService();
        server = new FakeServer();
        service.server = server as unknown as Server;
    });

    it("should do a server broadcast", async () => {
        sinon.spy(service.server.sockets.emit);
        service.broadcast(SocketEvent.DUMMY, createWebsocketMessage("Thank you Kanye very cool"));
        expect(server.eventValue).to.equal(SocketEvent.DUMMY);
        expect(server.emitValue).to.equal("Thank you Kanye very cool");

        return expect(server.socketsCalled).to.be.true;
    });

    it("should do a room broadcast", async () => {
        sinon.spy(service.server.in("").emit);
        service.sendToRoom(SocketEvent.DUMMY, createWebsocketMessage("Thank you Kanye very cool"), "");
        expect(server.eventValue).to.equal(SocketEvent.DUMMY);
        expect(server.emitValue).to.equal("Thank you Kanye very cool");

        return expect(server.inCalled).to.be.true;
    });

    it("should send a private message", async () => {
        sinon.spy(service.server.to("").emit);
        service.privateSend(SocketEvent.DUMMY, createWebsocketMessage("Thank you Kanye very cool"), "");
        expect(server.eventValue).to.equal(SocketEvent.DUMMY);
        expect(server.emitValue).to.equal("Thank you Kanye very cool");

        return expect(server.toCalled).to.be.true;
    });
});
