import {Component, Input, ViewChild} from "@angular/core";
import {AlreadyFoundDifferenceError, NoDifferenceAtPointError} from "../../../../../common/errors/services.errors";
import {DifferenceCluster, DIFFERENCE_CLUSTER_POINTS_INDEX} from "../../../../../common/model/game/simple-game";
import {tansformOrigin, IPoint} from "../../../../../common/model/point";
import {PixelData, SimpleGameCanvasComponent, TextType} from "../simple-game-canvas/simple-game-canvas.component";
import {SimpleGameService} from "../simple-game.service";

export const IDENTIFICATION_ERROR_TIMOUT_MS: number = 1000;
export const IDENTIFICATION_ERROR_TEXT: string = "Erreur";

@Component({
             selector: "app-simple-game-container",
             templateUrl: "./simple-game-container.component.html",
             styleUrls: ["./simple-game-container.component.css"],
           })
export class SimpleGameContainerComponent {

  @Input() public originalImage: string;
  @Input() public modifiedImage: string;

  @ViewChild("originalImageComponent") private originalImageComponent: SimpleGameCanvasComponent;
  @ViewChild("modifiedImageComponent") private modifiedImageComponent: SimpleGameCanvasComponent;

  protected clickEnabled: boolean = true;

  public constructor(private simpleGameService: SimpleGameService) {
  }

  protected onOriginalCanvasClick(clickEvent: IPoint): void {
    this.onCanvasClick(clickEvent, this.originalImageComponent);
  }

  protected onModifiedCanvasClick(clickEvent: IPoint): void {
    this.onCanvasClick(clickEvent, this.modifiedImageComponent);
  }

  private onCanvasClick(clickEvent: IPoint, clickedComponent: SimpleGameCanvasComponent): void {
    if (!this.clickEnabled) {
      return;
    }
    this.clickEnabled = false;

    this.simpleGameService.validateDifferenceAtPoint(clickEvent)
      .then((differenceCluster: DifferenceCluster) => {

        const differencePoints: IPoint[] = differenceCluster[DIFFERENCE_CLUSTER_POINTS_INDEX]
          .map((point: IPoint) => tansformOrigin(point, this.originalImageComponent.height));
        const pixels: PixelData[] = this.originalImageComponent.getPixels(differencePoints);
        this.modifiedImageComponent.drawPixels(pixels);
        this.clickEnabled = true;
      })
      .catch((reason: Error) => {
        if (reason.message === AlreadyFoundDifferenceError.ALREADY_FOUND_DIFFERENCE_ERROR_MESSAGE ||
          reason.message === NoDifferenceAtPointError.NO_DIFFERENCE_AT_POINT_ERROR_MESSAGE) {
          this.handleIdentificationError(clickEvent, clickedComponent);
        }
      });
  }

  private handleIdentificationError(clickEvent: IPoint, clickedComponent: SimpleGameCanvasComponent): void {
    const pixelsBackup: Uint8ClampedArray = clickedComponent.getRawPixelData();
    clickedComponent.drawText(
      IDENTIFICATION_ERROR_TEXT,
      tansformOrigin(clickEvent, clickedComponent.height),
      TextType.ERROR);

    setTimeout(
      () => {
        clickedComponent.setRawPixelData(pixelsBackup);
        this.clickEnabled = true;
      },
      IDENTIFICATION_ERROR_TIMOUT_MS,
    );
  }
}
