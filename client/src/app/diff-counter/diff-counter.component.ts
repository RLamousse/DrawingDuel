import {Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {MatDialog, MatDialogConfig} from "@angular/material";
import {Router} from "@angular/router";
import {createWebsocketMessage, UpdateScoreMessage, WebsocketMessage} from "../../../../common/communication/messages/message";
import {SocketEvent} from "../../../../common/communication/socket-events";
import {ComponentNavigationError} from "../../../../common/errors/component.errors";
import {SceneRendererService} from "../scene-creator/scene-renderer.service";
import {SimpleGameService} from "../simple-game/simple-game.service";
import {SocketService} from "../socket.service";
import {UNListService} from "../username.service";
import {EndGameNotifComponent} from "./end-game-notif/end-game-notif.component";

@Component({
             selector: "app-diff-counter",
             templateUrl: "./diff-counter.component.html",
             styleUrls: ["./diff-counter.component.css"],
           })
export class DiffCounterComponent implements OnInit {

  @Output() private stopTime: EventEmitter<undefined> = new EventEmitter();

  protected diffNumber: number;
  @Input() private gameName: string;
  @Input() private minutes: number;
  @Input() private seconds: number;
  @Input() private isSimpleGame: boolean;
  private readonly MAX_DIFF_NUM: number = 7;
  private readonly MINUTES_FACTOR: number = 60;
  private socketMessage: WebsocketMessage<UpdateScoreMessage>;

  public constructor(private simpleGameService: SimpleGameService, private dialog: MatDialog,
                     protected socket: SocketService, private router: Router, private sceneRendererService: SceneRendererService) {
    this.diffNumber = 0;
  }

  public ngOnInit(): void {
    this.isSimpleGame ? this.checkDiffSimpleGame() : this.checkDiffFreeGame();
  }

  private endGame(): void {
    this.stopTime.next();
    this.simpleGameService.resetDifferenceCount();
    this.postTime();
    this.openCongratDialog();
  }

  private checkDiffSimpleGame(): void {
    this.simpleGameService.foundDifferencesCount.subscribe((differenceCount: number) => {
      if (this.diffNumber === this.MAX_DIFF_NUM - 1 && this.diffNumber !== differenceCount) {
        this.endGame();
      }
      this.diffNumber = differenceCount;
    });
  }

  private checkDiffFreeGame(): void {
    this.sceneRendererService.foundDifferenceCount.subscribe((differenceCount: number) => {
      if (this.diffNumber === this.MAX_DIFF_NUM - 1 && this.diffNumber !== differenceCount) {
        this.endGame();
      }
      this.diffNumber = differenceCount;
    });
  }

  private openCongratDialog(): void {
    const dialogConfig: MatDialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.data = {gameName: this.gameName, isSimpleGame: this.isSimpleGame, };
    this.dialog.open(EndGameNotifComponent, dialogConfig).afterClosed().subscribe(() => {
      this.router.navigate(["/game-list/"]) // tslint:disable-next-line:no-any Generic error response
      .catch((reason: any) => {
        throw new ComponentNavigationError();
      });
    });

  }

  private postTime(): void {
    this.socketMessage = createWebsocketMessage(
      {
        gameName: this.gameName,
        isSolo: true,
        newTime: {
          name: UNListService.username, time: this.minutes * this.MINUTES_FACTOR + this.seconds,
        },
      });
    this.socket.send(SocketEvent.UPDATE_SCORE, this.socketMessage);
  }

}
