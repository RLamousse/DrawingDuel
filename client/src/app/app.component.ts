import { Component, OnInit } from "@angular/core";
import { SocketService } from "./socket.service";
import { SocketEvent } from "../../../common/communication/socket-events";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent implements OnInit {
  public readonly title: string = "LOG2990";

  private socket: SocketIOClient.Socket;

  public constructor(private socketService: SocketService) { }

  public ngOnInit(): void {
      this.connectSocket();
  }

  public connectSocket(): void {
    this.socket = this.socketService.openSocket();
    this.socket.on("connect", () => {
        this.socket.on(SocketEvent.WELCOME, (data: Object) => {
            console.log(data);
        });
    });
}
}
