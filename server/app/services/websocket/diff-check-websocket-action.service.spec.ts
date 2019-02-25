import Axios from "axios";
import MockAdapter from "axios-mock-adapter";
import {expect} from "chai";
import { EventEmitter } from "events";
import * as HttpStatus from "http-status-codes";
import * as io from "socket.io";
import { WebsocketMessage } from "../../../../common/communication/messages/message";
import { IDiffValidatorControllerRequest } from "../../../../common/communication/requests/diff-validator-controller.request";
import { IDiffValidatorControllerResponse } from "../../../../common/communication/responses/diff-validator-controller.response";
import { SocketEvent } from "../../../../common/communication/socket-events";
import { DiffCheckWebsocketActionService } from "./diff-check-websocket-action.service";

class FakeSocket extends EventEmitter {
    public messageIntercepted: WebsocketMessage;
    public resolver: () => void;
    public emit (event: string | symbol, ...args: WebsocketMessage[]): boolean {
        this.messageIntercepted = args[0];
        this.resolver();

        return true;
    }

    public async waitForEmit (): Promise<void> {
        return new Promise<void> ((resolve: () => void) => {
            this.resolver = resolve;
        });
    }
}

const fakeMessage: WebsocketMessage<IDiffValidatorControllerRequest> = {
    body: {
        gameName: "Yo Max",
        coordX: -1,
        coordY: -1,
    },
    title: SocketEvent.DUMMY,
};

const socketMessageSuccess: WebsocketMessage<IDiffValidatorControllerResponse> = {
    title: SocketEvent.CHECK_DIFFERENCE,
    body: {
        differenceClusterCoords: [],
        differenceClusterId: 0,
    },
};

const socketMessageFail: WebsocketMessage<IDiffValidatorControllerResponse> = {
    title: SocketEvent.CHECK_DIFFERENCE,
    body: {
        differenceClusterCoords: [],
        differenceClusterId: 0,
    },
};

describe("A websocket service that bridges websocket and DiffValidatorController", () => {

    let axiosMock: MockAdapter;
    const diffChecker: DiffCheckWebsocketActionService = new DiffCheckWebsocketActionService();
    let fakeSocket: FakeSocket;

    beforeEach(() => {
        axiosMock = new MockAdapter(Axios);
        fakeSocket = new FakeSocket();
    });

    it("should return with error if the diff request is not resolved", async () => {
        axiosMock.onGet("http://localhost:3000/api/diff-validator")
        .reply(HttpStatus.NOT_FOUND, "");
        diffChecker.execute(fakeMessage, fakeSocket as unknown as io.Socket);

        return fakeSocket.waitForEmit().then(() => {
            const val: string = fakeSocket.messageIntercepted.body as string;

            return expect(val).to.be.equal(DiffCheckWebsocketActionService.DIFF_ERR);
        });
    });

    it("should return it's a valid difference", async () => {
        axiosMock.onGet("http://localhost:3000/api/diff-validator")
        .reply(HttpStatus.OK, socketMessageSuccess);
        diffChecker.execute(fakeMessage, fakeSocket as unknown as io.Socket);

        return fakeSocket.waitForEmit().then(() => {
            const val: IDiffValidatorControllerResponse = 
            (fakeSocket.messageIntercepted.body as WebsocketMessage<IDiffValidatorControllerResponse>).body;

            return expect(val.differenceClusterId).to.exist;
        });
    });

    it("should return it's a false difference on status NOT FOUND", async () => {
        axiosMock.onGet("http://localhost:3000/api/diff-validator")
        .reply(HttpStatus.NOT_FOUND, socketMessageFail);
        diffChecker.execute(fakeMessage, fakeSocket as unknown as io.Socket);

        return fakeSocket.waitForEmit().then(() => {
            const val: string = (fakeSocket.messageIntercepted.body as string);

            return expect(val).to.be.equal("");
        });
    });
});
