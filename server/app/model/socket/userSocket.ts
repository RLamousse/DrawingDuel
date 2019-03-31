import { Socket } from "socket.io";

export interface UserSocket {
    socket: Socket;
    username: string;
    roomID: string;
}