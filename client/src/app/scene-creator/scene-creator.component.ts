import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {IFreeGame} from "../../../../common/model/game/free-game";
import {GameService} from "../game.service";
import {IScene} from "../scene-interface";
import {FreeGameCreatorService} from "./FreeGameCreator/free-game-creator.service";
import {SceneRendererService} from "./scene-renderer.service";

export enum TextType {
  ERROR,
  VICTORY,
}

export const IMAGE_DATA_PIXEL_LENGTH: number = 4;
export const DEFAULT_CANVAS_HEIGHT: number = 480;
export const TEXT_FONT: string = "30px Comic Sans MS";
export const ERROR_TEXT_COLOR: string = "#ff0000";
export const VICTORY_TEXT_COLOR: string = "#008000";
export const DEFAULT_TEXT_COLOR: string = "#000000";
export const IDENTIFICATION_ERROR_TEXT: string = "Erreur";

@Component({
             selector: "app-scene-creator",
             templateUrl: "./scene-creator.component.html",
             styleUrls: ["./scene-creator.component.css"],
           })
export class SceneCreatorComponent implements AfterViewInit, OnInit {
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

  @ViewChild("originalView")
  private originalRef: ElementRef;

  @ViewChild("modifiedView")
  private modifiedRef: ElementRef;

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
    const errMsg: string = "An error occured when trying to render the free view games";
    this.renderService.init(this.originalContainer, this.modifiedContainer);
    this.verifyGame().then((scene: IScene) =>
                             this.renderService.loadScenes(scene.scene, scene.modifiedScene, this.gameName),
    ).catch((e: Error) => {
      e.message = errMsg;
      throw e;
    });
  }
  public onRightClick($event: MouseEvent): void {
    $event.preventDefault();
  }

  public onDivContClick($event: MouseEvent): void {
    const CANVAS_TAG: string = "CANVAS";
    if (
      $event.srcElement !== null &&
      $event.srcElement.tagName === CANVAS_TAG &&
      this.clickEnabled
    ) {
      this.clickEnabled = false;
      this.renderService.objDiffValidation($event.clientX, $event.clientY).then(() => {
        this.clickEnabled = true; })
        .catch(() => {
          this.cursorEnabled = false;
          this.cursorStatusChange();
          const canvasElm: HTMLElement| null = document.getElementById("originalCanvasMessage");
          if (canvasElm === null) {
            return;
          }
          const canvasContext: CanvasRenderingContext2D | null = (canvasElm as HTMLCanvasElement).getContext("2d");

        });
    }
  }

  private cursorStatusChange(): void {
    const TIMEOUT: number = 1000;
    setTimeout(() => {
      this.cursorEnabled = true;
      this.clickEnabled = true;
      },
               TIMEOUT);
  }
}
