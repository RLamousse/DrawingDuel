import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from "@angular/core";
import {IPoint} from "../../../../common/model/point";

@Component({
  selector: "app-simple-game-canvas",
  templateUrl: "./simple-game-canvas.component.html",
  styleUrls: ["./simple-game-canvas.component.css"],
})
export class SimpleGameCanvasComponent implements OnInit {

  @Output() public pointClick: EventEmitter<IPoint>;
  @Input() public imageSource: string;

  @ViewChild("canvas") private canvas: ElementRef;
  private canvasContext: CanvasRenderingContext2D;

  public constructor() {
    this.pointClick = new EventEmitter();
  }

  public ngOnInit(): void {
    const imageElement: HTMLImageElement = new Image();
    const canvasElement: HTMLCanvasElement = this.canvas.nativeElement;
    imageElement.onload = () => {
      canvasElement.width = imageElement.width;
      canvasElement.height = imageElement.height;

      const canvasContext: CanvasRenderingContext2D | null = canvasElement.getContext("2d");
      if (canvasContext === null) {
        // ¯\_(ツ)_/¯
        return;
      }
      this.canvasContext = canvasContext;
      this.canvasContext.drawImage(imageElement, 0, 0, imageElement.width, imageElement.height);
    };

    imageElement.crossOrigin = "Anonymous"; // To be able to write in canvas
    imageElement.src = this.imageSource;
  }

  protected clickHandler(event: MouseEvent): void {
    const {offsetX, offsetY} = event;
    this.pointClick.emit({x: offsetX, y: offsetY});
  }

}
