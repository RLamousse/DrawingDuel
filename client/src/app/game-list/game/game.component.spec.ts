import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MatCardModule, MatDialog } from "@angular/material";
import { Router } from "@angular/router";
import { GameComponent } from "./game.component";

describe("GameComponent", () => {
  let component: GameComponent;
  let fixture: ComponentFixture<GameComponent>;
  const mockTime1: number = 0.01;
  const mockTime2: number = 1;
  const mockTime3: number = 3.53;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ GameComponent ],
      imports: [MatCardModule],
      providers: [
         { provide: Router, useClass: class { public navigate: jasmine.Spy = jasmine.createSpy("navigate"); } },
         { provide: MatDialog, useValue: {}, },
       ],
    });
    fixture = TestBed.createComponent(GameComponent);
    component = fixture.componentInstance;
  });

  it("should create", () => {
    expect(component).toBeDefined();
  });

  it("should have the right time format for the game view", () => {
    expect(component["formatTime"](mockTime1)).toEqual("0:01");
    expect(component["formatTime"](mockTime2)).toEqual("1:00");
    expect(component["formatTime"](mockTime3)).toEqual("3:53");
  });

});
