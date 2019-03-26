import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { EndGameNotifComponent } from "./end-game-notif.component";

describe("EndGameNotifComponent", () => {
  let component: EndGameNotifComponent;
  let fixture: ComponentFixture<EndGameNotifComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EndGameNotifComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EndGameNotifComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
