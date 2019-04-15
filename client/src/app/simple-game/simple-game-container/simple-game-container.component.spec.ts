import {Component, NO_ERRORS_SCHEMA} from "@angular/core";
import {async, ComponentFixture, TestBed} from "@angular/core/testing";
import {Subscription} from "rxjs";
import {AlreadyFoundDifferenceError, NoDifferenceAtPointError} from "../../../../../common/errors/services.errors";
import {getOrigin, IPoint} from "../../../../../common/model/point";
import {SocketService} from "../../socket.service";
import {CanvasTextType} from "../../util/canvas-utils";
import {ISimpleGameInteractionResponse} from "../../../../../common/model/rooms/interaction";
import {PixelData, TextType} from "../simple-game-canvas/simple-game-canvas.component";
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

  beforeEach(async(() => {
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

    it("should handle already found difference errors on original canvas", async () => {
      mockedSimpleGameService.validateDifferenceAtPoint
        .and.callFake(() => component["handleValidationErrorResponse"](AlreadyFoundDifferenceError.ALREADY_FOUND_DIFFERENCE_ERROR_MESSAGE));

      spyOn(component["originalImageComponent"], "getRawPixelData")
        .and.returnValue([]);
      spyOn(component["originalImageComponent"], "setRawPixelData");
      spyOn(component["originalImageComponent"], "drawText");

      return component["onOriginalCanvasClick"](getOrigin())
        .then(() => {
          expect(component["originalImageComponent"].getRawPixelData)
            .toHaveBeenCalled();

          expect(component["originalImageComponent"].drawText)
            .toHaveBeenCalledWith(IDENTIFICATION_ERROR_TEXT, getOrigin(), CanvasTextType.ERROR);

          expect(component["clickEnabled"]).toBeFalsy();

          jasmine.clock().tick(IDENTIFICATION_ERROR_TIMOUT_MS + 1);

          expect(component["clickEnabled"]).toBeTruthy();

          expect(component["originalImageComponent"].setRawPixelData)
            .toHaveBeenCalledWith([]);
        })
        .catch((reason: Error) => fail(reason));
    });

    it("should handle already found difference errors on modified canvas", async () => {
      mockedSimpleGameService.validateDifferenceAtPoint
        .and.callFake(() => component["handleValidationErrorResponse"](AlreadyFoundDifferenceError.ALREADY_FOUND_DIFFERENCE_ERROR_MESSAGE));

      spyOn(component["modifiedImageComponent"], "getRawPixelData")
        .and.returnValue([]);
      spyOn(component["modifiedImageComponent"], "setRawPixelData");
      spyOn(component["modifiedImageComponent"], "drawText");

      return component["onModifiedCanvasClick"](getOrigin())
        .then(() => {
          expect(component["modifiedImageComponent"].getRawPixelData)
            .toHaveBeenCalled();

          expect(component["modifiedImageComponent"].drawText)
            .toHaveBeenCalledWith(IDENTIFICATION_ERROR_TEXT, getOrigin(), CanvasTextType.ERROR);

          expect(component["clickEnabled"]).toBeFalsy();

          jasmine.clock().tick(IDENTIFICATION_ERROR_TIMOUT_MS + 1);

          expect(component["clickEnabled"]).toBeTruthy();

          expect(component["modifiedImageComponent"].setRawPixelData)
            .toHaveBeenCalledWith([]);
        })
        .catch((reason: Error) => fail(reason));
    });
  });

  describe("Should handle no difference found error", () => {

    it("should handle no difference found error on original canvas", async () => {
      mockedSimpleGameService.validateDifferenceAtPoint
        .and.callFake(() => component["handleValidationErrorResponse"](NoDifferenceAtPointError.NO_DIFFERENCE_AT_POINT_ERROR_MESSAGE));

      spyOn(component["originalImageComponent"], "getRawPixelData")
        .and.returnValue([]);
      spyOn(component["originalImageComponent"], "setRawPixelData");
      spyOn(component["originalImageComponent"], "drawText");

      return component["onOriginalCanvasClick"](getOrigin())
        .then(() => {
          expect(component["originalImageComponent"].getRawPixelData)
            .toHaveBeenCalled();

          expect(component["originalImageComponent"].drawText)
            .toHaveBeenCalledWith(IDENTIFICATION_ERROR_TEXT, getOrigin(), CanvasTextType.ERROR);

          expect(component["clickEnabled"]).toBeFalsy();

          jasmine.clock().tick(IDENTIFICATION_ERROR_TIMOUT_MS + 1);

          expect(component["clickEnabled"]).toBeTruthy();

          expect(component["originalImageComponent"].setRawPixelData)
            .toHaveBeenCalledWith([]);
        })
        .catch((reason: Error) => fail(reason));
    });

    it("should handle no difference found error on modified canvas", async () => {
      mockedSimpleGameService.validateDifferenceAtPoint
        .and.callFake(() => component["handleValidationErrorResponse"](NoDifferenceAtPointError.NO_DIFFERENCE_AT_POINT_ERROR_MESSAGE));

      spyOn(component["modifiedImageComponent"], "getRawPixelData")
        .and.returnValue([]);
      spyOn(component["modifiedImageComponent"], "setRawPixelData");
      spyOn(component["modifiedImageComponent"], "drawText");

      return component["onModifiedCanvasClick"](getOrigin())
        .then(() => {
          expect(component["modifiedImageComponent"].getRawPixelData)
            .toHaveBeenCalled();

          expect(component["modifiedImageComponent"].drawText)
            .toHaveBeenCalledWith(IDENTIFICATION_ERROR_TEXT, getOrigin(), CanvasTextType.ERROR);

          expect(component["clickEnabled"]).toBeFalsy();

          jasmine.clock().tick(IDENTIFICATION_ERROR_TIMOUT_MS + 1);

          expect(component["clickEnabled"]).toBeTruthy();

          expect(component["modifiedImageComponent"].setRawPixelData)
            .toHaveBeenCalledWith([]);

        })
        .catch((reason: Error) => fail(reason));
    });

  });

  describe("Click on valid difference", () => {

    it("should copy pixel from the original canvas to the modified on original canvas click", async () => {
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

      return component["onOriginalCanvasClick"](getOrigin())
        .then(() => {
          expect(component["originalImageComponent"].getPixels)
            .toHaveBeenCalledWith([getOrigin()]);
          expect(component["modifiedImageComponent"].drawPixels)
            .toHaveBeenCalledWith(expectedValue);
        })
        .catch((reason: Error) => fail(reason));
    });

    it("should copy pixel from the original canvas to the modified on modified canvas click", async () => {
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

      return component["onModifiedCanvasClick"](getOrigin())
        .then(() => {
          expect(component["originalImageComponent"].getPixels)
            .toHaveBeenCalledWith([getOrigin()]);
          expect(component["modifiedImageComponent"].drawPixels)
            .toHaveBeenCalledWith(expectedValue);
        })
        .catch((reason: Error) => fail(reason));
    });

  });

  it("should not allow a user to click for a second after another click where there was no differences", (done) => {
    mockedSimpleGameService.validateDifferenceAtPoint
      .and.callFake(() => component["handleValidationErrorResponse"](NoDifferenceAtPointError.NO_DIFFERENCE_AT_POINT_ERROR_MESSAGE));

    component["onModifiedCanvasClick"](getOrigin())
      .then(() => {
        const secondClickPoint: IPoint = {x: 1, y: 1};
        component["onModifiedCanvasClick"](secondClickPoint)
          .then(() => {
            expect(mockedSimpleGameService.validateDifferenceAtPoint)
              .not.toHaveBeenCalledWith(secondClickPoint);

            done();
          })
          .catch((reason: Error) => fail(reason));
      })
      .catch((reason: Error) => fail(reason));
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });
});
