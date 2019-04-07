import {Injectable} from "@angular/core";
import {
  createWebsocketMessage,
  PlayerCountMessage,
  RoomCheckInMessage,
  RoomCreationMessage,
  WebsocketMessage
} from "../../../common/communication/messages/message";
import {SocketEvent} from "../../../common/communication/socket-events";
import {IRoomInfo} from "../../../common/model/rooms/room-info";
import {SocketService} from "./socket.service";
import {UNListService} from "./username.service";
import {Subscription} from "rxjs";

@Injectable({
              providedIn: "root",
})
export class RoomService {

  private roomWatchers: ((value: IRoomInfo[]) => void)[];
  private _rooms: IRoomInfo[];

  public constructor(private socket: SocketService) {
    this.roomWatchers = [];
    this._rooms = [];
    this.handleFetchRooms = this.handleFetchRooms.bind(this);
    this.triggerFetchRooms();
    this.listenToRoomPush();
  }

  private handleFetchRooms (message: WebsocketMessage<IRoomInfo[]>): void {
    this._rooms = message.body;
    this.notifyWatchers();
  }

  private notifyWatchers (): void {
    this.roomWatchers.forEach((fn) => fn(this._rooms));
  }

  public subscribeToFetchRooms (callback: (value: IRoomInfo[]) => void): void {
    this.roomWatchers.push(callback);
    callback(this._rooms);
  }

  private triggerFetchRooms (): void {
    this.socket.onEvent<IRoomInfo[]>(SocketEvent.FETCH).subscribe(this.handleFetchRooms);
    this.socket.send(SocketEvent.FETCH, createWebsocketMessage());
  }

  private listenToRoomPush (): void {
    this.socket.onEvent<IRoomInfo[]>(SocketEvent.PUSH_ROOMS).subscribe(this.handleFetchRooms);
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

  public checkOutRoom(): void {
    this.socket.send(SocketEvent.CHECK_OUT, createWebsocketMessage());
  }

  public unsubscribe(): void {
    this._rooms.length = 0;
  }

  public signalReady(): void {
    this.socket.send(SocketEvent.READY, createWebsocketMessage());
  }

  public subscribeToGameStart(callback: () => void): Subscription {
    return this.socket.onEvent(SocketEvent.READY).subscribe(callback);
  }
}
