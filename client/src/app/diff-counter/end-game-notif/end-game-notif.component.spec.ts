import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import {MatDialogModule, MatDialogRef, MAT_DIALOG_DATA} from "@angular/material/dialog";
import { EndGameNotifComponent } from "./end-game-notif.component";

describe("EndGameNotifComponent", () => {
  let component: EndGameNotifComponent;
  let fixture: ComponentFixture<EndGameNotifComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EndGameNotifComponent ],
      imports: [ MatDialogModule],
      providers: [{provide: MatDialogRef, useValue: {}},
                  {provide: MAT_DIALOG_DATA, useValue: {}}, ],
    });
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
