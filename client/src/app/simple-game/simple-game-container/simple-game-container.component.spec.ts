import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { SimpleGameContainerComponent } from "./simple-game-container.component";

describe("SimpleGameContainerComponent", () => {
  let component: SimpleGameContainerComponent;
  let fixture: ComponentFixture<SimpleGameContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SimpleGameContainerComponent ],
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
