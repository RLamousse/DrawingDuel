import { Component, OnInit } from "@angular/core";
import { WebsocketMessage } from "../../../../common/communication/messages/message";
import { SocketEvent } from "../../../../common/communication/socket-events";
import { SocketService } from "../socket.service";

@Component({
  selector: "app-message-box",
  templateUrl: "./message-box.component.html",
  styleUrls: ["./message-box.component.css"],
})
export class MessageBoxComponent implements OnInit {

  private messages: WebsocketMessage<string>[];

  public constructor(private socket: SocketService) {
    this.messages = [];
    this.handleChatEvent = this.handleChatEvent.bind(this);
    this.handleConnectionEvents = this.handleConnectionEvents.bind(this);
  }

  public ngOnInit(): void {
    this.socket.onEvent(SocketEvent.CHAT).subscribe(this.handleChatEvent);
    this.socket.onEvent(SocketEvent.USER_CONNECTION).subscribe(this.handleConnectionEvents);
    this.socket.onEvent(SocketEvent.USER_DISCONNECTION).subscribe(this.handleConnectionEvents);
  }

  private handleChatEvent (message: WebsocketMessage<string>): void {
    this.messages.push(message);
  }

  private handleConnectionEvents (message: WebsocketMessage<string>): void {
    this.messages.push(message);
  }

}
