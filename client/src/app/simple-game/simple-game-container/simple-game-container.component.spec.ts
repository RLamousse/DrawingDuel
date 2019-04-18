import {Component, NO_ERRORS_SCHEMA} from "@angular/core";
import {ComponentFixture, TestBed} from "@angular/core/testing";
import {Subscription} from "rxjs";
import {AlreadyFoundDifferenceError, NoDifferenceAtPointError} from "../../../../../common/errors/services.errors";
import {getOrigin, IPoint} from "../../../../../common/model/point";
import {ISimpleGameInteractionResponse} from "../../../../../common/model/rooms/interaction";
import {CanvasTextType} from "../../util/canvas-utils";
import {PixelData} from "../simple-game-canvas/simple-game-canvas.component";
import {SimpleGameService} from "../simple-game.service";
import {IDENTIFICATION_ERROR_TEXT, IDENTIFICATION_ERROR_TIMOUT_MS, SimpleGameContainerComponent} from "./simple-game-container.component";

describe("SimpleGameContainerComponent", () => {

  let component: SimpleGameContainerComponent;
  let fixture: ComponentFixture<SimpleGameContainerComponent>;
  let mockedSimpleGameService: jasmine.SpyObj<SimpleGameService>;

  const pixelOfCanvas: PixelData = {
    coords: getOrigin(),
    data: new Uint8ClampedArray(Array.of(0, 0, 0, 0)),
  };

  @Component({selector: "app-simple-game-canvas", template: ""})
  class SimpleGameCanvasStubComponent {
    public getPixels(points: IPoint[]): PixelData[] {
      return [pixelOfCanvas];
    }

    public drawPixels(pixels: PixelData[]): void {
      return;
    }

    public getRawPixelData(): Uint8ClampedArray {
      return new Uint8ClampedArray(0);
    }

    public setRawPixelData(pixelData: Uint8ClampedArray): void {
      return;
    }

    public drawText(text: string, position: IPoint, textType?: CanvasTextType): void {
      return;
    }

    public get height(): number {
      return 0;
    }
  }

  beforeEach((() => {
    mockedSimpleGameService = jasmine.createSpyObj(
      "SimpleGameService",
      [
        "validateDifferenceAtPoint",
        "registerDifferenceSuccessCallback",
        "registerDifferenceErrorCallback",
        "updateCounter",
      ],
    );

    mockedSimpleGameService.registerDifferenceSuccessCallback
      .and.returnValue(new Subscription());

    mockedSimpleGameService.registerDifferenceErrorCallback
      .and.returnValue(new Subscription());

    TestBed.configureTestingModule(
      {
        declarations: [SimpleGameContainerComponent, SimpleGameCanvasStubComponent],
        providers: [
          {provide: SimpleGameService, useValue: mockedSimpleGameService},
        ],
        schemas: [NO_ERRORS_SCHEMA],
      });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SimpleGameContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    jasmine.clock().install();
  });

  beforeEach(() => {
    component["successSubscription"] = new Subscription();
    component["errorSubscription"] = new Subscription();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  describe("Should handle already found difference errors", () => {

    it("should handle already found difference errors on original canvas", () => {
      mockedSimpleGameService.validateDifferenceAtPoint
        .and.callFake(() => component["handleValidationErrorResponse"](AlreadyFoundDifferenceError.ALREADY_FOUND_DIFFERENCE_ERROR_MESSAGE));

      spyOn(component["originalImageComponent"], "getRawPixelData")
        .and.returnValue([]);
      spyOn(component["originalImageComponent"], "setRawPixelData");
      spyOn(component["originalImageComponent"], "drawText");

      component["onOriginalCanvasClick"](getOrigin());
      expect(component["originalImageComponent"].getRawPixelData)
            .toHaveBeenCalled();

      expect(component["originalImageComponent"].drawText)
            .toHaveBeenCalledWith(IDENTIFICATION_ERROR_TEXT, getOrigin(), CanvasTextType.ERROR);

      expect(component["clickEnabled"]).toBeFalsy();

      jasmine.clock().tick(IDENTIFICATION_ERROR_TIMOUT_MS + 1);

      expect(component["clickEnabled"]).toBeTruthy();

      expect(component["originalImageComponent"].setRawPixelData);
    });

    it("should handle already found difference errors on modified canvas", () => {
      mockedSimpleGameService.validateDifferenceAtPoint
        .and.callFake(() => component["handleValidationErrorResponse"](AlreadyFoundDifferenceError.ALREADY_FOUND_DIFFERENCE_ERROR_MESSAGE));

      spyOn(component["modifiedImageComponent"], "getRawPixelData")
        .and.returnValue([]);
      spyOn(component["modifiedImageComponent"], "setRawPixelData");
      spyOn(component["modifiedImageComponent"], "drawText");

      component["onModifiedCanvasClick"](getOrigin());
      expect(component["modifiedImageComponent"].getRawPixelData)
            .toHaveBeenCalled();

      expect(component["modifiedImageComponent"].drawText)
            .toHaveBeenCalledWith(IDENTIFICATION_ERROR_TEXT, getOrigin(), CanvasTextType.ERROR);

      expect(component["clickEnabled"]).toBeFalsy();

      jasmine.clock().tick(IDENTIFICATION_ERROR_TIMOUT_MS + 1);

      expect(component["clickEnabled"]).toBeTruthy();

      expect(component["modifiedImageComponent"].setRawPixelData)
            .toHaveBeenCalledWith([]);

    });
  });

  describe("Should handle no difference found error", () => {

    it("should handle no difference found error on original canvas", () => {
      mockedSimpleGameService.validateDifferenceAtPoint
        .and.callFake(() => component["handleValidationErrorResponse"](NoDifferenceAtPointError.NO_DIFFERENCE_AT_POINT_ERROR_MESSAGE));

      spyOn(component["originalImageComponent"], "getRawPixelData")
        .and.returnValue([]);
      spyOn(component["originalImageComponent"], "setRawPixelData");
      spyOn(component["originalImageComponent"], "drawText");

      component["onOriginalCanvasClick"](getOrigin());
      expect(component["originalImageComponent"].getRawPixelData)
            .toHaveBeenCalled();

      expect(component["originalImageComponent"].drawText)
            .toHaveBeenCalledWith(IDENTIFICATION_ERROR_TEXT, getOrigin(), CanvasTextType.ERROR);

      expect(component["clickEnabled"]).toBeFalsy();

      jasmine.clock().tick(IDENTIFICATION_ERROR_TIMOUT_MS + 1);

      expect(component["clickEnabled"]).toBeTruthy();

      expect(component["originalImageComponent"].setRawPixelData)
            .toHaveBeenCalledWith([]);
    });

    it("should handle no difference found error on modified canvas", () => {
      mockedSimpleGameService.validateDifferenceAtPoint
        .and.callFake(() => component["handleValidationErrorResponse"](NoDifferenceAtPointError.NO_DIFFERENCE_AT_POINT_ERROR_MESSAGE));

      spyOn(component["modifiedImageComponent"], "getRawPixelData")
        .and.returnValue([]);
      spyOn(component["modifiedImageComponent"], "setRawPixelData");
      spyOn(component["modifiedImageComponent"], "drawText");

      component["onModifiedCanvasClick"](getOrigin());
      expect(component["modifiedImageComponent"].getRawPixelData)
            .toHaveBeenCalled();

      expect(component["modifiedImageComponent"].drawText)
            .toHaveBeenCalledWith(IDENTIFICATION_ERROR_TEXT, getOrigin(), CanvasTextType.ERROR);

      expect(component["clickEnabled"]).toBeFalsy();

      jasmine.clock().tick(IDENTIFICATION_ERROR_TIMOUT_MS + 1);

      expect(component["clickEnabled"]).toBeTruthy();

      expect(component["modifiedImageComponent"].setRawPixelData)
            .toHaveBeenCalledWith([]);

    });

  });

  describe("Click on valid difference", () => {

    it("should copy pixel from the original canvas to the modified on original canvas click", () => {
      const expectedValue: PixelData[] = [{coords: getOrigin(), data: new Uint8ClampedArray(0)}];
      const interactionResponse: ISimpleGameInteractionResponse = {
        initiatedBy: "Max",
        differenceCluster: [0, [getOrigin()]],
      };

      mockedSimpleGameService.validateDifferenceAtPoint
        .and.callFake(() => component["handleValidationSuccessResponse"](interactionResponse));

      spyOn(component["originalImageComponent"], "getPixels")
        .and.returnValue(expectedValue);
      spyOn(component["modifiedImageComponent"], "drawPixels");

      component["onOriginalCanvasClick"](getOrigin());
      expect(component["originalImageComponent"].getPixels)
            .toHaveBeenCalledWith([getOrigin()]);
      expect(component["modifiedImageComponent"].drawPixels)
            .toHaveBeenCalledWith(expectedValue);

    });

    it("should copy pixel from the original canvas to the modified on modified canvas click", () => {
      const expectedValue: PixelData[] = [{coords: getOrigin(), data: new Uint8ClampedArray(0)}];
      const interactionResponse: ISimpleGameInteractionResponse = {
        initiatedBy: "Max",
        differenceCluster: [0, [getOrigin()]],
      };

      mockedSimpleGameService.validateDifferenceAtPoint
        .and.callFake(() => component["handleValidationSuccessResponse"](interactionResponse));

      spyOn(component["originalImageComponent"], "getPixels")
        .and.returnValue(expectedValue);
      spyOn(component["modifiedImageComponent"], "drawPixels");

      component["onModifiedCanvasClick"](getOrigin());
      expect(component["originalImageComponent"].getPixels)
            .toHaveBeenCalledWith([getOrigin()]);
      expect(component["modifiedImageComponent"].drawPixels)
            .toHaveBeenCalledWith(expectedValue);
    });

  });

  it("should not allow a user to click for a second after another click where there was no differences", () => {
    mockedSimpleGameService.validateDifferenceAtPoint
      .and.callFake(() => component["handleValidationErrorResponse"](NoDifferenceAtPointError.NO_DIFFERENCE_AT_POINT_ERROR_MESSAGE));

    component["onModifiedCanvasClick"](getOrigin());
    const secondClickPoint: IPoint = {x: 1, y: 1};
    component["onModifiedCanvasClick"](secondClickPoint);
    expect(mockedSimpleGameService.validateDifferenceAtPoint)
              .not.toHaveBeenCalledWith(secondClickPoint);
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });
});
