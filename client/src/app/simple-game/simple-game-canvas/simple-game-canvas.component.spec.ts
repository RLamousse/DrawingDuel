import {async, ComponentFixture, TestBed} from "@angular/core/testing";
import {By} from "@angular/platform-browser";
import {ComponentCanvasError} from "../../../../../common/errors/component.errors";
import {inverseY, IPoint, ORIGIN} from "../../../../../common/model/point";
import {createArray} from "../../../../../common/util/util";

import {
  DEFAULT_CANVAS_HEIGHT, DEFAULT_TEXT_COLOR, ERROR_TEXT_COLOR,
  IMAGE_DATA_PIXEL_LENGTH,
  PixelData,
  SimpleGameCanvasComponent,
  TextType, VICTORY_TEXT_COLOR
} from "./simple-game-canvas.component";

describe("SimpleGameCanvasComponent", () => {
  // tslint:disable-next-line:no-magic-numbers 0xFF for pixel channels values
  const RED_PIXEL: number[] = Array.of(0xFF, 0, 0, 0xFF);
  // tslint:disable-next-line:no-magic-numbers 0xFF for pixel channels values
  const WHITE_PIXEL: number[] = Array.of(0xFF, 0xFF, 0xFF, 0xFF);

  let component: SimpleGameCanvasComponent;
  let fixture: ComponentFixture<SimpleGameCanvasComponent>;

  const getCanvasContext: () => CanvasRenderingContext2D = () => {
    const gameCanvasComponentElement: HTMLElement = fixture.nativeElement;
    const canvas: HTMLCanvasElement | null = gameCanvasComponentElement.querySelector("canvas");
    if (canvas === null) {
      fail();
      throw new ComponentCanvasError();
    }
    const context: CanvasRenderingContext2D | null = canvas.getContext("2d");
    if (context === null) {
      fail();
      throw new ComponentCanvasError();
    }

    return context;
  };

  const createImageData: (pixel: number[], width: number, height: number) => ImageData =
    (pixel: number[], width: number, height: number) => {
      let pixelArray: number[] = [];
      for (let i: number = 0; i < width * height; i++) {
        pixelArray = pixelArray.concat(pixel);
      }

      return new ImageData(new Uint8ClampedArray(pixelArray), width, height);
    };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SimpleGameCanvasComponent ],
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SimpleGameCanvasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should return the correct pixels", () => {
    const context: CanvasRenderingContext2D = getCanvasContext();
    context.putImageData(createImageData(RED_PIXEL, 1, 1), 0, 0);

    component["_width"] = 1;
    component["_height"] = 1;
    component["_canvasContext"] = context;

    const actualPixels: PixelData[] = component.getPixels([ORIGIN]);
    expect(actualPixels)
      .toEqual(
        [
          {
            coords: ORIGIN,
            data: new Uint8ClampedArray(RED_PIXEL),
          },
        ]);
  });

  it("should return every pixel", () => {
    const sideLength: number = 10;
    // tslint:disable-next-line:no-magic-numbers 0xFF for pixel channels values
    const expectedPixels: Uint8ClampedArray = new Uint8ClampedArray(createArray(sideLength * sideLength * IMAGE_DATA_PIXEL_LENGTH, 0xFF));
    const context: CanvasRenderingContext2D = getCanvasContext();
    // tslint:disable-next-line:no-magic-numbers 10x10 pixel grid for tests
    context.putImageData(createImageData(WHITE_PIXEL, sideLength, sideLength), 0, 0);

    component["_width"] = sideLength;
    component["_height"] = sideLength;
    component["_canvasContext"] = context;

    const actualPixels: Uint8ClampedArray = component.getRawPixelData();
    expect(actualPixels).toEqual(expectedPixels);
  });

  it("should set the pixels of canvas from raw data", () => {
    const sideLength: number = 10;
    // tslint:disable-next-line:no-magic-numbers 0xFF for pixel channels values
    const expectedPixels: Uint8ClampedArray = new Uint8ClampedArray(createArray(sideLength * sideLength * IMAGE_DATA_PIXEL_LENGTH, 0xFF));
    const context: CanvasRenderingContext2D = getCanvasContext();

    component["_width"] = sideLength;
    component["_height"] = sideLength;
    component["_canvasContext"] = context;

    component.setRawPixelData(expectedPixels);
    expect(context.getImageData(0, 0, sideLength, sideLength).data)
      .toEqual(expectedPixels);
  });

  it("should draw given pixels successfully", () => {
    const context: CanvasRenderingContext2D = getCanvasContext();

    component["_width"] = 1;
    component["_height"] = 1;
    component["_canvasContext"] = context;

    component.drawPixels(
      [
        {
          coords: ORIGIN,
          data: new Uint8ClampedArray(RED_PIXEL),
        },
      ]);
    expect(context.getImageData(0, 0, 1, 1).data)
      .toEqual(new Uint8ClampedArray(RED_PIXEL));
  });

  it("should emit a click event on click", () => {
    const point: IPoint = ORIGIN;

    component["_height"] = DEFAULT_CANVAS_HEIGHT;

    component.pointClick
      .subscribe((event: IPoint) => {
        expect(event)
          .toEqual(inverseY(point, DEFAULT_CANVAS_HEIGHT));
      });

    fixture.debugElement.query(By.css("canvas"))
      .triggerEventHandler("click", {
        offsetX: point.x,
        offsetY: point.y,
      });
  });

  it("should load an image with a given URL", (done) => {
    component.imageSource = "assets/images/placeholder.png";
    component.ngOnInit();
    spyOn(getCanvasContext(), "drawImage")
      .and.callFake(() => {
      expect(component.height).toEqual(DEFAULT_CANVAS_HEIGHT);

      return done();
    });
  });

  it("should draw error text on canvas", () => {
    const sideLength: number = 10;
    const expectedText: string = "Error";
    const context: CanvasRenderingContext2D = getCanvasContext();
    // tslint:disable-next-line:no-magic-numbers 10x10 pixel grid for tests
    context.putImageData(createImageData(WHITE_PIXEL, sideLength, sideLength), 0, 0);

    component["_width"] = sideLength;
    component["_height"] = sideLength;
    component["_canvasContext"] = context;

    spyOn(component["_canvasContext"], "strokeText");
    spyOn(component["_canvasContext"], "fillText");

    component.drawText(expectedText, ORIGIN, TextType.ERROR);

    expect(component["_canvasContext"].fillStyle).toEqual(ERROR_TEXT_COLOR);
    expect(component["_canvasContext"].strokeText).toHaveBeenCalledWith(expectedText, ORIGIN.x, ORIGIN.y);
    expect(component["_canvasContext"].fillText).toHaveBeenCalledWith(expectedText, ORIGIN.x, ORIGIN.y);
  });

  it("should draw victory text on canvas", () => {
    const sideLength: number = 10;
    const expectedText: string = "epic victory royale";
    const context: CanvasRenderingContext2D = getCanvasContext();
    // tslint:disable-next-line:no-magic-numbers 10x10 pixel grid for tests
    context.putImageData(createImageData(WHITE_PIXEL, sideLength, sideLength), 0, 0);

    component["_width"] = sideLength;
    component["_height"] = sideLength;
    component["_canvasContext"] = context;
    spyOn(context, "fillText");

    component.drawText(expectedText, ORIGIN, TextType.VICTORY);

    expect(context.fillStyle).toEqual(VICTORY_TEXT_COLOR);
    expect(context.fillText).toHaveBeenCalledWith(expectedText, ORIGIN.x, ORIGIN.y);
  });

  it("should draw black text when textType is not defined", () => {
    const sideLength: number = 10;
    const expectedText: string = "epic victory royale";
    const context: CanvasRenderingContext2D = getCanvasContext();
    // tslint:disable-next-line:no-magic-numbers 10x10 pixel grid for tests
    context.putImageData(createImageData(WHITE_PIXEL, sideLength, sideLength), 0, 0);

    component["_width"] = sideLength;
    component["_height"] = sideLength;
    component["_canvasContext"] = context;
    spyOn(context, "fillText");

    component.drawText(expectedText, ORIGIN);

    expect(context.fillStyle).toEqual(DEFAULT_TEXT_COLOR);
    expect(context.fillText).toHaveBeenCalledWith(expectedText, ORIGIN.x, ORIGIN.y);
  });
});
