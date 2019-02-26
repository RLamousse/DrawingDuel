import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import {By} from "@angular/platform-browser";
import {tansformOrigin, IPoint, ORIGIN} from "../../../../../common/model/point";

import {DEFAULT_CANVAS_HEIGHT, SimpleGameCanvasComponent} from "./simple-game-canvas.component";

describe("SimpleGameCanvasComponent", () => {
  let component: SimpleGameCanvasComponent;
  let fixture: ComponentFixture<SimpleGameCanvasComponent>;

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
    fail();
  });

  it("should draw given pixels successfully", () => {
    fail();
  });

  it("should emit a click event on click", () => {
    const point: IPoint = ORIGIN;

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
});
