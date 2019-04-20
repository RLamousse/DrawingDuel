import {ComponentFixture, TestBed} from "@angular/core/testing";
import {MatCardModule, MatDialog} from "@angular/material";
import {Router} from "@angular/router";
import {RoomService} from "../../room.service";
import {GameButtonOptions} from "./game-button-enum";
import {GameComponent} from "./game.component";

const navigateMock: Function = () => {
  return {catch: (fn: () => void) => fn()};
};

describe("GameComponent", () => {
  let roomServiceSpy: jasmine.SpyObj<RoomService>;
  let component: GameComponent;
  let fixture: ComponentFixture<GameComponent>;
  const mockTime1: number = 0.01;
  const mockTime2: number = 1;
  const mockTime3: number = 3.53;

  beforeEach(() => {
    roomServiceSpy = jasmine.createSpyObj("RoomService", ["createRoom", "checkInRoom", "unsubscribe"]);
    roomServiceSpy.createRoom.and.returnValue(Promise.resolve());
    roomServiceSpy.checkInRoom.and.returnValue(Promise.resolve());
    TestBed.configureTestingModule(
      {
        declarations: [GameComponent],
        imports: [MatCardModule],
        providers: [
          {
            provide: Router, useClass: class {
              public navigate: Function = navigateMock;
            },
          },
          {
            provide: MatDialog, useValue: {
              open: () => {/**/
              },
            },
          },
          {
            provide: RoomService, useValue: roomServiceSpy,
          },
        ],
    });
    fixture = TestBed.createComponent(GameComponent);
    component = fixture.componentInstance;
    component["navigateAwait"] = () => {/**/};
  });

  it("should create", () => {
    expect(component).toBeDefined();
  });

  it("should play in a new gameroom", () => {
    component.leftButton = GameButtonOptions.PLAY;
    component["leftButtonClick"]();
    expect(roomServiceSpy.createRoom).toHaveBeenCalled();
  });

  it("should open reinitialize dialog", () => {
    component.rightButton = GameButtonOptions.REINITIALIZE;
    spyOn(component["dialog"], "open").and.returnValue(
      {
        afterClosed: () => {
          return {
            subscribe: (fn: Function) => {
              //
            },
          };
        },
      },
    );
    component["rightButtonClick"]();
    expect(component["dialog"].open).toHaveBeenCalled();
  });

  it("should create a new gameroom", () => {
    component.rightButton = GameButtonOptions.CREATE;
    component["rightButtonClick"]();
    expect(roomServiceSpy.createRoom).toHaveBeenCalled();
  });

  it("should joni a gameroom", () => {
    component.rightButton = GameButtonOptions.JOIN;
    component["rightButtonClick"]();
    expect(roomServiceSpy.checkInRoom).toHaveBeenCalled();
  });

  it("should have the right time format for the game view", () => {
    expect(component["formatTime"](mockTime1)).toEqual("0:01");
    expect(component["formatTime"](mockTime2)).toEqual("1:00");
    expect(component["formatTime"](mockTime3)).toEqual("3:53");
  });

});
