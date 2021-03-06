import {Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild} from "@angular/core";
import {MatDialog} from "@angular/material";
import {ActivatedRoute, Router} from "@angular/router";
import {Subscription} from "rxjs";
import {GAMES_ROUTE} from "../../../../common/communication/routes";
import {SocketEvent} from "../../../../common/communication/socket-events";
import {ComponentNavigationError, FreeViewGamesRenderingError} from "../../../../common/errors/component.errors";
import {IFreeGame} from "../../../../common/model/game/free-game";
import {IPoint} from "../../../../common/model/point";
import {X_FACTOR, Y_FACTOR} from "../../../../common/util/util";
import {openDialog} from "../dialog-utils";
import {GameService} from "../game.service";
import {KickDialogComponent} from "../kick-dialog/kick-dialog.component";
import {IScene} from "../scene-interface";
import {SocketService} from "../socket.service";
import {drawTextOnCanvas, getCanvasRenderingContext, CanvasTextType} from "../util/canvas-utils";
import {FreeGameCreatorService} from "./FreeGameCreator/free-game-creator.service";
import {SceneRendererService} from "./scene-renderer.service";

export const TEXT_FONT: string = "20px Comic Sans MS";
export const IDENTIFICATION_ERROR_TEXT: string = "Erreur";

@Component({
             selector: "app-scene-creator",
             templateUrl: "./scene-creator.component.html",
             styleUrls: ["./scene-creator.component.css"],
           })
export class SceneCreatorComponent implements OnInit, OnDestroy {
  // @ts-ignore variable used in html
  private readonly BACK_BUTTON_ROUTE: string = GAMES_ROUTE;
  private readonly CHEAT_KEY_CODE: string = "KeyT";
  private readonly LOADING_TIME: number = 1500;

  private clickEnabled: boolean;
  private originalCanvasContext: CanvasRenderingContext2D;
  private modifiedCanvasContext: CanvasRenderingContext2D;

  protected gameName: string;
  protected cursorEnabled: boolean = true;
  private onKickSubscription: Subscription;

  protected isLoading: boolean;

  public constructor(private renderService: SceneRendererService,
                     private route: ActivatedRoute,
                     private freeGameCreator: FreeGameCreatorService,
                     private gameService: GameService,
                     private socketService: SocketService,
                     private router: Router,
                     private dialog: MatDialog) {
    this.clickEnabled = true;
    this.isLoading = true;
    this.handleLoadTime = this.handleLoadTime.bind(this);
  }

  @ViewChild("originalView")
  private originalView: ElementRef;

  @ViewChild("modifiedView")
  private modifiedView: ElementRef;

  @ViewChild("originalCanvas")
  private originalCanvas: ElementRef;

  @ViewChild("modifiedCanvas")
  private modifiedCanvas: ElementRef;

  public async ngOnDestroy(): Promise<void> {
    await this.renderService.deactivateCheatMode();
    this.onKickSubscription.unsubscribe();
  }

  public ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.gameName = params["gameName"];
    });
    this.renderService.init(this.originalView.nativeElement, this.modifiedView.nativeElement);

    this.originalCanvasContext = getCanvasRenderingContext(this.originalCanvas);
    this.modifiedCanvasContext = getCanvasRenderingContext(this.modifiedCanvas);

    this.verifyGame()
      .then((scene: IScene) => this.renderService.loadScenes(scene.scene, scene.modifiedScene))
      .catch(() => {
        throw new FreeViewGamesRenderingError();
    });

    this.onKickSubscription = this.socketService.onEvent(SocketEvent.KICK)
      .subscribe(async () => this.onKick());

    setTimeout(this.handleLoadTime, this.LOADING_TIME);
  }

  private handleLoadTime(): void {
    this.isLoading = false;
  }

  private async verifyGame(): Promise<IScene> {
    return new Promise<IScene>((resolve) => {
      this.gameService.getFreeGameByName(this.gameName).subscribe((freeGame: IFreeGame) => {
        const freeScenes: IScene = this.freeGameCreator.createScenes(freeGame.scenes);
        resolve(freeScenes);
      });
    });
  }

  @HostListener("document:keyup", ["$event"])
  // @ts-ignore even if the onKeyPress function is never explicitly read, the HostListener will call it when a key is pressed
  private async onKeyPress(event: KeyboardEvent): Promise<void> {
    if (event.code === this.CHEAT_KEY_CODE) {
      await this.renderService.modifyCheatState(async () => this.gameService.loadCheatData(this.gameName));
    }
  }

  public onRightClick(clickEvent: MouseEvent): void {
    clickEvent.preventDefault();
  }

  public onDivContClick(clickEvent: MouseEvent): void {
    if (this.clickEnabled) {
      const clickPosition: IPoint = {x: clickEvent.clientX, y: clickEvent.clientY};
      this.clickEnabled = false;
      this.renderService.objDiffValidation(clickPosition)
        .then(() => {
          this.clickEnabled = true;
        })
        .catch(() => {
          this.cursorEnabled = false;
          const clickedCanvas: CanvasRenderingContext2D = this.canvasErrorDraw(clickPosition);
          this.scheduleCanvasCleanup(clickedCanvas);
        });
    }
  }

  private scheduleCanvasCleanup(renderingContext: CanvasRenderingContext2D): void {
    const TIMEOUT: number = 1000;
    setTimeout(
      () => {
        this.cursorEnabled = true;
        this.clickEnabled = true;
        renderingContext.clearRect(0, 0, renderingContext.canvas.width, renderingContext.canvas.height);
      },
      TIMEOUT);
  }

  private canvasErrorDraw(clickPosition: IPoint): CanvasRenderingContext2D {
    const canvasContext: CanvasRenderingContext2D = clickPosition.x < this.modifiedCanvasContext.canvas.offsetLeft
      ? this.originalCanvasContext : this.modifiedCanvasContext;

    canvasContext.font = TEXT_FONT;
    canvasContext.textAlign = "center";
    canvasContext.strokeStyle = "black";

    const point: IPoint = {
      x: Math.floor(clickPosition.x - canvasContext.canvas.offsetLeft) / X_FACTOR,
      y: Math.floor(clickPosition.y - canvasContext.canvas.offsetTop) / Y_FACTOR,
    };

    drawTextOnCanvas(IDENTIFICATION_ERROR_TEXT, point, canvasContext, CanvasTextType.ERROR);

    return canvasContext;
  }

  protected onKick(): void {
    openDialog(
      this.dialog,
      KickDialogComponent,
      {
        callback: () => {
          this.router.navigate([GAMES_ROUTE])
            .catch(() => {
              throw new ComponentNavigationError();
            });
        },
      });
  }
}
