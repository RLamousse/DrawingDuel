import { HttpClientModule } from "@angular/common/http";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FormsModule } from "@angular/forms";
import { Observable } from "rxjs";
import { Game } from "../../../../common/Object/game";
import { GameService } from "../game.service";
import { GameListComponent } from "./game-list.component";

describe("GameListComponent", () => {
  let component: GameListComponent;
  let fixture: ComponentFixture<GameListComponent>;

  class MockGameService {
    private mockedGames: Game[] = [];
    public getGames(): Observable<Game[]> {
      return Observable.create(this.mockedGames);
    }
  }

  const mockedGameService: MockGameService = new MockGameService();

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GameListComponent],
      imports: [HttpClientModule, FormsModule ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [{provide: GameService, useValue: mockedGameService} ],
    });
    fixture = TestBed.createComponent(GameListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
