import { injectable } from "inversify";
import * as io from "socket.io";
import { WebsocketMessage } from "../../../../common/communication/messages/message";
import { SocketEvent } from "../../../../common/communication/socket-events";
import { WebsocketActionService } from "./websocket-action.service";

/**
 * This is supposed to be an example/test socket service
 * (as can be deducted from the very static message it answers with)
 */
@injectable()
export class DummyWebsocketActionService extends WebsocketActionService {

    private readonly _EVENT_TYPE: SocketEvent = SocketEvent.DUMMY;

    public execute(data: WebsocketMessage, socket: io.Socket): void {
        socket.emit(this._EVENT_TYPE, "Thank you Kanye, very cool 👍");
    }
}
