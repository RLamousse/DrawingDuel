import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { GameComponent } from "./game.component";

describe("GameComponent", () => {
  let component: GameComponent;
  let fixture: ComponentFixture<GameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GameComponent ]
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

  it("checks if it generates a number between the min and max", function () {
    let numArray: number[] = new Array(3) as number[];
    numArray = component.generateRandomScores();
    expect (numArray[0]).toBeGreaterThan(7);
    expect (numArray[1]).toBeLessThan(25);
  });

  it("checks if the array of number is sorted", function () {
    let numArray: number[] = new Array(3) as number[];
    numArray = component.generateRandomScores();
    expect (numArray[0]).toBeLessThan(numArray[1]);
    expect (numArray[1]).toBeLessThan(numArray[2]);
  });
  
  it("checks if the array of usernames is not null", function () {
    let namesArray: string[] = new Array(3) as string[];
    namesArray = component.generateRandomNames();
    expect (namesArray[0]).not.toBe("");
    expect (namesArray[1]).not.toBe("");
    expect (namesArray[2]).not.toBe("");
  });
});
