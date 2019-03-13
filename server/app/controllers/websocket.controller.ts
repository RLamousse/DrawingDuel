import { inject, injectable } from "inversify";
import * as io from "socket.io";
import { ChatMessage, WebsocketMessage } from "../../../common/communication/messages/message";
import { SocketEvent } from "../../../common/communication/socket-events";
import { ChatWebsocketActionService } from "../services/websocket/chat-websocket-action.service";
import { CheckUserWebsocketActionService } from "../services/websocket/check-user-websocket-action.service";
import { DummyWebsocketActionService } from "../services/websocket/dummy-websocket-action.service";
import types from "../types";

@injectable()
export class WebsocketController {

    private sockets: Map<string, string>;

    public constructor (@inject(types.DummyWebsocketActionService) private dummyAction: DummyWebsocketActionService,
                        @inject(types.ChatWebsocketActionService) private chatAction: ChatWebsocketActionService,
                        @inject(types.CheckUserWebsocketActionService) private userNameService: CheckUserWebsocketActionService) {
        this.sockets = new Map();
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
        socket.on(SocketEvent.CHAT, (message: WebsocketMessage<ChatMessage>) => {
            this.chatAction.execute(message, socket);
        });
        socket.on("disconnect", () => {
            this.userDisconnectionRoutine(socket);
        });
        socket.on(SocketEvent.USERNAME_CHECK, (message: WebsocketMessage<string>) => {
            const username: string = this.userNameService.execute(message, socket);
            this.userConnectionRoutine(username, socket);
        });
        socket.emit(SocketEvent.WELCOME, "Connection has been made via a websocket");
    }

    private userDisconnectionRoutine(socket: io.Socket): void {
        const username: string | undefined = this.sockets.get(socket.id);
        if (this.sockets.has(socket.id)) {
            this.userNameService.removeUsername(username as string);
            const message: WebsocketMessage<string> = {
                title: SocketEvent.USER_CONNECTION,
                body: this.chatAction.getDisconnectionMessage(username as string),
            };
            socket.broadcast.emit(SocketEvent.USER_DISCONNECTION, message);
        }
    }

    private userConnectionRoutine(username: string, socket: io.Socket): void {
        if (username) {
            this.sockets.set(socket.id, username);
            const message: WebsocketMessage<string> = {
                title: SocketEvent.USER_CONNECTION,
                body: this.chatAction.getConnectionMessage(username),
            };
            socket.broadcast.emit(SocketEvent.USER_CONNECTION, message);
        }
    }
}
