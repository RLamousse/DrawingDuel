import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import {MatDialogModule, MatDialogRef, MAT_DIALOG_DATA} from "@angular/material/dialog";
import { Router } from "@angular/router";
import { CompteurDiffComponent } from "../compteur-diff/compteur-diff.component";
import { EndGameNotifComponent } from "../compteur-diff/end-game-notif/end-game-notif.component";
import {SocketService} from "../socket.service";
import { TimerComponent } from "./timer.component";

describe("TimerComponent", () => {
  let component: TimerComponent;
  let fixture: ComponentFixture<TimerComponent>;

  beforeEach(async(async () => {
    return TestBed.configureTestingModule({
      declarations: [ TimerComponent, CompteurDiffComponent, EndGameNotifComponent],
      imports: [MatDialogModule],
      providers: [{ provide: Router, useClass: class { public navigate: jasmine.Spy = jasmine.createSpy("navigate"); } },
                  {provide: MatDialogRef, useValue: {}},
                  {provide: MAT_DIALOG_DATA, useValue: {}, },
                  SocketService ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
