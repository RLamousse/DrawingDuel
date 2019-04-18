import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from "@angular/core";
import {MatDialog} from "@angular/material";
import {ActivatedRoute, Router} from "@angular/router";
import {Subscription} from "rxjs";
import {
  createWebsocketMessage,
  UpdateScoreMessage,
  WebsocketMessage
} from "../../../../common/communication/messages/message";
import {GAMES_ROUTE} from "../../../../common/communication/routes";
import {SocketEvent} from "../../../../common/communication/socket-events";
import {ComponentNavigationError} from "../../../../common/errors/component.errors";
import {GameType, MULTIPLAYER_GAME_DIFF_THRESHOLD, OnlineType, SINGLEPLAYER_GAME_DIFF_THRESHOLD} from "../../../../common/model/game/game";
import {openDialog} from "../dialog-utils";
import {SceneDiffValidatorService} from "../scene-creator/scene-diff-validator.service";
import {SimpleGameService} from "../simple-game/simple-game.service";
import {SocketService} from "../socket.service";
import {UNListService} from "../username.service";
import {EndGameNotifComponent} from "./end-game-notif/end-game-notif.component";

export interface EndGameInformation {
  isWinner: boolean;
}

@Component({
             selector: "app-diff-counter",
             templateUrl: "./diff-counter.component.html",
             styleUrls: ["./diff-counter.component.css"],
           })
export class DiffCounterComponent implements OnInit, OnDestroy {

  @Output() private stopTime: EventEmitter<undefined> = new EventEmitter();

  @Input() private gameName: string;
  @Input() private minutes: number;
  @Input() private seconds: number;
  @Input() private gameType: GameType;
  private MAX_DIFF_NUM: number = 7;
  private readonly MINUTES_FACTOR: number = 60;
  protected advDiffNumber: number;
  private diffNumber: number;
  private isMulti: boolean;
  private subscriptions: Subscription[];

  public constructor(private simpleGameService: SimpleGameService,
                     private dialog: MatDialog,
                     protected socket: SocketService,
                     private router: Router,
                     private sceneValidator: SceneDiffValidatorService,
                     private route: ActivatedRoute) {
    this.subscriptions = [];
    this.diffNumber = 0;
    this.advDiffNumber = 0;
    this.countDiff = this.countDiff.bind(this);
  }

  public ngOnInit(): void {
    this.checkDiff();
    this.route.queryParams.subscribe((params) => {
      this.isMulti = params["onlineType"] === OnlineType.MULTI;
      this.MAX_DIFF_NUM = this.isMulti ? MULTIPLAYER_GAME_DIFF_THRESHOLD : SINGLEPLAYER_GAME_DIFF_THRESHOLD;
    });
  }

  private endGame(): void {
    this.stopTime.next();
    this.simpleGameService.resetDifferenceCount();
    this.postTime();
    this.openCongratulationDialog();
  }

  private countDiff(isMe: boolean): void {
    if (isMe) {
      this.diffNumber++;
    } else {
      this.advDiffNumber++;
    }
    if (this.isGameFinished()) {
      this.endGame();
    }
  }

  private isGameFinished(): boolean {
    return this.diffNumber === this.MAX_DIFF_NUM || this.advDiffNumber === this.MAX_DIFF_NUM;
  }

  private checkDiff(): void {
    const sub: Subscription = this.gameType === GameType.SIMPLE
      ? this.simpleGameService.foundDifferencesCount.subscribe(this.countDiff)
      : this.sceneValidator.foundDifferenceCount.subscribe(this.countDiff);
    this.subscriptions.push(sub);
  }

  private openCongratulationDialog(): void {
    openDialog(
      this.dialog,
      EndGameNotifComponent,
      {
        callback: () => {
          this.router.navigate([GAMES_ROUTE])
            .catch(() => {
              throw new ComponentNavigationError();
            });
        },
        data: {isWinner: this.diffNumber > this.advDiffNumber} as EndGameInformation,
      },
    );
  }

  private postTime(): void {
    const socketMessage: WebsocketMessage<UpdateScoreMessage> = createWebsocketMessage<UpdateScoreMessage>({
      gameName: this.gameName,
      onlineType: this.isMulti ? OnlineType.MULTI : OnlineType.SOLO,
      newTime: {
        name: UNListService.username,
        time: this.minutes * this.MINUTES_FACTOR + this.seconds,
      },
    });
    this.socket.send(SocketEvent.UPDATE_SCORE, socketMessage);
  }

  public ngOnDestroy(): void {
    this.subscriptions.forEach((elem: Subscription) => elem.unsubscribe());
    this.diffNumber = 0;
  }

}
