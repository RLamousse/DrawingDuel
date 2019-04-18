import {Injectable, OnDestroy} from "@angular/core";
import {Observable, Subject, Subscription} from "rxjs";
import {
  createWebsocketMessage,
  RoomInteractionErrorMessage,
  RoomInteractionMessage,
  WebsocketMessage
} from "../../../../common/communication/messages/message";
import {SocketEvent} from "../../../../common/communication/socket-events";
import {AbstractServiceError, AlreadyFoundDifferenceError, NoDifferenceAtPointError} from "../../../../common/errors/services.errors";
import {IVector3} from "../../../../common/model/point";
import {
  IFreeGameInteractionData,
  IFreeGameInteractionResponse,
} from "../../../../common/model/rooms/interaction";
import {SocketService} from "../socket.service";
import {UNListService} from "../username.service";

@Injectable({providedIn: "root"})
export class SceneDiffValidatorService implements OnDestroy {

  private successSubscription: Subscription;
  private errorSubscription: Subscription;
  private differenceCountSubject: Subject<boolean> = new Subject();

  private successCallback: (interactionResponse: IFreeGameInteractionResponse) => void;
  private errorCallback: (error: Error) => void;

  public constructor(private socket: SocketService) {
    this.successSubscription = this.socket.onEvent<IFreeGameInteractionResponse>(SocketEvent.INTERACT)
      .subscribe(async (message: WebsocketMessage<IFreeGameInteractionResponse>) => {
        this.differenceCountSubject.next(message.body.initiatedBy === UNListService.username);
        this.successCallback(message.body);
      });

    this.errorSubscription = this.socket.onEvent<string>(SocketEvent.INTERACT_ERROR)
      .subscribe((message: WebsocketMessage<string>) => {
        const errorMessage: string = message.body;
        if (errorMessage === AlreadyFoundDifferenceError.ALREADY_FOUND_DIFFERENCE_ERROR_MESSAGE ||
          errorMessage === NoDifferenceAtPointError.NO_DIFFERENCE_AT_POINT_ERROR_MESSAGE) {
          return this.errorCallback(new NoDifferenceAtPointError());
        }

        this.errorCallback(new AbstractServiceError(errorMessage));
      });

    this.successCallback = () => {/*We need those to be non-undefined*/
    };
    this.errorCallback = () => {/*We need those to be non-undefined*/
    };

  }

  public validateDiffObject(objectPosition: IVector3): void {
    this.socket.send(
      SocketEvent.INTERACT,
      createWebsocketMessage<RoomInteractionMessage<IFreeGameInteractionData>>(
        {
          interactionData: {
            coord: objectPosition,
          },
        }),
    );
  }

  public notifyIdentificationError(error: Error): void {
    this.socket.send(
      SocketEvent.INTERACT_ERROR,
      createWebsocketMessage<RoomInteractionErrorMessage>(
        {
          errorMessage: error.message,
        }),
    );
  }

  public registerDifferenceSuccessCallback(callback: (interactionResponse: IFreeGameInteractionResponse) => void): void {
    this.successCallback = callback;
  }

  public registerDifferenceErrorCallback(callback: (error: Error) => void): void {
    this.errorCallback = callback;
  }

  public ngOnDestroy(): void {
    this.successSubscription.unsubscribe();
    this.errorSubscription.unsubscribe();
  }

  public get foundDifferenceCount(): Observable<boolean> {
    return this.differenceCountSubject;
  }
}
