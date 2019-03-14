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

  private clickEnabled: boolean = true;

  public constructor(private simpleGameService: SimpleGameService) {
  }

  public onCanvasClick(clickEvent: IPoint): void {
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
          this.handleIdentificationError(clickEvent);
        }
      });
  }

  private handleIdentificationError(clickEvent: IPoint): void {
    const pixelsBackup: Uint8ClampedArray = this.originalImageComponent.getRawPixelData();
    this.originalImageComponent.drawText(
      IDENTIFICATION_ERROR_TEXT,
      tansformOrigin(clickEvent, this.originalImageComponent.height),
      TextType.ERROR);

    setTimeout(
      () => {
        this.originalImageComponent.setRawPixelData(pixelsBackup);
        this.clickEnabled = true;
      },
      IDENTIFICATION_ERROR_TIMOUT_MS,
    );
  }
}
