import { injectable } from "inversify";
import * as io from "socket.io";
import { SocketEvent } from "../../../common/communication/socket-events";

@injectable()
export class WebsocketController {

    private sockets: io.Socket[];

    public registerSocket (socket: io.Socket): void {
        this.initSocket (socket);
        this.sockets.push(socket);
    }

    private initSocket (socket: io.Socket): void {
        socket.emit(SocketEvent.WELCOME, "Connection has been made via a websocket");
    }
}
