import {async, ComponentFixture, TestBed} from "@angular/core/testing";
import {By} from "@angular/platform-browser";
import {tansformOrigin, IPoint, ORIGIN} from "../../../../../common/model/point";

import {DEFAULT_CANVAS_HEIGHT, PixelData, SimpleGameCanvasComponent} from "./simple-game-canvas.component";

describe("SimpleGameCanvasComponent", () => {
  // tslint:disable-next-line:no-magic-numbers 0xFF for pixel channels values
  const PIXEL: number[] = Array.of(0xFF, 0, 0, 0xFF);
  let component: SimpleGameCanvasComponent;
  let fixture: ComponentFixture<SimpleGameCanvasComponent>;

  const getCanvasContext: () => CanvasRenderingContext2D = () => {
    const gameCanvasComponentElement: HTMLElement = fixture.nativeElement;
    const canvas: HTMLCanvasElement | null = gameCanvasComponentElement.querySelector("canvas");
    if (canvas === null) {
      fail();
      throw new Error("Cannot get 2d canvas");
    }
    const context: CanvasRenderingContext2D | null = canvas.getContext("2d");
    if (context === null) {
      fail();
      throw new Error("Cannot get 2d canvas context");
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
    context.putImageData(createImageData(PIXEL, 1, 1), 0, 0);

    component["_width"] = 1;
    component["_height"] = 1;
    component["_canvasContext"] = context;

    const actualPixels: PixelData[] = component.getPixels([ORIGIN]);
    expect(actualPixels)
      .toEqual(
        [
          {
            coords: ORIGIN,
            data: new Uint8ClampedArray(PIXEL),
          },
        ]);
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
          data: new Uint8ClampedArray(PIXEL),
        },
      ]);
    expect(context.getImageData(0, 0, 1, 1).data)
      .toEqual(new Uint8ClampedArray(PIXEL));
  });

  it("should emit a click event on click", () => {
    const point: IPoint = ORIGIN;

    component["_height"] = DEFAULT_CANVAS_HEIGHT;

    component.pointClick
      .subscribe((event: IPoint) => {
        expect(event)
          .toEqual(tansformOrigin(point, DEFAULT_CANVAS_HEIGHT));
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
});
