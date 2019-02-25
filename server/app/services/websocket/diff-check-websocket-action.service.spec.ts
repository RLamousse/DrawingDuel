import Axios from "axios";
import MockAdapter from "axios-mock-adapter";
// tslint:disable-next-line:no-duplicate-imports Weird interaction between singletons and interface (olivier st-o approved)
// import AxiosAdapter from "axios-mock-adapter";
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
    // tslint:disable-next-line:no-any
    public emit (event: string | symbol, ...args: any[]): boolean {
        this.messageIntercepted = args[0];
        this.resolver();

        return true;
    }

    public async waitForEmit (): Promise<void> {
        return new Promise<void> ((resolve) => {
            this.resolver = resolve;
        })
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

const socketMessageSuccess = {
    title: SocketEvent.CHECK_DIFFERENCE,
    body: {
        differenceClusterCoords: [],
        differenceClusterId: 0,
        validDifference: true,
    },
}

const socketMessageFail = {
    title: SocketEvent.CHECK_DIFFERENCE,
    body: {
        differenceClusterCoords: [],
        differenceClusterId: 0,
        validDifference: true,
    },
}

describe("A websocket service that bridges websocket and DiffValidatorController", () => {

    let axiosMock: MockAdapter;
    const diffChecker: DiffCheckWebsocketActionService = new DiffCheckWebsocketActionService();
    let fakeSocket: FakeSocket;

    beforeEach(() => {
        axiosMock = new MockAdapter(Axios);
        fakeSocket = new FakeSocket();
    });

    it("should return with error if the diff request is not resolved", async () => {
        diffChecker.execute(fakeMessage, fakeSocket as unknown as io.Socket);

        return fakeSocket.waitForEmit().then(() => {
            // tslint:disable-next-line:no-any
            const val: boolean = (fakeSocket.messageIntercepted as WebsocketMessage<IDiffValidatorControllerResponse>).body.validDifference;

            return expect(val).to.be.false;
        });
    });

    it("should return it's a valid difference", async () => {
        axiosMock.onGet("http://localhost:3000/api/diff-validator")
        .reply(HttpStatus.OK, socketMessageSuccess);
        diffChecker.execute(fakeMessage, fakeSocket as unknown as io.Socket);

        return fakeSocket.waitForEmit().then(() => {
            // tslint:disable-next-line:no-any
            const val: boolean = (fakeSocket.messageIntercepted.body as any).body.validDifference;

            return expect(val).to.be.true;
        });
    });

    it("should return it's a false difference on status NOT FOUND", async () => {
        axiosMock.onGet("http://localhost:3000/api/diff-validator")
        .reply(HttpStatus.NOT_FOUND, socketMessageFail);
        diffChecker.execute(fakeMessage, fakeSocket as unknown as io.Socket);

        return fakeSocket.waitForEmit().then(() => {
            // tslint:disable-next-line:no-any
            const val: boolean = (fakeSocket.messageIntercepted as WebsocketMessage<IDiffValidatorControllerResponse>).body.validDifference;

            return expect(val).to.be.false;
        });
    });
    // it("should throw if the point is out of bounds (y < 0)", async () => {
    //     return diffValidatorService.getDifferenceCluster("game", {x: 0, y: -1})
    //         .catch((reason: Error) => {
    //             expect(reason.message).to.equal(INVALID_POINT_ERROR_MESSAGE);
    //         });
    // });
    // it("should throw if the specified gameName is not valid", async () => {
    //     axiosMock.onGet("http://localhost:3000/api/data-base/games/simple/notAValidGame")
    //         .reply(HttpStatus.NOT_FOUND, {message: NON_EXISTING_GAME_ERROR_MESSAGE});

    //     return diffValidatorService.getDifferenceCluster("notAValidGame", ORIGIN)
    //         .catch((reason: Error) => {
    //             expect(reason.message).to.equal(NON_EXISTING_GAME_ERROR_MESSAGE);
    //         });
    // });
    // it("should return an empty list when the point is not part of a difference group", async () => {
    //     axiosMock.onGet("http://localhost:3000/api/data-base/games/simple/game")
    //         .reply(HttpStatus.OK, mockedSimpleGame);

    //     return diffValidatorService.getDifferenceCluster("game", {x: 42, y: 42})
    //         .catch((error: Error) => {
    //             expect(error.message).to.eql(NO_DIFFERENCE_AT_POINT_ERROR_MESSAGE);
    //         });
    // });
    // it("should return a difference group", async () => {
    //     axiosMock.onGet("http://localhost:3000/api/data-base/games/simple/game")
    //         .reply(HttpStatus.OK, mockedSimpleGame);

    //     return diffValidatorService.getDifferenceCluster("game", {x: 0, y: 0})
    //         .then((value: DifferenceCluster) => {
    //             return expect(value).to.eql(mockedSimpleGame.diffData[0]);
    //         });
    // });
});
