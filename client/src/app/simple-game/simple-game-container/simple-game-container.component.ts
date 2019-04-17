import {Component, Input, OnDestroy, ViewChild} from "@angular/core";
import {Subscription} from "rxjs";
import {AlreadyFoundDifferenceError, NoDifferenceAtPointError} from "../../../../../common/errors/services.errors";
import {DIFFERENCE_CLUSTER_POINTS_INDEX} from "../../../../../common/model/game/simple-game";
import {inverseY, IPoint} from "../../../../../common/model/point";
import {ISimpleGameInteractionResponse} from "../../../../../common/model/rooms/interaction";
import {CanvasTextType} from "../../util/canvas-utils";
import {playRandomSound, FOUND_DIFFERENCE_SOUNDS, NO_DIFFERENCE_SOUNDS} from "../game-sounds";
import {PixelData, SimpleGameCanvasComponent} from "../simple-game-canvas/simple-game-canvas.component";
import {SimpleGameService} from "../simple-game.service";
import {UNListService} from "../../username.service";

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
  private successSubscription: Subscription;
  private errorSubscription: Subscription;
  private lastClick: IPoint;
  private lastClickOrigin: SimpleGameCanvasComponent;

  public constructor(private simpleGameService: SimpleGameService) {
    this.handleValidationSuccessResponse = this.handleValidationSuccessResponse.bind(this);
    this.handleValidationErrorResponse = this.handleValidationErrorResponse.bind(this);
    this.successSubscription = this.simpleGameService.registerDifferenceSuccessCallback(this.handleValidationSuccessResponse);
    this.errorSubscription = this.simpleGameService.registerDifferenceErrorCallback(this.handleValidationErrorResponse);
  }

  protected onOriginalCanvasClick(clickEvent: IPoint): void {
    this.onCanvasClick(clickEvent, this.originalImageComponent);
  }

  protected onModifiedCanvasClick(clickEvent: IPoint): void {
    this.onCanvasClick(clickEvent, this.modifiedImageComponent);
  }

  private handleValidationSuccessResponse(interactionResponse: ISimpleGameInteractionResponse): void {
    const differencePoints: IPoint[] = interactionResponse.differenceCluster[DIFFERENCE_CLUSTER_POINTS_INDEX]
      .map((point: IPoint) => inverseY(point, this.originalImageComponent.height));
    const pixels: PixelData[] = this.originalImageComponent.getPixels(differencePoints);
    this.modifiedImageComponent.drawPixels(pixels);
    this.clickEnabled = true;
    const isMe: boolean = interactionResponse.initiatedBy === UNListService.username;
    this.simpleGameService.updateCounter(isMe);
    if (isMe) {
      playRandomSound(FOUND_DIFFERENCE_SOUNDS);
    }
  }

  private handleValidationErrorResponse(errorMessage: string): void {
    if (errorMessage === AlreadyFoundDifferenceError.ALREADY_FOUND_DIFFERENCE_ERROR_MESSAGE ||
      errorMessage === NoDifferenceAtPointError.NO_DIFFERENCE_AT_POINT_ERROR_MESSAGE) {
      playRandomSound(NO_DIFFERENCE_SOUNDS);
      this.handleIdentificationError();
    }
  }

  private onCanvasClick(clickEvent: IPoint, clickedComponent: SimpleGameCanvasComponent): void {
    if (!this.clickEnabled) {
      return;
    }
    this.clickEnabled = false;
    this.lastClick = clickEvent;
    this.lastClickOrigin = clickedComponent;

    this.simpleGameService.validateDifferenceAtPoint(clickEvent);
  }

  public ngOnDestroy(): void {
    this.successSubscription.unsubscribe();
    this.errorSubscription.unsubscribe();
  }

  private handleIdentificationError(): void {
    const pixelsBackup: Uint8ClampedArray = this.lastClickOrigin.getRawPixelData();
    this.lastClickOrigin.drawText(
      IDENTIFICATION_ERROR_TEXT,
      inverseY(this.lastClick, this.lastClickOrigin.height),
      CanvasTextType.ERROR);

    setTimeout(
      () => {
        this.lastClickOrigin.setRawPixelData(pixelsBackup);
        this.clickEnabled = true;
      },
      IDENTIFICATION_ERROR_TIMOUT_MS,
    );
  }
}
