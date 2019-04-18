import {Component, Input} from "@angular/core";
import {async, ComponentFixture, TestBed} from "@angular/core/testing";
import {MatDialogModule, MatDialogRef, MAT_DIALOG_DATA} from "@angular/material/dialog";
import {ActivatedRoute, Router} from "@angular/router";
import {GameType, OnlineType} from "../../../../common/model/game/game";
import {EndGameNotifComponent} from "../diff-counter/end-game-notif/end-game-notif.component";
import {SceneDiffValidatorService} from "../scene-creator/scene-diff-validator.service";
import {SocketService} from "../socket.service";
import {TimerComponent} from "./timer.component";

describe("TimerComponent", () => {
  let component: TimerComponent;
  let fixture: ComponentFixture<TimerComponent>;

  @Component({selector: "app-diff-counter", template: ""})
  class DiffCounterStubComponent {
    @Input() public gameName: string;
    @Input() public minutes: number;
    @Input() public seconds: number;
    @Input() public gameType: GameType;
  }

  // tslint:disable-next-line:max-func-body-length
  beforeEach(async(async () => {
    return TestBed.configureTestingModule(
      {
        declarations: [TimerComponent, DiffCounterStubComponent, EndGameNotifComponent],
        imports: [MatDialogModule],
        providers: [
          {
            provide: Router, useClass: class {
              public navigate: jasmine.Spy = jasmine.createSpy("navigate");
            },
          },
          {provide: MatDialogRef, useValue: {}},
          {provide: MAT_DIALOG_DATA, useValue: {}},
          {provide: SceneDiffValidatorService, useValue: {}},
          SocketService,
          {
            provide: ActivatedRoute,
            useValue: {
              queryParams: {
                subscribe: (fn: (queryParams: object) => void) => fn(
                  {
                    onlineType: OnlineType.SOLO,
                  }),
              },
            },
          },
        ],
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
