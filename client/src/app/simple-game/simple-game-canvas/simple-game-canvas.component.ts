import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from "@angular/core";
import {IPoint} from "../../../../../common/model/point";

@Component({
             selector: "app-simple-game-canvas",
             templateUrl: "./simple-game-canvas.component.html",
             styleUrls: ["./simple-game-canvas.component.css"],
           })
export class SimpleGameCanvasComponent implements OnInit {

  @Output() public pointClick: EventEmitter<IPoint> = new EventEmitter();
  @Input() public imageSource: string;

  @ViewChild("canvas") private canvas: ElementRef;
  private _canvasContext: CanvasRenderingContext2D;
  private _width: number;
  private _height: number;

  public constructor() {
  }

  public get canvasImageData(): ImageData {
    return this._canvasContext.getImageData(0, 0, this._width, this._height);
  }

  public ngOnInit(): void {
    const imageElement: HTMLImageElement = new Image();
    const canvasElement: HTMLCanvasElement = this.canvas.nativeElement;
    imageElement.onload = () => {

      this._width = imageElement.width;
      this._height = imageElement.height;

      canvasElement.width = this._width;
      canvasElement.height = this._height;

      const canvasContext: CanvasRenderingContext2D | null = canvasElement.getContext("2d");
      if (canvasContext === null) {
        // ¯\_(ツ)_/¯
        return;
      }
      this._canvasContext = canvasContext;
      this._canvasContext.drawImage(imageElement, 0, 0, this._width, this._height);
    };

    imageElement.crossOrigin = "Anonymous"; // To be able to write in canvas
    imageElement.src = this.imageSource;
  }

  public appendToCanvas(imgData: ImageData) {
    this._canvasContext.putImageData(imgData, 0, 0);
  }

  protected clickHandler(event: MouseEvent): void {
    const {offsetX, offsetY} = event;
    this.pointClick.emit({x: offsetX, y: this._height - offsetY});
  }

}
