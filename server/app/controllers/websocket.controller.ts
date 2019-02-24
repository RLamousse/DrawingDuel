import { inject, injectable } from "inversify";
import * as io from "socket.io";
import { WebsocketMessage } from "../../../common/communication/messages/message";
import { SocketEvent } from "../../../common/communication/socket-events";
import { DummyWebsocketActionService } from "../services/websocket/dummy-websocket-action.service";
import types from "../types";

@injectable()
export class WebsocketController {

    public constructor (@inject(types.DummyWebsocketActionService) private dummyAction: DummyWebsocketActionService) {
        this.registerSocket = this.registerSocket.bind(this);
        this.routeSocket = this.routeSocket.bind(this);
    }

    public registerSocket(socket: io.Socket): void {
        this.routeSocket(socket);
    }

    private routeSocket(socket: io.Socket): void {
        socket.on(SocketEvent.DUMMY, (message: WebsocketMessage) => {
            this.dummyAction.execute(message, socket);
        });
        socket.emit(SocketEvent.WELCOME, "Connection has been made via a websocket");
    }
}
