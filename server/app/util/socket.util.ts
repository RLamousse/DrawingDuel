import {Socket} from "socket.io";
import {SocketEvent} from "../../../common/communication/socket-events";

export const sendToRoom: <T>(event: SocketEvent, args: T, roomId: string, socket: Socket) => void =
    <T>(event: SocketEvent, args: T, roomId: string, socket: Socket) => {
        socket.in(roomId).emit(event, args);
        socket.emit(event, args);
    };

export const broadcast: <T>(event: SocketEvent, args: T, socket: Socket) => void =
    <T>(event: SocketEvent, args: T, socket: Socket) => {
        socket.broadcast.emit(event, args);
        socket.emit(event, args);
    };
