import {ElementRef} from "@angular/core";
import {ComponentCanvasError} from "../../../common/errors/component.errors";
import {IPoint} from "../../../common/model/point";
import {DEFAULT_TEXT_COLOR, ERROR_TEXT_COLOR, TextType, VICTORY_TEXT_COLOR} from "./scene-creator/scene-creator.component";

export const getCanvasRenderingContext = (canvasElement: ElementRef) => {
  const canvasContext: CanvasRenderingContext2D | null = canvasElement.nativeElement.getContext("2d");
  if (canvasContext === null) {
    throw new ComponentCanvasError();
  }

  return canvasContext;
};

export const drawTextOnCanvas:
  (text: string, position: IPoint, canvasContext: CanvasRenderingContext2D, textType?: TextType) => void =
  (text: string, position: IPoint, canvasContext: CanvasRenderingContext2D, textType?: TextType): void => {
    switch (textType) {
      case TextType.ERROR:
        canvasContext.fillStyle = ERROR_TEXT_COLOR;
        canvasContext.strokeText(text, position.x, position.y);
        break;
      case TextType.VICTORY:
        canvasContext.fillStyle = VICTORY_TEXT_COLOR;
        break;
      default:
        canvasContext.fillStyle = DEFAULT_TEXT_COLOR;
        break;
    }
    canvasContext.fillText(text, position.x, position.y);
  };
