import {injectable} from "inversify";
import {Server} from "socket.io";
import {SocketEvent} from "../../../../common/communication/socket-events";

@injectable()
export class RadioTowerService {

    public server: Server;

    public broadcast<T>(event: SocketEvent, args: T): void {
        this.server.sockets.emit(event, args);
    }

    public sendToRoom<T>(event: SocketEvent, args: T, roomId: string): void {
        this.server.in(roomId).emit(event, args);
    }

    public privateSend<T>(event: SocketEvent, args: T, socketId: string): void {
        this.server.to(socketId).emit(event, args);
    }
}
