import {Component, OnDestroy, OnInit} from "@angular/core";
import {MatDialog} from "@angular/material";
import {ActivatedRoute, Router} from "@angular/router";
import {Subscription} from "rxjs";
import {WebsocketMessage} from "../../../../common/communication/messages/message";
import {GAMES_ROUTE, PLAY_3D_ROUTE, PLAY_ROUTE} from "../../../../common/communication/routes";
import {SocketEvent} from "../../../../common/communication/socket-events";
import {ComponentNavigationError} from "../../../../common/errors/component.errors";
import {GameType, OnlineType} from "../../../../common/model/game/game";
import {SimpleReadyInfo} from "../../../../common/model/rooms/ready-info";
import {openDialog} from "../dialog-utils";
import {RoomService} from "../room.service";
import {SocketService} from "../socket.service";
import {GameDeletionNotifComponent} from "./game-deletion-notif/game-deletion-notif.component";

@Component({
  selector: "app-await-view",
  templateUrl: "./await-view.component.html",
  styleUrls: ["./await-view.component.css"],
})
export class AwaitViewComponent implements OnInit, OnDestroy {

  protected gameName: string;
  protected gameType: GameType;
  protected readonly indexString: number = 0;

  private gameStartSub: Subscription;
  private gameDeletionSub: Subscription;

  public constructor(private activatedRoute: ActivatedRoute, private route: Router,
                     private socket: SocketService, private dialog: MatDialog,
                     private roomService: RoomService) {
    this.executeGameDeletionRoutine = this.executeGameDeletionRoutine.bind(this);
    this.handleGameStart = this.handleGameStart.bind(this);
  }

  public ngOnDestroy(): void {
    this.gameStartSub.unsubscribe();
    this.gameDeletionSub.unsubscribe();
    // this.roomService.checkOutRoom();
  }

  public ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((params) => {
      this.gameName = params["gameName"];
      this.gameType = parseInt(params["gameType"], 10);
    });
    this.roomService.signalReady();
    this.gameStartSub = this.roomService.subscribeToGameStart(this.handleGameStart);
    this.gameDeletionSub = this.socket.onEvent(SocketEvent.DELETE).subscribe(this.executeGameDeletionRoutine);
  }

  private handleGameStart(roomInfo: SimpleReadyInfo): void {
    this.gameType === GameType.SIMPLE ? this.navigateToSimpleGame(roomInfo) : this.navigateToFreeGame();
  }

  private executeGameDeletionRoutine(message: WebsocketMessage<[string, boolean]>): void {
    this.notifyGameDeletion(message);
    this.navigateGameList();
  }

  private navigateGameList (): void {
    this.route.navigate([GAMES_ROUTE])
    .catch(() => {
      throw new ComponentNavigationError();
    });
  }

  private navigateToSimpleGame(readyInfo: SimpleReadyInfo): void {
    this.route.navigate([PLAY_ROUTE], {
      queryParams: {
        gameName: this.gameName,
        originalImage: readyInfo.originalImage, // TODO Remove me now that I have sockets!
        modifiedImage: readyInfo.modifiedImage,
        onlineType: OnlineType.MULTI,
      },
    }).catch(() => {
      throw new ComponentNavigationError();
    });
  }

  private navigateToFreeGame(): void {
    this.route.navigate([PLAY_3D_ROUTE], {
      queryParams: {
        gameName: this.gameName,
        onlineType: OnlineType.MULTI,
      },
    }).catch(() => {
      throw new ComponentNavigationError();
    });
  }

  private notifyGameDeletion(message: WebsocketMessage<[string, boolean]>): void {
    if (message.body[this.indexString] === this.gameName) {
      openDialog(this.dialog, GameDeletionNotifComponent, {data: {gameName: this.gameName, gameType: this.gameType}});
    }
  }
}
