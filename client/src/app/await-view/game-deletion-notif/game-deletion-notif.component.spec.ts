import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import {MatDialogModule, MatDialogRef, MAT_DIALOG_DATA} from "@angular/material/dialog";
import { GameDeletionNotifComponent } from "./game-deletion-notif.component";

describe("GameDeletionNotifComponent", () => {
  let component: GameDeletionNotifComponent;
  let fixture: ComponentFixture<GameDeletionNotifComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GameDeletionNotifComponent ],
      imports: [ MatDialogModule],
      providers: [{provide: MatDialogRef, useValue: {}},
                  {provide: MAT_DIALOG_DATA, useValue: {}, } ],
    });
    fixture = TestBed.createComponent(GameDeletionNotifComponent);
    component = fixture.componentInstance;
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GameDeletionNotifComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
