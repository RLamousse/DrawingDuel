import {Injectable} from "@angular/core";
import {createWebsocketMessage, WebsocketMessage} from "../../../../../common/communication/messages/message";
import {SocketEvent} from "../../../../../common/communication/socket-events";
import {IRoomInfo} from "../../../../../common/model/rooms/room-info";
import {SocketService} from "../../socket.service";

@Injectable({
              providedIn: "root",
})
export class RoomService {

  public constructor(private socket: SocketService) {
  }

  public fetchRooms (gameName: string, callback: (value: boolean) => void): void {
    this.socket.onEvent<IRoomInfo[]>(SocketEvent.FETCH).subscribe((message: WebsocketMessage<IRoomInfo[]>) => {
      this.handleRoomAvailability(message, gameName, callback);
    });
    this.socket.send(SocketEvent.FETCH, createWebsocketMessage());
  }

  private handleRoomAvailability = (value: WebsocketMessage<IRoomInfo[]>, gameName: string, callback: (value: boolean) => void) => {
    const availableRoom: IRoomInfo | undefined = value.body.find((x) => x.gameName === gameName && x.vacant);
    callback(!!availableRoom);
  }
}
