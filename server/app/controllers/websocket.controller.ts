import { inject, injectable } from "inversify";
import * as io from "socket.io";
import {WebsocketMessage} from "../../../common/communication/messages/message";
import {SocketEvent} from "../../../common/communication/socket-events";
import {GameRoomService} from "../services/game-room.service";
import {DummyWebsocketActionService} from "../services/websocket/dummy-websocket-action.service";
import types from "../types";

@injectable()
export class WebsocketController {

    public constructor(@inject(types.DummyWebsocketActionService) private dummyAction: DummyWebsocketActionService,
                       @inject(types.GameRoomService) private gameRoomService: GameRoomService) {
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

        // Rooms
        socket.on(SocketEvent.SOLO_ROOM_CREATE, (message: WebsocketMessage<RoomCreationMessage>) => {
            gameRoomService.createRoom();
        });
        socket.on(SocketEvent.MULTI_ROOM_CREATE, (message: WebsocketMessage<GameCreationMessage>) => {

        });
        socket.on(SocketEvent.ROOM_JOIN, (message: WebsocketMessage<GameCreationMessage>) => {

        });
        socket.on(SocketEvent.ROOM_ACTION, (message: WebsocketMessage<GameCreationMessage>) => {

        });
        socket.on(SocketEvent.ROOM_LEAVE, (message: WebsocketMessage<GameCreationMessage>) => {

        });
        socket.emit(SocketEvent.WELCOME, "Connection has been made via a websocket");
    }
}
