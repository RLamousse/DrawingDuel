import {ElementRef} from "@angular/core";
import {ComponentCanvasError} from "../../../../common/errors/component.errors";
import {IPoint} from "../../../../common/model/point";

export const ERROR_TEXT_COLOR: string = "#ff0000";
export const VICTORY_TEXT_COLOR: string = "#008000";
export const DEFAULT_TEXT_COLOR: string = "#000000";

export enum CanvasTextType {
  ERROR,
  VICTORY,
}

export const getCanvasRenderingContext:
  (canvasElement: ElementRef) => CanvasRenderingContext2D =
  (canvasElement: ElementRef) => {
  const canvasContext: CanvasRenderingContext2D | null = canvasElement.nativeElement.getContext("2d");
  if (canvasContext === null) {
    throw new ComponentCanvasError();
  }

  return canvasContext;
};

export const drawTextOnCanvas:
  (text: string, position: IPoint, canvasContext: CanvasRenderingContext2D, textType?: CanvasTextType) => void =
  (text: string, position: IPoint, canvasContext: CanvasRenderingContext2D, textType?: CanvasTextType): void => {
    switch (textType) {
      case CanvasTextType.ERROR:
        canvasContext.fillStyle = ERROR_TEXT_COLOR;
        canvasContext.strokeText(text, position.x, position.y);
        break;
      case CanvasTextType.VICTORY:
        canvasContext.fillStyle = VICTORY_TEXT_COLOR;
        break;
      default:
        canvasContext.fillStyle = DEFAULT_TEXT_COLOR;
        break;
    }
    canvasContext.fillText(text, position.x, position.y);
  };
