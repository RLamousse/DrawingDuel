import {Component, OnDestroy, OnInit} from "@angular/core";
import {MatDialog, MatDialogConfig} from "@angular/material";
import {ActivatedRoute, Router} from "@angular/router";
import {Subscription} from "rxjs";
import {WebsocketMessage} from "../../../../common/communication/messages/message";
import {SocketEvent} from "../../../../common/communication/socket-events";
import {ComponentNavigationError} from "../../../../common/errors/component.errors";
import {GameType, OnlineType} from "../../../../common/model/game/game";
import {SimpleReadyInfo} from "../../../../common/model/rooms/ready-info";
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
      this.gameType = params["gameType"];
    });
    this.roomService.signalReady();
    this.gameStartSub = this.roomService.subscribeToGameStart(this.handleGameStart);
    this.gameDeletionSub = this.socket.onEvent(SocketEvent.DELETE).subscribe(this.executeGameDeletionRoutine);
  }

  private handleGameStart(roomInfo: SimpleReadyInfo): void {
    // this.gameType === GameType.SIMPLE ? this.navigateToSimpleGame(roomInfo) : this.navigateToFreeGame();
    this.navigateToSimpleGame(roomInfo);
  }

  private executeGameDeletionRoutine(message: WebsocketMessage<[string, boolean]>): void {
    this.notifyGameDeletion(message);
    this.navigateGameList();
  }

  private navigateGameList (): void {
    this.route.navigate(["/game-list/"])
    .catch(() => {
      throw new ComponentNavigationError();
    });
  }

  private navigateToSimpleGame(readyInfo: SimpleReadyInfo): void {
    this.route.navigate(["/play-view/"], {
      queryParams: {
        gameName: this.gameName,
        originalImage: readyInfo.originalImage,
        modifiedImage: readyInfo.modifiedImage,
        gameType: this.gameType,
        onlineType: OnlineType.MULTI,
      },
    }).catch(() => {
      throw new ComponentNavigationError();
    });
  }

  // private navigateToFreeGame(): void {
  //   this.route.navigate(["/3d-view/"], {
  //     queryParams: {
  //       gameName: this.gameName,
  //     },
  //   }).catch(() => {
  //     throw new ComponentNavigationError();
  //   });
  // }

  private notifyGameDeletion(message: WebsocketMessage<[string, boolean]>): void {
    if (message.body[this.indexString] === this.gameName) {
      const dialogConfig: MatDialogConfig = new MatDialogConfig();
      dialogConfig.autoFocus = true;
      dialogConfig.data = {gameName: this.gameName, gameType: this.gameType};
      this.dialog.open(GameDeletionNotifComponent, dialogConfig);
    }
  }
}
