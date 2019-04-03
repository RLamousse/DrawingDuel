import {Injectable} from '@angular/core';
import {SocketService} from "../../socket.service";
import {IRoomInfo} from "../../../../../common/model/rooms/room-info";
import {SocketEvent} from "../../../../../common/communication/socket-events";
import {WebsocketMessage} from "../../../../../common/communication/messages/message";

@Injectable({
  providedIn: 'root'
})
export class RoomService {

  constructor(private socket: SocketService) {
  }

  public fetchRooms (gameName: string, callback: (value: boolean) => void): void {
    this.socket.onEvent<IRoomInfo[]>(SocketEvent.FETCH).subscribe((message: WebsocketMessage<IRoomInfo[]>) => {
      this.handleRoomAvailability(message, gameName, callback);
    });
    this.socket.send(SocketEvent.FETCH, {title: SocketEvent.FETCH, body: ""});
  }

  private handleRoomAvailability(value: WebsocketMessage<IRoomInfo[]>, gameName: string,callback: (value: boolean) => void) {
    const availableRoom: IRoomInfo | undefined = value.body.find((value) => value.gameName === gameName && value.vacant);
    callback(!!availableRoom);
  }
}
