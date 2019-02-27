import { HttpClientModule } from "@angular/common/http";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FormsModule } from "@angular/forms";
import { Observable } from "rxjs";
import * as THREE from "three";
import { IFreeGame } from "../../../../common/model/game/free-game";
import { ISimpleGame } from "../../../../common/model/game/simple-game";
import { IScene } from "../../../scene-interface";
import { GameService } from "../game.service";
import { FreeGameCreatorService } from "../scene-creator/FreeGameCreator/free-game-creator.service";
import { FreeGamePhotoService } from "../scene-creator/free-game-photo-service/free-game-photo.service";
import { GameListComponent } from "./game-list.component";

describe("GameListComponent", () => {
  let component: GameListComponent;
  let fixture: ComponentFixture<GameListComponent>;

  class MockGameService {
    private mockedSimpleGames: ISimpleGame[] = [];
    private mockedFreeGames: IFreeGame[] = [];
    public getSimpleGames(): Observable<ISimpleGame[]> {
      return Observable.create(this.mockedSimpleGames);
    }
    public getFreeGames(): Observable<IFreeGame[]> {
      return Observable.create(this.mockedFreeGames);
    }
  }
  const mockedGameService: MockGameService = new MockGameService();

  class MockFreeGameCreatorService {
    public isCalled: boolean = false;
    public createScenes(): IScene {
      this.isCalled = true;

      return { scene: new THREE.Scene(), modifiedScene: new THREE.Scene() };
    }
  }
  const mockedFreeGameCreator: MockFreeGameCreatorService = new MockFreeGameCreatorService();

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GameListComponent],
      imports: [HttpClientModule, FormsModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: GameService, useValue: mockedGameService },
        FreeGamePhotoService,
        { provide: FreeGameCreatorService, useValue: mockedFreeGameCreator },
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
