import {Component, Input, OnInit, ViewChild} from "@angular/core";
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

  public constructor(private simpleGameService: SimpleGameService) { }

  public ngOnInit() {

  }

  public onCanvasClick(clickEvent: IPoint) {

    // TODO: Call service
    this.modifiedImageComponent.appendToCanvas(appendedImageData);
  }

}
