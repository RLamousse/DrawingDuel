import { Component, OnInit } from "@angular/core";
import { SocketEvent } from "../../../common/communication/socket-events";
import { SocketService } from "./socket.service";

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
    this.socket.on("connect", (something: string) => {
      console.log(something);
      this.socket.emit(SocketEvent.DUMMY, "Yo max");
      this.socket.on(SocketEvent.WELCOME, (data: Object) => {
        console.log(data);
      });
      this.socket.on(SocketEvent.DUMMY, (message: string) => {
        console.log(message);
      });
    });
  }
}
