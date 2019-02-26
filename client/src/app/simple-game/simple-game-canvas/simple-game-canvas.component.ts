import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from "@angular/core";
import {IPoint} from "../../../../../common/model/point";

export interface PixelData {
  coords: IPoint;
  data: Uint8ClampedArray;
}

export const IMAGE_DATA_PIXEL_LENGTH: number = 4;
export const DEFAULT_CANVAS_HEIGHT: number = 480;
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
  private _height: number = DEFAULT_CANVAS_HEIGHT;

  public get height(): number {
    return this._height;
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

  public getPixels(points: IPoint[]): PixelData[] {
    const canvasData: Uint8ClampedArray = this._canvasContext.getImageData(0, 0, this._width, this._height).data;

    return points.map((point: IPoint) => {
      const pixelStartIndex: number = this.getPixelStartIndex(point);

      return {
        coords: point,
        data: canvasData.slice(pixelStartIndex, pixelStartIndex + IMAGE_DATA_PIXEL_LENGTH),
      } as PixelData;
    });
  }

  public drawPixels(pixels: PixelData[]): void {
    const imageData: ImageData = this._canvasContext.getImageData(0, 0, this._width, this._height);

    for (const pixel of pixels) {
      const pixelStartIndex: number = this.getPixelStartIndex(pixel.coords);
      for (let i: number = 0; i < IMAGE_DATA_PIXEL_LENGTH; i++) {
        imageData.data[pixelStartIndex + i] = pixel.data[i];
      }
    }

    this._canvasContext.putImageData(imageData, 0, 0);
  }

  protected clickHandler(event: MouseEvent): void {
    const {offsetX, offsetY} = event;
    this.pointClick.emit({x: offsetX, y: this._height - offsetY});
  }

  private getPixelStartIndex(point: IPoint): number {
    return IMAGE_DATA_PIXEL_LENGTH * (point.y * this._width + point.x);
  }
}
