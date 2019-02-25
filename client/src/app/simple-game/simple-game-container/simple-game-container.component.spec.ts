import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import {DifferenceCluster} from "../../../../../common/model/game/simple-game";
import {ORIGIN} from "../../../../../common/model/point";
import {PixelData, SimpleGameCanvasComponent} from "../simple-game-canvas/simple-game-canvas.component";
import {ALREADY_FOUND_DIFFERENCE, NO_DIFFERENCE_AT_POINT_ERROR_MESSAGE, SimpleGameService} from "../simple-game.service";

import { SimpleGameContainerComponent } from "./simple-game-container.component";

describe("SimpleGameContainerComponent", () => {

  // const CANVAS_HEIGHT: number = 480;

  let component: SimpleGameContainerComponent;
  let fixture: ComponentFixture<SimpleGameContainerComponent>;
  let mockedSimpleGameService: jasmine.SpyObj<SimpleGameService>;
  let mockedSimpleGameCanvasComponent: jasmine.SpyObj<SimpleGameCanvasComponent>;

  beforeEach(async(() => {
    mockedSimpleGameService = jasmine.createSpyObj(
      "SimpleGameService",
      ["validateDifferenceAtPoint"],
    );

    mockedSimpleGameCanvasComponent = jasmine.createSpyObj(
      "SimpleGameCanvasComponent",
      ["getPixels", "drawPixels"],
    );

    // spyOnProperty(mockedSimpleGameCanvasComponent, "height")
    //   .and.returnValue(CANVAS_HEIGHT);

    TestBed.configureTestingModule(
      {
        declarations: [SimpleGameContainerComponent, SimpleGameCanvasComponent],
        providers: [
          {provide: SimpleGameService, useValue: mockedSimpleGameService},
          {provide: SimpleGameCanvasComponent, useValue: mockedSimpleGameCanvasComponent},
        ],
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SimpleGameContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should handle already found difference errors", () => {
    mockedSimpleGameService.validateDifferenceAtPoint
      .and.callFake(() => Promise.reject(new Error(ALREADY_FOUND_DIFFERENCE)));

    expect(() => component.onCanvasClick(ORIGIN))
      .not.toThrowError(ALREADY_FOUND_DIFFERENCE);
  });

  it("should handle no difference found error", () => {
    mockedSimpleGameService.validateDifferenceAtPoint
      .and.callFake(() => Promise.reject(new Error(NO_DIFFERENCE_AT_POINT_ERROR_MESSAGE)));

    expect(() => component.onCanvasClick(ORIGIN))
      .not.toThrowError(NO_DIFFERENCE_AT_POINT_ERROR_MESSAGE);
  });

  it("should copy pixel from the original canvas to the modified", () => {
    mockedSimpleGameService.validateDifferenceAtPoint
      .and.callFake(() => Promise.resolve([0, [ORIGIN]] as DifferenceCluster));

    const pixelOfCanvas: PixelData = {
      coords: ORIGIN,
      data: new Uint8ClampedArray(Array.of(0, 0, 0, 0)),
    };

    mockedSimpleGameCanvasComponent.getPixels
      .and.returnValue([pixelOfCanvas]);

    expect(mockedSimpleGameCanvasComponent.getPixels)
    // .toHaveBeenCalledWith([{x: 0, y: CANVAS_HEIGHT} as IPoint]);
      .toHaveBeenCalled();

    expect(mockedSimpleGameCanvasComponent.getPixels)
    // .toHaveBeenCalledWith([pixelOfCanvas]);
      .toHaveBeenCalled();

    component.onCanvasClick(ORIGIN);
  });
});
