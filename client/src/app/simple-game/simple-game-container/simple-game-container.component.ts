import {Component, Input, ViewChild} from "@angular/core";
import {DifferenceCluster, DIFFERENCE_CLUSTER_POINTS_INDEX} from "../../../../../common/model/game/simple-game";
import {tansformOrigin, IPoint} from "../../../../../common/model/point";
import {PixelData, SimpleGameCanvasComponent} from "../simple-game-canvas/simple-game-canvas.component";
import {ALREADY_FOUND_DIFFERENCE, SimpleGameService} from "../simple-game.service";

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

  public constructor(private simpleGameService: SimpleGameService) {
  }

  public onCanvasClick(clickEvent: IPoint): void {
    this.simpleGameService.validateDifferenceAtPoint(clickEvent)
      .then((differenceCluster: DifferenceCluster) => {

        const differencePoints: IPoint[] = differenceCluster[DIFFERENCE_CLUSTER_POINTS_INDEX]
          .map((point: IPoint) => tansformOrigin(point, this.originalImageComponent.height));
        const pixels: PixelData[] = this.originalImageComponent.getPixels(differencePoints);
        this.modifiedImageComponent.drawPixels(pixels);
      })
      // tslint:disable-next-line:no-any Generic error response
      .catch((reason: any) => {
        if (reason.message !== undefined && reason.message === ALREADY_FOUND_DIFFERENCE) {
          return;
        }

        throw new Error(reason);
      });
  }
}
