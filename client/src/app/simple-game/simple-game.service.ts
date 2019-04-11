import {Injectable} from "@angular/core";
import Axios, {AxiosResponse} from "axios";
import {Observable, Subject, Subscription} from "rxjs";
import {createWebsocketMessage, WebsocketMessage} from "../../../../common/communication/messages/message";
import {GAME_MANAGER_SIMPLE, SERVER_BASE_URL} from "../../../../common/communication/routes";
import {SocketEvent} from "../../../../common/communication/socket-events";
import {NonExistentGameError} from "../../../../common/errors/database.errors";
// import {AlreadyFoundDifferenceError, NoDifferenceAtPointError} from "../../../../common/errors/services.errors";
// import {ISimpleGameState} from "../../../../common/model/game/game-state";
import {
  // DIFFERENCE_CLUSTER_POINTS_INDEX,
  ISimpleGame
} from "../../../../common/model/game/simple-game";
import {IPoint} from "../../../../common/model/point";
import {ISimpleGameInteractionData, ISimpleGameInteractionResponse} from "../../../../common/model/rooms/interaction";
import {SocketService} from "../socket.service";

@Injectable({
              providedIn: "root",
            })
export class SimpleGameService {

  // private _game: ISimpleGame;
  // private _gameState: ISimpleGameState;
  private _gameName: string;
  private _differenceCountSubject: Subject<number> = new Subject();

  public constructor(private socket: SocketService) {
    // this._gameState = {
    //   foundDifferenceClusters: [],
    // };
  }

  public set gameName(value: string) {
    this._gameName = value;

    this.getGame()
      .then((game: ISimpleGame) => {
        // this._game = game;
      })
      .catch((error: Error) => {
        throw error;
      });

    // this._gameState = {
    //   foundDifferenceClusters: [],
    // };
  }

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

  // public async validateDifferenceAtPoint(point: IPoint): Promise<DifferenceCluster> {
  //   this.assertAlreadyFoundDifference(point);
  //
  //   return Axios.get(
  //     SERVER_BASE_URL + DIFF_VALIDATOR_BASE,
  //     {
  //       params: {
  //         coordX: point.x,
  //         coordY: point.y,
  //         gameName: this._gameName,
  //       } as IDiffValidatorControllerRequest,
  //     })
  //     .then(() => {
  //       playRandomSound(FOUND_DIFFERENCE_SOUNDS);
  //
  //       return this.updateGameState(point);
  //     })
  //     // tslint:disable-next-line:no-any Generic error response
  //     .catch((reason: any) => {
  //       if (reason.response && reason.response.status === Httpstatus.NOT_FOUND) {
  //         throw new NoDifferenceAtPointError();
  //       }
  //
  //       throw new AbstractServiceError(reason.message);
  //     });
  // }

  // private assertAlreadyFoundDifference(point: IPoint): void {
  //   if (this.wasDifferenceFound(point)) {
  //     throw new AlreadyFoundDifferenceError();
  //   }
  // }

  // private wasDifferenceFound(point: IPoint): boolean {
  //   return this._gameState.foundDifferenceClusters
  //     .some((cluster: DifferenceCluster) =>
  //             cluster[DIFFERENCE_CLUSTER_POINTS_INDEX]
  //               .some((p: IPoint) => p.x === point.x && p.y === point.y));
  // }

  private async getGame(): Promise<ISimpleGame> {
    return Axios.get<ISimpleGame>(SERVER_BASE_URL + GAME_MANAGER_SIMPLE + this._gameName)
      .then((value: AxiosResponse<ISimpleGame>) => value.data)
      // tslint:disable-next-line:no-any Since Axios defines reason as `any`
      .catch(() => {
        throw new NonExistentGameError();
      });
  }

  // private updateGameState(clickedPoint: IPoint): DifferenceCluster {
  //   const differenceCluster: DifferenceCluster | undefined = this._game.diffData
  //     .find((cluster: DifferenceCluster) =>
  //             cluster[DIFFERENCE_CLUSTER_POINTS_INDEX]
  //               .some((point: IPoint) => point.x === clickedPoint.x && point.y === clickedPoint.y));
  //
  //   if (differenceCluster === undefined) {
  //     throw new NoDifferenceAtPointError();
  //   }
  //
  //   this._gameState.foundDifferenceClusters.push(differenceCluster);
  //   this._differenceCountSubject.next(this._gameState.foundDifferenceClusters.length);
  //
  //   return differenceCluster;
  // }

}
