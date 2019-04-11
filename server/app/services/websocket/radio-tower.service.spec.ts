import {expect} from "chai";
import sinon = require("sinon");
import {Server} from "socket.io";
import {SocketEvent} from "../../../../common/communication/socket-events";
import {RadioTowerService} from "./radio-tower.service";

class FakeServer {
    // tslint:disable-next-line:no-any
    public sockets: any = {
        emit: this.emit,
    };

    // tslint:disable-next-line:no-any
    public in(room: string): any {
        return {
            emit: this.emit,
        };
    }

    // tslint:disable-next-line:no-any
    public to(succ: string): any {
        return {
            emit: this.emit,
        };
    }

    // tslint:disable-next-line:no-any
    public emit(event: string, args: any): void {
        //
    }
}

describe.skip("Radio Tower Service", () => {

    let service: RadioTowerService;
    beforeEach(() => {
        service = new RadioTowerService();
        service.server = new FakeServer() as unknown as Server;
    });

    it("should do a server broadcast", async () => {
        sinon.spy(service.server.sockets.emit);
        service.broadcast(SocketEvent.DUMMY, "Thank you Kanye very cool");

        return expect(service.server.sockets.emit["calledOnce"]).to.be.true;
    });

    it("should do a room broadcast", async () => {
        sinon.spy(service.server.in("").emit);
        service.sendToRoom(SocketEvent.DUMMY, "Thank you Kanye very cool", "");

        return expect(service.server.in("").emit["calledOnce"]).to.be.true;
    });

    it("should send a private message", async () => {
        sinon.spy(service.server.to("").emit);
        service.broadcast(SocketEvent.DUMMY, "Thank you Kanye very cool");

        return expect(service.server.to("").emit["calledOnce"]).to.be.true;
    });
});
