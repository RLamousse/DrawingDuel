import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import {SimpleGameCanvasComponent} from "../simple-game-canvas/simple-game-canvas.component";

import { SimpleGameContainerComponent } from "./simple-game-container.component";

describe("SimpleGameContainerComponent", () => {
  let component: SimpleGameContainerComponent;
  let fixture: ComponentFixture<SimpleGameContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
                                     declarations: [SimpleGameContainerComponent, SimpleGameCanvasComponent],
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
});
