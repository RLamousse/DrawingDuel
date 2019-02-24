import { injectable } from "inversify";
import * as io from "socket.io";
import { WebsocketMessage } from "../../../../common/communication/messages/message";
/**
 * An action to be performed when a certain event is received by the Websocket
 */
@injectable()
export abstract class WebsocketActionService {
    public abstract execute (data: WebsocketMessage, socket: io.Socket): void;
}
