import { injectable } from "inversify";
import * as io from "socket.io";
import { isAWebsocketMessage, WebsocketMessage } from "../../../common/communication/messages/message";
import { SocketEvent } from "../../../common/communication/socket-events";
import IllegalArgumentError from "../../../common/errors/illegal-argument-error";
import { WebsocketActionService } from "../services/abs-websocket-action-service";

@injectable()
export class WebsocketController {

    private sockets: Map<string, io.Socket>;
    private actions: Map<SocketEvent, WebsocketActionService>;

    public constructor () {
        this.registerSocket = this.registerSocket.bind(this);
        this.initSocket = this.initSocket.bind(this);
        this.handleMessage = this.handleMessage.bind(this);
        this.sockets = new Map();
        this.actions = new Map();
    }

    public registerSocket(socket: io.Socket): void {
        this.initSocket(socket);
        this.sockets.set(socket.id, socket);
    }

    private initSocket(socket: io.Socket): void {
        socket.on("message", this.handleMessage);
        socket.emit(SocketEvent.WELCOME, "Connection has been made via a websocket");
    }

    private handleMessage(id: string, paquet: string): void {
        const message: WebsocketMessage | undefined = this.transformPaquet(paquet);
        if (!message) {
            throw new IllegalArgumentError("Message is not the right format");
        }
        const actionService: WebsocketActionService | undefined = this.actions.get(message.title);
        if (actionService) {
            actionService.execute(message.body);
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
