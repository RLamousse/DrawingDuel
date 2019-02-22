import { injectable } from "inversify";
import * as io from "socket.io";
/**
 * An action to be performed when a certain event is received by the Websocket
 */
@injectable()
export abstract class WebsocketActionService {
    public abstract execute (data: string, socket: io.Socket): void;
}
