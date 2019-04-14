import {Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {FreeViewGamesRenderingError} from "../../../../common/errors/component.errors";
import {IFreeGame} from "../../../../common/model/game/free-game";
import {GameType} from "../../../../common/model/game/game";
import {IPoint} from "../../../../common/model/point";
import {X_FACTOR, Y_FACTOR} from "../../../../common/util/util";
import {drawTextOnCanvas, getCanvasRenderingContext} from "../client-utils";
import {GameService} from "../game.service";
import {IScene} from "../scene-interface";
import {FreeGameCreatorService} from "./FreeGameCreator/free-game-creator.service";
import {SceneRendererService} from "./scene-renderer.service";

export enum TextType {
  ERROR,
  VICTORY,
}

export const TEXT_FONT: string = "20px Comic Sans MS";
export const ERROR_TEXT_COLOR: string = "#ff0000";
export const VICTORY_TEXT_COLOR: string = "#008000";
export const DEFAULT_TEXT_COLOR: string = "#000000";
export const IDENTIFICATION_ERROR_TEXT: string = "Erreur";
export const VICTORY_TEXT: string = "VICTOIRE";

@Component({
             selector: "app-scene-creator",
             templateUrl: "./scene-creator.component.html",
             styleUrls: ["./scene-creator.component.css"],
           })
export class SceneCreatorComponent implements OnInit, OnDestroy {
  private clickEnabled: boolean;

  private originalCanvasContext: CanvasRenderingContext2D;
  private modifiedCanvasContext: CanvasRenderingContext2D;

  public constructor(private renderService: SceneRendererService, private route: ActivatedRoute,
                     private freeGameCreator: FreeGameCreatorService, private gameService: GameService) {
    this.clickEnabled = true;
  }

  protected gameName: string;
  protected FREE_GAME_TYPE: GameType = GameType.FREE;
  protected cursorEnabled: boolean = true;

  private get originalContainer(): HTMLDivElement {
    return this.originalView.nativeElement;
  }

  private get modifiedContainer(): HTMLDivElement {
    return this.modifiedView.nativeElement;
  }

  private readonly CHEAT_KEY_CODE: string = "KeyT";

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
  }

  public ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.gameName = params["gameName"];
    });
    this.renderService.init(this.originalContainer, this.modifiedContainer);

    this.originalCanvasContext = getCanvasRenderingContext(this.originalCanvas);
    this.modifiedCanvasContext = getCanvasRenderingContext(this.modifiedCanvas);

    this.verifyGame()
      .then((scene: IScene) => {
        return this.renderService.loadScenes(scene.scene, scene.modifiedScene, this.gameName);
      })
      .catch(() => {
        throw new FreeViewGamesRenderingError();
    });
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
          const VICTORY_COUNT: number = 7;
          this.clickEnabled = this.renderService.gameState.foundDifference.length !== VICTORY_COUNT;
        })
        .catch(() => {
          this.cursorEnabled = false;
          this.resetRoutine(this.canvasErrorDraw(clickPosition));
        });
    }
  }

  private resetRoutine(renderingContext: CanvasRenderingContext2D): void {
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

    drawTextOnCanvas(IDENTIFICATION_ERROR_TEXT, point, canvasContext, TextType.ERROR);

    return canvasContext;
  }
}
