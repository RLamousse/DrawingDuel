import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { SimpleGameCanvasComponent } from "./simple-game-canvas.component";

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
    /*
    fixture.debugElement.query(By.css('canvas')).triggerEventHandler('click', {
                offsetX: expectedPoint.x,
                offsetY: height - expectedPoint.y,
            });
     */
    fail();
  });
});
