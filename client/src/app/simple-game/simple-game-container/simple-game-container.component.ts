import {Component, Input, ViewChild} from "@angular/core";
import {DIFFERENCE_CLUSTER_POINTS_INDEX, DifferenceCluster} from "../../../../../common/model/game/simple-game";
import {IPoint, tansformOrigin} from "../../../../../common/model/point";
import {NO_DIFFERENCE_AT_POINT_ERROR_MESSAGE} from "../../../../../server/app/services/diff-validator.service";
import {ALREADY_FOUND_DIFFERENCE, SimpleGameService} from "../../simple-game.service";
import {PixelData, SimpleGameCanvasComponent} from "../simple-game-canvas/simple-game-canvas.component";

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

        this.playSound();
      })
      .catch((error: Error) => {
        switch (error.message) {

          case NO_DIFFERENCE_AT_POINT_ERROR_MESSAGE:
            this.playSound();
            break;

          case ALREADY_FOUND_DIFFERENCE:
          default:
            // Nop
            break;
        }
      });
  }

  public playSound() {

  }
}
