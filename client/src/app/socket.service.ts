import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { connect } from "socket.io-client";
import { environment } from "src/environments/environment";
import { WebsocketMessage } from "../../../common/communication/messages/message";
import { SocketEvent } from "../../../common/communication/socket-events";

@Injectable()
export class SocketService {

    private readonly BASE_URL: string = environment.production ? document.baseURI : "http://localhost:3000/";
    private socket: SocketIOClient.Socket;

    public constructor () {
        this.socket = this.openSocket();
    }

    private openSocket(): SocketIOClient.Socket {
        return connect(this.BASE_URL);
    }

    public send(event: SocketEvent, message: WebsocketMessage): void {
        this.socket.emit(event, message);
    }

    public onMessage(): Observable<WebsocketMessage> {
        return new Observable<WebsocketMessage>((observer) => {
            this.socket.on("message", (data: WebsocketMessage) => observer.next(data));
        });
    }

    public onEvent(event: SocketEvent): Observable<WebsocketMessage> {
        return new Observable<WebsocketMessage>((observer) => {
            this.socket.on(event, (message: WebsocketMessage) => observer.next(message));
        });
    }
}
