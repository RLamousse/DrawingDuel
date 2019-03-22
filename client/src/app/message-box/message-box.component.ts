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
  }

  public ngOnInit(): void {
    this.socket.onEvent(SocketEvent.CHAT).subscribe(this.handleChatEvent);
    this.socket.onEvent(SocketEvent.USER_CONNECTION).subscribe(this.handleChatEvent);
    this.socket.onEvent(SocketEvent.USER_DISCONNECTION).subscribe(this.handleChatEvent);
  }

  private handleChatEvent (message: WebsocketMessage<string>): void {
    this.messages.push(message);
  }
}
