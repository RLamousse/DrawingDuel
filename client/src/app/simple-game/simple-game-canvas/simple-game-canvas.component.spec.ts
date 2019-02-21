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
});
