import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MatDialog, } from "@angular/material";
import { Router } from "@angular/router";
import {SocketService} from "../../socket.service";
import {GameButtonOptions} from "./game-button-enum";
import { GameComponent } from "./game.component";

const navigateMock: Function = () => {
  return {catch: (fn: () => void) => fn()};
};

describe("GameComponent", () => {
  let component: GameComponent;
  let fixture: ComponentFixture<GameComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ GameComponent ],
      providers: [
         { provide: Router, useClass: class { public navigate: Function = navigateMock; } },
         { provide: MatDialog, useValue: {
           open: () => {/**/},
         },
         },
         SocketService,
       ],
    });
    fixture = TestBed.createComponent(GameComponent);
    component = fixture.componentInstance;
    component["navigatePlayView"] = () => {/**/};
    component["navigateFreeView"] = () => {/**/};
    component["navigateAwait"] = () => {/**/};
  });

  it("should create", () => {
    expect(component).toBeDefined();
  });

  it("should play in a new gameroom", () => {
    component.leftButton = GameButtonOptions.PLAY;
    const spy: jasmine.Spy = spyOn(component["roomService"], "createRoom");
    component["leftButtonClick"]();
    expect(spy).toHaveBeenCalled();
  });

  it("should open delete dialog", () => {
    component.leftButton = GameButtonOptions.DELETE;
    spyOn(component["dialog"], "open");
    component["leftButtonClick"]();
    expect(component["dialog"].open).toHaveBeenCalled();
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
    const spy: jasmine.Spy = spyOn(component["roomService"], "createRoom");
    component["rightButtonClick"]();
    expect(spy).toHaveBeenCalled();
  });

  it("should joni a gameroom", () => {
    component.rightButton = GameButtonOptions.JOIN;
    const spy: jasmine.Spy = spyOn(component["roomService"], "checkInRoom");
    component["rightButtonClick"]();
    expect(spy).toHaveBeenCalled();
  });

});
