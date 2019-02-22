import {Component, Input, OnInit, ViewChild} from "@angular/core";
import {DifferenceCluster} from "../../../../../common/model/game/simple-game";
import {IPoint} from "../../../../../common/model/point";
import {SimpleGameService} from "../../simple-game.service";
import {SimpleGameCanvasComponent} from "../simple-game-canvas/simple-game-canvas.component";

@Component({
             selector: "app-simple-game-container",
             templateUrl: "./simple-game-container.component.html",
             styleUrls: ["./simple-game-container.component.css"],
           })
export class SimpleGameContainerComponent implements OnInit {

  @Input() public originalImage: string;
  @Input() public modifiedImage: string;

  @ViewChild("originalImageComponent") private originalImageComponent: SimpleGameCanvasComponent;
  @ViewChild("modifiedImageComponent") private modifiedImageComponent: SimpleGameCanvasComponent;

  public constructor(private simpleGameService: SimpleGameService) {
  }

  public ngOnInit(): void {
  }

  public onCanvasClick(clickEvent: IPoint): void {
    this.simpleGameService.validateDifferenceAtPoint(clickEvent)
      .then((differenceCluster: DifferenceCluster) => {
        console.log("WINNER WINNER CHICKEN DINNER");
        console.log(JSON.stringify(clickEvent));
        this.copyPixelsForCluster(differenceCluster);
      })
      .catch((error: Error) => {
        // TODO: Handle difference not found
        console.log("FOUINNNNNN");
        console.log(JSON.stringify(clickEvent));
        this.playSound();
      });
  }

  public playSound() {

  }

  private copyPixelsForCluster(differenceCluster: DifferenceCluster): void {
    const imageData: ImageData = SimpleGameService.getImageDataForDifferenceCluster(
      differenceCluster,
      this.originalImageComponent.canvasImageData,
    );

    this.modifiedImageComponent.appendToCanvas(imageData);
  }
}
