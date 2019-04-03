import {Injectable} from "@angular/core";
import {
  createWebsocketMessage, PlayerCountMessage, RoomCheckInMessage,
  RoomCreationMessage, RoomMessage,
  WebsocketMessage
} from "../../../../../common/communication/messages/message";
import {SocketEvent} from "../../../../../common/communication/socket-events";
import {IRoomInfo} from "../../../../../common/model/rooms/room-info";
import {SocketService} from "../../socket.service";
import {UNListService} from "../../username.service";

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

  private handleRoomAvailability(value: WebsocketMessage<IRoomInfo[]>, gameName: string, callback: (value: boolean) => void): void {
    const availableRoom: IRoomInfo | undefined = value.body.find((x) => x.gameName === gameName && x.vacant);
    callback(!!availableRoom);
  }

  public createRoom(gameName: string, playerCount: PlayerCountMessage): void {
    this.socket.send(SocketEvent.CREATE, createWebsocketMessage<RoomCreationMessage>({
      gameName,
      playerCount,
      username: UNListService.username,
    }));
  }

  public checkInRoom(gameName: string): void {
    this.socket.send(SocketEvent.CHECK_IN, createWebsocketMessage<RoomCheckInMessage>({
      gameName,
      username: UNListService.username,
    }));
  }

  public checkOutRoom(gameName: string): void {
    this.socket.send(SocketEvent.CHECK_OUT, createWebsocketMessage<RoomMessage>({
      gameName,
    }));
  }
}
