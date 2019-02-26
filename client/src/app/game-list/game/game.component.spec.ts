import { ComponentFixture, TestBed } from "@angular/core/testing";
import { Router } from "@angular/router";
import { GameComponent } from "./game.component";

describe("GameComponent", () => {
  let component: GameComponent;
  let fixture: ComponentFixture<GameComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ GameComponent ],
      providers: [
         { provide: Router, useClass: class { public navigate: jasmine.Spy = jasmine.createSpy("navigate"); } },
       ],
    });
    fixture = TestBed.createComponent(GameComponent);
    component = fixture.componentInstance;
  });

  it("should create", () => {
    expect(component).toBeDefined();
  });
});
