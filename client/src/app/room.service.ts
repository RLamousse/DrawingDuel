import {Injectable, OnDestroy} from "@angular/core";
import {Subscription} from "rxjs";
import {
  createWebsocketMessage,
  RoomCheckInMessage,
  RoomCreationMessage,
  WebsocketMessage
} from "../../../common/communication/messages/message";
import {SocketEvent} from "../../../common/communication/socket-events";
import {OnlineType} from "../../../common/model/game/game";
import {IRoomInfo} from "../../../common/model/rooms/room-info";
import {SocketService} from "./socket.service";
import {UNListService} from "./username.service";
import {ReadyInfo} from "../../../common/model/rooms/ready-info";

@Injectable({
              providedIn: "root",
})
export class RoomService implements OnDestroy {

  private roomWatchers: ((value: IRoomInfo[]) => void)[];
  private _rooms: IRoomInfo[];
  private roomFetchSub: Subscription;
  private roomPushSub: Subscription;

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
    this.roomFetchSub = this.socket.onEvent<IRoomInfo[]>(SocketEvent.FETCH).subscribe(this.handleFetchRooms);
    this.socket.send(SocketEvent.FETCH, createWebsocketMessage());
  }

  private listenToRoomPush (): void {
    this.roomPushSub = this.socket.onEvent<IRoomInfo[]>(SocketEvent.PUSH_ROOMS).subscribe(this.handleFetchRooms);
  }

  public createRoom(gameName: string, playerCount: OnlineType): void {
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

  public subscribeToGameStart(callback: (info: ReadyInfo) => void): Subscription {
    return this.socket.onEvent<IRoomInfo>(SocketEvent.READY).subscribe((message: WebsocketMessage<IRoomInfo>) => callback(message.body));
  }

  public ngOnDestroy(): void {
    this.roomFetchSub.unsubscribe();
    this.roomPushSub.unsubscribe();
  }
}
