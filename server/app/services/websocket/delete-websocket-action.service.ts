import { injectable } from "inversify";
import * as io from "socket.io";
import { WebsocketMessage } from "../../../../common/communication/messages/message";
import { SocketEvent } from "../../../../common/communication/socket-events";
import { WebsocketActionService } from "./websocket-action.service";

@injectable()
export class DeleteWebsocketActionService extends WebsocketActionService {

    public execute(data: WebsocketMessage, socket: io.Socket): void {
        socket.broadcast.emit(SocketEvent.DELETE, data);
    }
}
