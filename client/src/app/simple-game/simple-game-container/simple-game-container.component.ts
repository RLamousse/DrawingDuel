import {Component, Input, OnDestroy, ViewChild} from "@angular/core";
import {Subscription} from "rxjs";
import {AlreadyFoundDifferenceError, NoDifferenceAtPointError} from "../../../../../common/errors/services.errors";
import {DIFFERENCE_CLUSTER_POINTS_INDEX} from "../../../../../common/model/game/simple-game";
import {inverseY, IPoint} from "../../../../../common/model/point";
import {ISimpleGameInteractionResponse} from "../../../../../common/model/rooms/interaction";
import {playRandomSound, FOUND_DIFFERENCE_SOUNDS, NO_DIFFERENCE_SOUNDS} from "../game-sounds";
import {PixelData, SimpleGameCanvasComponent, TextType} from "../simple-game-canvas/simple-game-canvas.component";
import {SimpleGameService} from "../simple-game.service";

export const IDENTIFICATION_ERROR_TIMOUT_MS: number = 1000;
export const IDENTIFICATION_ERROR_TEXT: string = "Erreur";

@Component({
             selector: "app-simple-game-container",
             templateUrl: "./simple-game-container.component.html",
             styleUrls: ["./simple-game-container.component.css"],
           })
export class SimpleGameContainerComponent implements OnDestroy {

  @Input() public originalImage: string;
  @Input() public modifiedImage: string;

  @ViewChild("originalImageComponent") private originalImageComponent: SimpleGameCanvasComponent;
  @ViewChild("modifiedImageComponent") private modifiedImageComponent: SimpleGameCanvasComponent;

  protected clickEnabled: boolean = true;
  private callbackSub: Subscription;
  private lastClick: IPoint;
  private lastClickOrigin: SimpleGameCanvasComponent;

  public constructor(private simpleGameService: SimpleGameService) {
    this.handleValidationResponse = this.handleValidationResponse.bind(this);
    this.callbackSub = this.simpleGameService.registerDifferenceCallback(this.handleValidationResponse);
  }

  protected async onOriginalCanvasClick(clickEvent: IPoint): Promise<void> {
    return this.onCanvasClick(clickEvent, this.originalImageComponent);
  }

  protected async onModifiedCanvasClick(clickEvent: IPoint): Promise<void> {
    return this.onCanvasClick(clickEvent, this.modifiedImageComponent);
  }

  private handleValidationResponse (value: ISimpleGameInteractionResponse | string): void {
    if ((value as ISimpleGameInteractionResponse).differenceCluster) {
      const differencePoints: IPoint[] = (value as ISimpleGameInteractionResponse).differenceCluster[DIFFERENCE_CLUSTER_POINTS_INDEX]
        .map((point: IPoint) => inverseY(point, this.originalImageComponent.height));
      const pixels: PixelData[] = this.originalImageComponent.getPixels(differencePoints);
      this.modifiedImageComponent.drawPixels(pixels);
      playRandomSound(FOUND_DIFFERENCE_SOUNDS);
      this.clickEnabled = true;
      this.simpleGameService.updateCounter();
    } else {
      if (value === AlreadyFoundDifferenceError.ALREADY_FOUND_DIFFERENCE_ERROR_MESSAGE ||
          value === NoDifferenceAtPointError.NO_DIFFERENCE_AT_POINT_ERROR_MESSAGE) {
        playRandomSound(NO_DIFFERENCE_SOUNDS);
        this.handleIdentificationError();
      }
    }
    this.callbackSub.unsubscribe();
  }

  private onCanvasClick(clickEvent: IPoint, clickedComponent: SimpleGameCanvasComponent): void {
    if (!this.clickEnabled) {
      return;
    }
    this.clickEnabled = false;
    this.callbackSub.unsubscribe();
    this.callbackSub = this.simpleGameService.registerDifferenceCallback(this.handleValidationResponse);
    this.lastClick = clickEvent;
    this.lastClickOrigin = clickedComponent;

    this.simpleGameService.validateDifferenceAtPoint(clickEvent);
  }

  public ngOnDestroy(): void {
    this.callbackSub.unsubscribe();
  }

  private handleIdentificationError(): void {
    const pixelsBackup: Uint8ClampedArray = this.lastClickOrigin.getRawPixelData();
    this.lastClickOrigin.drawText(
      IDENTIFICATION_ERROR_TEXT,
      inverseY(this.lastClick, this.lastClickOrigin.height),
      TextType.ERROR);

    setTimeout(
      () => {
        this.lastClickOrigin.setRawPixelData(pixelsBackup);
        this.clickEnabled = true;
      },
      IDENTIFICATION_ERROR_TIMOUT_MS,
    );
  }
}
