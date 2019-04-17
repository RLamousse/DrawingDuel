import {Injectable} from "@angular/core";
import {Observable, Subject, Subscription} from "rxjs";
import {
  createWebsocketMessage,
  RoomInteractionMessage,
  WebsocketMessage
} from "../../../../common/communication/messages/message";
import {SocketEvent} from "../../../../common/communication/socket-events";
import {IPoint} from "../../../../common/model/point";
import {ISimpleGameInteractionData, ISimpleGameInteractionResponse} from "../../../../common/model/rooms/interaction";
import {SocketService} from "../socket.service";

@Injectable({providedIn: "root"})
export class SimpleGameService {

  private _differenceCountSubject: Subject<boolean> = new Subject();

  public constructor(private socket: SocketService) {}

  public get foundDifferencesCount(): Observable<boolean> {
    return this._differenceCountSubject;
  }

  public resetDifferenceCount(): void {
    this._differenceCountSubject = new Subject();
  }

  public registerDifferenceSuccessCallback(callback: (message: ISimpleGameInteractionResponse) => void): Subscription {
    return this.socket.onEvent<ISimpleGameInteractionResponse>(SocketEvent.INTERACT)
      .subscribe((message: WebsocketMessage<ISimpleGameInteractionResponse>) => callback(message.body));
  }

  public registerDifferenceErrorCallback(callback: (message: string) => void): Subscription {
    return this.socket.onEvent<string>(SocketEvent.INTERACT_ERROR)
      .subscribe((message: WebsocketMessage<string>) => callback(message.body));
  }

  public validateDifferenceAtPoint(point: IPoint): void {
    const interactionMessage: RoomInteractionMessage<ISimpleGameInteractionData> = {
      interactionData: {
        coord: point,
      },
    };
    this.socket.send(SocketEvent.INTERACT, createWebsocketMessage<RoomInteractionMessage<ISimpleGameInteractionData>>(interactionMessage));
  }

  public updateCounter(isMe: boolean): void {
    this._differenceCountSubject.next(isMe);
  }
}
