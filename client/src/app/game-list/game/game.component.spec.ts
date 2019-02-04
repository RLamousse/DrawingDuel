// tslint:disable:no-magic-numbers
import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { GameComponent } from "./game.component";

describe("GameComponent", () => {
  let component: GameComponent;
  let fixture: ComponentFixture<GameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GameComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("checks if it generates a number between the min and max", () => {
    const numArray: number[] = new Array(3) as number[];
    // component.generateRandomScores(numArray);
    expect (numArray[0]).toBeGreaterThan(7);
    expect (numArray[1]).toBeLessThan(25);
  });

  it("checks if the array of number is sorted", () => {
    const numArray: number[] = new Array(3) as number[];
    // component.generateRandomScores(numArray);
    expect (numArray[0]).toBeLessThan(numArray[1]);
    expect (numArray[1]).toBeLessThan(numArray[2]);
  });
});
