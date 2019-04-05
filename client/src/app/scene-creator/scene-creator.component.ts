import {AfterViewInit, Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {SceneGenerationError} from "../../../../common/errors/services.errors";
import {IFreeGame} from "../../../../common/model/game/free-game";
import {IPoint} from "../../../../common/model/point";
import {X_FACTOR, Y_FACTOR} from "../../../../common/util/util";
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
export class SceneCreatorComponent implements AfterViewInit, OnInit, OnDestroy {
  private clickEnabled: boolean;
  public constructor(private renderService: SceneRendererService, private route: ActivatedRoute,
                     private freeGameCreator: FreeGameCreatorService, private gameService: GameService) {
    this.clickEnabled = true;
  }

  protected gameName: string;
  protected cursorEnabled: boolean = true;

  private get originalContainer(): HTMLDivElement {
    return this.originalRef.nativeElement;
  }

  private get modifiedContainer(): HTMLDivElement {
    return this.modifiedRef.nativeElement;
  }

  private readonly CHEAT_KEY_CODE: string = "KeyT";

  @ViewChild("originalView")
  private originalRef: ElementRef;

  @ViewChild("modifiedView")
  private modifiedRef: ElementRef;

  public async ngOnDestroy(): Promise<void> {
   await this.renderService.deactivateCheatMode();
  }

  public ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.gameName = params["gameName"];
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

  public ngAfterViewInit(): void {
    this.renderService.init(this.originalContainer, this.modifiedContainer);
    this.verifyGame().then((scene: IScene) =>
                             this.renderService.loadScenes(scene.scene, scene.modifiedScene, this.gameName),
    ).catch((e: Error) => {
      throw new SceneGenerationError();
    });
  }

  @HostListener("document:keyup", ["$event"])
  // @ts-ignore even if the onKeyPress function is never explicitly read, the HostListener will call it when a key is pressed
  private async onKeyPress(event: KeyboardEvent): Promise<void> {
    if (event.code === this.CHEAT_KEY_CODE) {
      await this.renderService.modifyCheatState(async () => this.gameService.loadCheatData(this.gameName));
    }
  }

  public onRightClick($event: MouseEvent): void {
    $event.preventDefault();
  }

  public onDivContClick($event: MouseEvent): void {
    if (
      this.clickEnabled
    ) {
      this.clickEnabled = false;
      this.renderService.objDiffValidation($event.clientX, $event.clientY).then(() => {
        const VICTORY_COUNT: number = 7;
        this.clickEnabled = true;
        if (this.renderService.gameState.foundDifference.length === VICTORY_COUNT) {
          this.canvasVictoryDraw();
          this.clickEnabled = false;
        }

        return;
        })
        .catch(() => {
          this.cursorEnabled = false;
          const canvasContext: CanvasRenderingContext2D | null = this.canvasErrorDraw($event);
          if (canvasContext !== null) {
            this.resetRoutine(canvasContext);
          }

          return;
        });
    }
  }

  private resetRoutine(ctx: CanvasRenderingContext2D): void {
    const TIMEOUT: number = 1000;
    setTimeout(
      () => {
      this.cursorEnabled = true;
      this.clickEnabled = true;
      ctx.clearRect(0 , 0, ctx.canvas.width, ctx.canvas.height);
      },
      TIMEOUT);
  }

  private canvasErrorDraw($event: MouseEvent): CanvasRenderingContext2D | null {
    const MOD_CANVAS: string = "modifiedCanvasMessage";
    const ORI_CANVAS: string = "originalCanvasMessage";
    const canvasElm: HTMLElement | null = document.getElementById(MOD_CANVAS);
    let canvasContext: CanvasRenderingContext2D | null = (canvasElm as HTMLCanvasElement).getContext("2d");
    if ($event.clientX < (canvasContext as CanvasRenderingContext2D).canvas.offsetLeft) {
      canvasContext = (document.getElementById(ORI_CANVAS) as HTMLCanvasElement).getContext("2d");
    }
    if (canvasContext === null) {
      return canvasContext;
    }
    canvasContext.font = TEXT_FONT;
    canvasContext.textAlign = "center";
    canvasContext.strokeStyle = "black";
    const point: IPoint = {
      x: Math.floor($event.clientX - canvasContext.canvas.offsetLeft) / X_FACTOR,
      y: Math.floor($event.clientY - canvasContext.canvas.offsetTop) / Y_FACTOR,
    };
    this.drawText(IDENTIFICATION_ERROR_TEXT, point, canvasContext, TextType.ERROR);

    return canvasContext;
  }

  private canvasVictoryDraw(): void {
    const END_GAME_ID: string = "endGameMessage";
    const victoryElm: HTMLElement | null = document.getElementById(END_GAME_ID);
    const elmCtx: CanvasRenderingContext2D | null = (victoryElm as HTMLCanvasElement).getContext("2d");
    if (elmCtx !== null) {
      const position: IPoint = {
        x: elmCtx.canvas.width / X_FACTOR,
        y: elmCtx.canvas.height / Y_FACTOR,
      };
      elmCtx.font = TEXT_FONT;
      elmCtx.textAlign = "center";
      elmCtx.strokeStyle = "black";
      this.drawText(VICTORY_TEXT, position, elmCtx, TextType.VICTORY);
    }
  }

  private drawText(text: string, position: IPoint, ctx: CanvasRenderingContext2D, textType?: TextType): void {
    switch (textType) {
      case TextType.ERROR:
        ctx.fillStyle = ERROR_TEXT_COLOR;
        ctx.strokeText(text, position.x, position.y);
        break;
      case TextType.VICTORY:
        ctx.fillStyle = VICTORY_TEXT_COLOR;
        break;
      default:
        ctx.fillStyle = DEFAULT_TEXT_COLOR;
        break;
    }
    ctx.fillText(text, position.x, position.y);
  }
}
