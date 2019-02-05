import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { GameComponent } from './game/game.component'
import { GameListComponent } from "./game-list.component";
import { HttpClientModule } from "@angular/common/http";

describe("GameListComponent", () => {
  let component: GameListComponent;
  let fixture: ComponentFixture<GameListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GameListComponent, GameComponent ],
      imports:[HttpClientModule],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GameListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
