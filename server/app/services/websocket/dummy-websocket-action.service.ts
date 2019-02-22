import { injectable } from "inversify";
import * as io from "socket.io";
import { SocketEvent } from "../../../../common/communication/socket-events";
import { WebsocketActionService } from "./websocket-action.service";

@injectable()
export class DummyWebsocketActionService extends WebsocketActionService {

    private readonly _EVENT_TYPE: SocketEvent = SocketEvent.DUMMY;

    public execute(data: string = "Don't care", socket: io.Socket): void {
        socket.emit(this._EVENT_TYPE, "Thank you Kanye, very cool 👍");
    }
}
