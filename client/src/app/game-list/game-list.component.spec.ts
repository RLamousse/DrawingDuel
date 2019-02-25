import {HttpClientModule} from "@angular/common/http";
import {CUSTOM_ELEMENTS_SCHEMA} from "@angular/core";
import {ComponentFixture, TestBed} from "@angular/core/testing";
import {FormsModule} from "@angular/forms";
import {Observable} from "rxjs";
import {ISimpleGame} from "../../../../common/model/game/simple-game";
import {GameService} from "../game.service";
import {GameListComponent} from "./game-list.component";
import {GameComponent} from "./game/game.component";

describe("GameListComponent", () => {
  let component: GameListComponent;
  let fixture: ComponentFixture<GameListComponent>;

  beforeEach((done) => {
    TestBed.configureTestingModule({
                                     declarations: [GameListComponent, GameComponent],
                                     imports: [HttpClientModule],
                                   });
    done();
  });

  class MockGameService {
    private mockedSimpleGames: ISimpleGame[] = [];

    public getSimpleGames(): Observable<ISimpleGame[]> {
      return Observable.create(this.mockedSimpleGames);
    }
  }

  const mockedGameService: MockGameService = new MockGameService();

  beforeEach(() => {
    TestBed.configureTestingModule({
                                     declarations: [GameListComponent],
                                     imports: [HttpClientModule, FormsModule],
                                     schemas: [CUSTOM_ELEMENTS_SCHEMA],
                                     providers: [{provide: GameService, useValue: mockedGameService}],
                                   });
    fixture = TestBed.createComponent(GameListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
