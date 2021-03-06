import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from "@angular/core";
import {inverseY, IPoint} from "../../../../../common/model/point";
import {drawTextOnCanvas, getCanvasRenderingContext, CanvasTextType} from "../../util/canvas-utils";

export interface PixelData {
  coords: IPoint;
  data: Uint8ClampedArray;
}

export const IMAGE_DATA_PIXEL_LENGTH: number = 4;
export const DEFAULT_CANVAS_HEIGHT: number = 480;
export const TEXT_FONT: string = "30px Comic Sans MS";
export const ERROR_TEXT_COLOR: string = "#ff0000";
export const VICTORY_TEXT_COLOR: string = "#008000";
export const DEFAULT_TEXT_COLOR: string = "#000000";

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
      this._canvasContext = getCanvasRenderingContext(this.canvas);
      this._canvasContext.font = TEXT_FONT;
      this._canvasContext.textAlign = "center";
      this._canvasContext.strokeStyle = "black";
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

  public getRawPixelData(): Uint8ClampedArray {
    return this._canvasContext.getImageData(0, 0, this._width, this._height).data;
  }

  public setRawPixelData(pixelData: Uint8ClampedArray): void {
    this._canvasContext.putImageData(new ImageData(pixelData, this._width, this._height), 0, 0);
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

  public drawText(text: string, position: IPoint, textType?: CanvasTextType): void {
    drawTextOnCanvas(text, position, this._canvasContext, textType);
  }

  protected clickHandler(event: MouseEvent): void {
    const {offsetX, offsetY} = event;
    this.pointClick.emit(inverseY({x: offsetX, y: offsetY}, this._height));
  }

  private getPixelStartIndex(point: IPoint): number {
    return IMAGE_DATA_PIXEL_LENGTH * (point.y * this._width + point.x);
  }
}
