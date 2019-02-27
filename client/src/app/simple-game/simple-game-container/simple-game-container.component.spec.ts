import {Component, NO_ERRORS_SCHEMA} from "@angular/core";
import {async, ComponentFixture, TestBed} from "@angular/core/testing";
import {AlreadyFoundDifferenceError, NoDifferenceAtPointError} from "../../../../../common/errors/services.errors";
import {DifferenceCluster} from "../../../../../common/model/game/simple-game";
import {IPoint, ORIGIN} from "../../../../../common/model/point";
import {PixelData} from "../simple-game-canvas/simple-game-canvas.component";
import {SimpleGameService} from "../simple-game.service";
import {SimpleGameContainerComponent} from "./simple-game-container.component";

describe("SimpleGameContainerComponent", () => {

  let component: SimpleGameContainerComponent;
  let fixture: ComponentFixture<SimpleGameContainerComponent>;
  let mockedSimpleGameService: jasmine.SpyObj<SimpleGameService>;

  const pixelOfCanvas: PixelData = {
    coords: ORIGIN,
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
  }

  beforeEach(async(() => {
    mockedSimpleGameService = jasmine.createSpyObj(
      "SimpleGameService",
      ["validateDifferenceAtPoint"],
    );

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
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should handle already found difference errors", () => {
    mockedSimpleGameService.validateDifferenceAtPoint
      .and.callFake(async () => Promise.reject(new AlreadyFoundDifferenceError()));

    expect(() => component.onCanvasClick(ORIGIN))
      .not.toThrowError(AlreadyFoundDifferenceError.ALREADY_FOUND_DIFFERENCE_ERROR_MESSAGE);
  });

  it("should handle no difference found error", () => {
    mockedSimpleGameService.validateDifferenceAtPoint
      .and.callFake(async () => Promise.reject(new NoDifferenceAtPointError()));

    expect(() => component.onCanvasClick(ORIGIN))
      .not.toThrowError(NoDifferenceAtPointError.NO_DIFFERENCE_AT_POINT_ERROR_MESSAGE);
  });

  it("should copy pixel from the original canvas to the modified", () => {
    mockedSimpleGameService.validateDifferenceAtPoint
      .and.callFake(async () => Promise.resolve([0, [ORIGIN]] as DifferenceCluster));

    expect(() => component.onCanvasClick(ORIGIN)).not.toThrow();
  });
});
