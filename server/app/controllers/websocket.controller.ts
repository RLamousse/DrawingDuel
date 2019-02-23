import { inject, injectable } from "inversify";
import * as io from "socket.io";
import { isAWebsocketMessage, WebsocketMessage } from "../../../common/communication/messages/message";
import { SocketEvent } from "../../../common/communication/socket-events";
import IllegalArgumentError from "../../../common/errors/illegal-argument-error";
import { DummyWebsocketActionService } from "../services/websocket/dummy-websocket-action.service";
import { WebsocketActionService } from "../services/websocket/websocket-action.service";
import types from "../types";

@injectable()
export class WebsocketController {

    private actions: Map<SocketEvent, WebsocketActionService[]>;

    public constructor (@inject(types.DummyWebsocketActionService) private dummyAction: DummyWebsocketActionService) {
        this.registerSocket = this.registerSocket.bind(this);
        this.initSocket = this.initSocket.bind(this);
        this.handleMessage = this.handleMessage.bind(this);
        this.actions = new Map();
    }

    public registerSocket(socket: io.Socket): void {
        this.initSocket(socket);
    }

    private initSocket(socket: io.Socket): void {
        socket.on("message", (message: string) => {
            this.handleMessage (message, socket);
        });
        socket.on(SocketEvent.DUMMY, (message: WebsocketMessage) => {
            this.dummyAction.execute(message, socket);
        });
        socket.emit(SocketEvent.WELCOME, "Connection has been made via a websocket");
    }

    private handleMessage(paquet: string, socket: io.Socket): void {
        const message: WebsocketMessage | undefined = this.transformPaquet(paquet);
        if (!message) {
            throw new IllegalArgumentError("Message is not the right format");
        }
        const actionService: WebsocketActionService[] | undefined = this.actions.get(message.title);
        if (actionService) {
            actionService.forEach((action: WebsocketActionService) => action.execute(message, socket));
        }
    }

    private transformPaquet (paquet: string): WebsocketMessage | undefined {
        /**
         * When we parse with JSON.parse, we don't know the type.
         */
        // tslint:disable-next-line:no-any
        const message: any = JSON.parse(paquet);

        return isAWebsocketMessage(message) ? message : undefined;
    }
}
