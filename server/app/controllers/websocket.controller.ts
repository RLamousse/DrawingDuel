import {format} from "date-and-time";
import {inject, injectable} from "inversify";
import {Socket} from "socket.io";
import {
    createWebsocketMessage, ChatMessage, RoomCreationMessage,
    RoomMessage,
    UpdateScoreMessage,
    WebsocketMessage
} from "../../../common/communication/messages/message";
import {SocketEvent} from "../../../common/communication/socket-events";
import {IRoomInfo} from "../../../common/model/rooms/room-info";
import {ChatWebsocketActionService} from "../services/websocket/chat-websocket-action.service";
import {CheckUserWebsocketActionService} from "../services/websocket/check-user-websocket-action.service";
import {DeleteWebsocketActionService} from "../services/websocket/delete-websocket-action.service";
import {DummyWebsocketActionService} from "../services/websocket/dummy-websocket-action.service";
import {RadioTowerService} from "../services/websocket/radio-tower.service";
import {HotelRoomService} from "../services/websocket/rooms/hotel-room.service";
import {UpdateGameScoresWebsocketActionService} from "../services/websocket/update-game-scores-websocket-action.service";
import types from "../types";

@injectable()
export class WebsocketController {

    private sockets: Map<string, string>;

    public constructor (@inject(types.DummyWebsocketActionService) private dummyAction: DummyWebsocketActionService,
                        @inject(types.ChatWebsocketActionService) private chatAction: ChatWebsocketActionService,
                        @inject(types.UpdateGameScoresWebsocketActionService)
                        private scoreUpdateAction: UpdateGameScoresWebsocketActionService,
                        @inject(types.CheckUserWebsocketActionService) private userNameService: CheckUserWebsocketActionService,
                        @inject(types.DeleteWebsocketActionService) private deleteAction: DeleteWebsocketActionService,
                        @inject(types.HotelRoomService) private hotelRoomService: HotelRoomService,
                        @inject(types.RadioTowerService) private radioTower: RadioTowerService,
    ) {
        this.sockets = new Map();
        this.registerSocket = this.registerSocket.bind(this);
        this.routeSocket = this.routeSocket.bind(this);
    }

    public registerSocket(socket: Socket): Socket {
        this.routeSocket(socket);

        return socket;
    }

    private routeSocket(socket: Socket): void {
        socket.on(SocketEvent.DUMMY, (message: WebsocketMessage) => {
            this.dummyAction.execute(message, socket);
        });
        socket.on(SocketEvent.UPDATE_SCORE, async (message: WebsocketMessage<UpdateScoreMessage>) => {
            await this.scoreUpdateAction.execute(message, socket);
        });
        socket.on(SocketEvent.CHAT, (message: WebsocketMessage<ChatMessage>) => {
            this.chatAction.execute(message, socket);
        });
        socket.on(SocketEvent.DISCONNECT, () => {
            this.userDisconnectionRoutine(socket);
        });
        socket.on(SocketEvent.USERNAME_CHECK, (message: WebsocketMessage<string>) => {
            const username: string = this.userNameService.execute(message, socket);
            this.userConnectionRoutine(username, socket);
        });
        socket.on(SocketEvent.DELETE, (message: WebsocketMessage) => {
           this.deleteAction.execute(message, socket);
        });

        this.configureRoomService(socket);

        socket.emit(SocketEvent.WELCOME, "Connection has been made via a websocket");
    }

    private configureRoomService(socket: Socket): void {
        socket.on(SocketEvent.CREATE, async (message: WebsocketMessage<RoomCreationMessage>) => {
            await this.hotelRoomService.createGameRoom(
                socket,
                message.body.gameName,
                message.body.playerCount,
            );
        });

        socket.on(SocketEvent.FETCH, () => {
            const response: WebsocketMessage<IRoomInfo[]> = createWebsocketMessage(this.hotelRoomService.fetchGameRooms());
            socket.emit(SocketEvent.FETCH, response);
        });

        socket.on(SocketEvent.CHECK_IN, (message: WebsocketMessage<RoomMessage>) => {
            this.hotelRoomService.checkInGameRoom(socket, message.body.gameName);
        });
    }

    private userDisconnectionRoutine(socket: Socket): void {
        const username: string | undefined = this.sockets.get(socket.id);
        if (this.sockets.has(socket.id)) {
            this.userNameService.removeUsername(username as string);
            this.sockets.delete(socket.id);
            const message: WebsocketMessage<string> = createWebsocketMessage(
                format(new Date(), "HH:mm:ss") + this.chatAction.getDisconnectionMessage(username as string),
            );
            this.radioTower.broadcast(SocketEvent.USER_DISCONNECTION, message);
        }
    }

    private userConnectionRoutine(username: string, socket: Socket): void {
        if (username) {
            this.sockets.set(socket.id, username);
            const message: WebsocketMessage<string> = createWebsocketMessage(
                format(new Date(), "HH:mm:ss") + this.chatAction.getConnectionMessage(username),
            );
            this.radioTower.broadcast(SocketEvent.USER_CONNECTION, message);
        }
    }
}
