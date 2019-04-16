import {Injectable} from "@angular/core";
import {Subscription} from "rxjs";
import {createWebsocketMessage, RoomInteractionMessage, WebsocketMessage} from "../../../../common/communication/messages/message";
import {SocketEvent} from "../../../../common/communication/socket-events";
import {AbstractServiceError, AlreadyFoundDifferenceError, NoDifferenceAtPointError} from "../../../../common/errors/services.errors";
import {IJson3DObject} from "../../../../common/free-game-json-interface/JSONInterface/IScenesJSON";
import {IVector3} from "../../../../common/model/point";
import {IFreeGameInteractionData, IFreeGameInteractionResponse} from "../../../../common/model/rooms/interaction";
import {SocketService} from "../socket.service";

@Injectable({providedIn: "root"})
export class SceneDiffValidator {

  public constructor(private socket: SocketService) {
  }

  public async validateDiffObject(objectPosition: IVector3): Promise<IJson3DObject> {
    const promise: Promise<IJson3DObject> = this.initPromise();
    this.interactWithRoom(objectPosition);

    return promise;
  }

  private initPromise(): Promise<IJson3DObject> {
    return new Promise<IJson3DObject>((resolve, reject) => {

      const successSubscription: Subscription = this.socket.onEvent<IFreeGameInteractionResponse>(SocketEvent.INTERACT)
        .subscribe(async (message: WebsocketMessage<IFreeGameInteractionResponse>) => {

          successSubscription.unsubscribe();
          resolve(message.body.object);
        });

      const errorSubscription: Subscription = this.socket.onEvent<string>(SocketEvent.INTERACT_ERROR)
        .subscribe((message: WebsocketMessage<string>) => {

          errorSubscription.unsubscribe();

          const errorMessage: string = message.body;
          if (errorMessage === AlreadyFoundDifferenceError.ALREADY_FOUND_DIFFERENCE_ERROR_MESSAGE ||
            errorMessage === NoDifferenceAtPointError.NO_DIFFERENCE_AT_POINT_ERROR_MESSAGE) {
            reject(new NoDifferenceAtPointError());
          }

          reject(new AbstractServiceError(errorMessage));
        });
    });
  }

  private interactWithRoom(objectPosition: IVector3): void {
    this.socket.send(
      SocketEvent.INTERACT,
      createWebsocketMessage<RoomInteractionMessage<IFreeGameInteractionData>>(
        {
          interactionData: {
            coord: objectPosition,
          },
        }));
  }
}
