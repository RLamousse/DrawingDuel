import {Injectable} from "@angular/core";
import {Observable, Subject, Subscription} from "rxjs";
import {createWebsocketMessage, WebsocketMessage} from "../../../../common/communication/messages/message";
import {SocketEvent} from "../../../../common/communication/socket-events";
import {IPoint} from "../../../../common/model/point";
import {ISimpleGameInteractionData, ISimpleGameInteractionResponse} from "../../../../common/model/rooms/interaction";
import {SocketService} from "../socket.service";

@Injectable({
              providedIn: "root",
            })
export class SimpleGameService {

  private _differenceCountSubject: Subject<number> = new Subject();

  public constructor(private socket: SocketService) {}

  public get foundDifferencesCount(): Observable<number> {
    return this._differenceCountSubject;
  }

  public resetDifferenceCount(): void {
    this._differenceCountSubject = new Subject();
  }

  public registerDifferenceCallback(callback: (message: ISimpleGameInteractionResponse | string) => void): Subscription {
    return this.socket.onEvent<ISimpleGameInteractionResponse | string>(SocketEvent.INTERACT)
      .subscribe((value: WebsocketMessage<ISimpleGameInteractionResponse | string>) => {
        callback(value.body);
    });
  }

  public validateDifferenceAtPoint(point: IPoint): void {
    this.socket.send(SocketEvent.INTERACT, createWebsocketMessage<ISimpleGameInteractionData>({
      coord: point,
    }));
  }

  public updateCounter(): void {
    this._differenceCountSubject.next();
  }
}
