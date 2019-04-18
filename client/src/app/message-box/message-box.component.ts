import {Component, OnDestroy, OnInit} from "@angular/core";
import {Subscription} from "rxjs";
import { WebsocketMessage } from "../../../../common/communication/messages/message";
import { SocketEvent } from "../../../../common/communication/socket-events";
import { SocketService } from "../socket.service";

@Component({
  selector: "app-message-box",
  templateUrl: "./message-box.component.html",
  styleUrls: ["./message-box.component.css"],
})
export class MessageBoxComponent implements OnInit, OnDestroy {

  private messages: WebsocketMessage<string>[];
  private subscriptions: Subscription[];

  public constructor(private socket: SocketService) {
    this.messages = [];
    this.subscriptions = [];
    this.handleChatEvent = this.handleChatEvent.bind(this);
  }

  public ngOnInit(): void {
    this.subscriptions.push(this.socket.onEvent(SocketEvent.CHAT).subscribe(this.handleChatEvent));
    this.subscriptions.push(this.socket.onEvent(SocketEvent.USER_CONNECTION).subscribe(this.handleChatEvent));
    this.subscriptions.push(this.socket.onEvent(SocketEvent.USER_DISCONNECTION).subscribe(this.handleChatEvent));
  }

  private handleChatEvent (message: WebsocketMessage<string>): void {
    this.messages.push(message);
  }

  public ngOnDestroy(): void {
    this.subscriptions.forEach((elem: Subscription) => elem.unsubscribe());
  }
}
