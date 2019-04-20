// Empty blocks are present in mock functions that prevent real ones to be called
/* tslint:disable:no-empty */
import {CUSTOM_ELEMENTS_SCHEMA} from "@angular/core";
import {ComponentFixture, TestBed} from "@angular/core/testing";
import {FormsModule} from "@angular/forms";
import {Router, RouterModule} from "@angular/router";
import {Observable} from "rxjs";
import {Scene} from "three";
import {IFreeGame} from "../../../../common/model/game/free-game";
import {ISimpleGame} from "../../../../common/model/game/simple-game";
import {GameService} from "../game.service";
import {FreeGameCreatorService} from "../scene-creator/FreeGameCreator/free-game-creator.service";
import {FreeGamePhotoService} from "../scene-creator/free-game-photo-service/free-game-photo.service";
import {IScene} from "../scene-interface";
import {SocketService} from "../socket.service";
import {GameListComponent} from "./game-list.component";

describe("GameListComponent", () => {
  let component: GameListComponent;
  let fixture: ComponentFixture<GameListComponent>;

  class MockGameService {
    private mockedSimpleGames: ISimpleGame[] = [];
    private mockedFreeGames: IFreeGame[] = [];

    public getSimpleGamesLite(): Observable<ISimpleGame[]> {
      return new Observable((subscriber) => {
        subscriber.next(this.mockedSimpleGames);
        subscriber.complete();
      });
    }

    public getFreeGamesLite(): Observable<IFreeGame[]> {
      return new Observable((subscriber) => {
        subscriber.next(this.mockedFreeGames);
        subscriber.complete();
      });
    }

    public pushSimpleGames(games: ISimpleGame[]): void {
    }

    public async pushFreeGames(games: IFreeGame[]): Promise<void> {
    }

    public async updateFreeGameImages(): Promise<void> {
    }
  }

  const mockedGameService: MockGameService = new MockGameService();

  class MockFreeGameCreatorService {
    public isCalled: boolean = false;

    public createScenes(): IScene {
      this.isCalled = true;

      return {scene: new Scene(), modifiedScene: new Scene()};
    }
  }

  const mockedFreeGameCreator: MockFreeGameCreatorService = new MockFreeGameCreatorService();

  beforeEach(() => {
    TestBed.configureTestingModule(
      {
        declarations: [GameListComponent],
        imports: [FormsModule, RouterModule],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
        providers: [
          {provide: GameService, useValue: mockedGameService},
          {provide: Router, useValue: {} },
          FreeGamePhotoService,
          {provide: FreeGameCreatorService, useValue: mockedFreeGameCreator},
          SocketService,
        ],
      });
    fixture = TestBed.createComponent(GameListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
