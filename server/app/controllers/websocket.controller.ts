import { inject, injectable } from "inversify";
import * as io from "socket.io";
import { WebsocketMessage } from "../../../common/communication/messages/message";
import { SocketEvent } from "../../../common/communication/socket-events";
import { DeleteWebsocketActionService } from "../services/websocket/delete-websocket-action.service";
import { DummyWebsocketActionService } from "../services/websocket/dummy-websocket-action.service";
import types from "../types";

@injectable()
export class WebsocketController {

    public constructor (@inject(types.DummyWebsocketActionService) private dummyAction: DummyWebsocketActionService,
                        @inject(types.DeleteWebsocketActionService) private deleteAction: DeleteWebsocketActionService) {
        this.registerSocket = this.registerSocket.bind(this);
        this.routeSocket = this.routeSocket.bind(this);
    }

    public registerSocket(socket: io.Socket): io.Socket {
        this.routeSocket(socket);

        return socket;
    }

    private routeSocket(socket: io.Socket): void {
        socket.on(SocketEvent.DUMMY, (message: WebsocketMessage) => {
            this.dummyAction.execute(message, socket);
        });
        socket.on(SocketEvent.DELETE, (message: WebsocketMessage) => {
           this.deleteAction.execute(message, socket);
        });
        socket.emit(SocketEvent.WELCOME, "Connection has been made via a websocket");
    }
}
