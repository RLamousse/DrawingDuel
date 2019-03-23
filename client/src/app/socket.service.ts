import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { connect } from "socket.io-client";
import { WebsocketMessage } from "../../../common/communication/messages/message";
import { SERVER_BASE_URL } from "../../../common/communication/routes";
import { SocketEvent } from "../../../common/communication/socket-events";

@Injectable()
export class SocketService {

  private socket: SocketIOClient.Socket;

  public constructor() {
    this.socket = this.openSocket();
  }

  public isSocketConnected(): boolean {
    return this.socket.connected;
  }

  private openSocket(): SocketIOClient.Socket {
    return connect(SERVER_BASE_URL);
  }

  public send(event: SocketEvent, message: WebsocketMessage): boolean {
    if (this.isSocketConnected()) {
      this.socket.emit(event, message);

      return true;
    }

    return false;
  }

  public onEvent<t = Object>(event: SocketEvent): Observable<WebsocketMessage<t>> {
    return new Observable<WebsocketMessage<t>>((observer) => {
      this.socket.on(event, (message: WebsocketMessage<t>) => observer.next(message));
    });
  }
}
