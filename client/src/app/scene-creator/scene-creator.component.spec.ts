import {ComponentFixture, TestBed} from "@angular/core/testing";
import {ActivatedRoute} from "@angular/router";
import {of, Observable} from "rxjs";
import * as THREE from "three";
import {IJson3DObject} from "../../../../common/free-game-json-interface/JSONInterface/IScenesJSON";
import {IFreeGame} from "../../../../common/model/game/free-game";
import {CompteurDiffComponent} from "../compteur-diff/compteur-diff.component";
import {GameService} from "../game.service";
import {IScene} from "../scene-interface";
import {TimerComponent} from "../timer/timer.component";
import {FreeGameCreatorService} from "./FreeGameCreator/free-game-creator.service";
import {SceneCreatorComponent} from "./scene-creator.component";
import {SceneRendererService} from "./scene-renderer.service";

describe("SceneCreatorComponent", () => {
  let component: SceneCreatorComponent;
  let fixture: ComponentFixture<SceneCreatorComponent>;

  class MockSceneCreatorService {
    public initCalled: string = "";
    public objDiffCalled: string = "";

    public init(): void {
      this.initCalled = "init";
    }

    public loadScenes(): void {
      return;
    }

    public objDiffValidation(): Promise<IJson3DObject> {
      return new Promise<IJson3DObject>(() => {
        this.objDiffCalled = "objDiffValidation";
      });
    }
  }

  let mockSceneCreatorService: MockSceneCreatorService;

  class MockFreeGameCreatorService {
    public isCalled: boolean = false;

    public createScenes(): IScene {
      this.isCalled = true;

      return {scene: new THREE.Scene(), modifiedScene: new THREE.Scene()};
    }
  }

  let mockFreeGameCreatorService: MockFreeGameCreatorService;

  // Mocked services classes are acceptable for tests  https://angular.io/guide/testing#nested-component-tests
  // tslint:disable-next-line:max-classes-per-file
  class MockGameService {
    public called: boolean = false;
    private mockGame: IFreeGame = {
      bestMultiTimes: [],
      bestSoloTimes: [],
      gameName: "TEST",
      scenes: {modifiedObjects: [], originalObjects: [], differentObjects: []},
    };

    public getFreeGameByName(): Observable<IFreeGame> {
      this.called = true;

      return of(this.mockGame);
    }
  }

  let mockedGameService: MockGameService;

  beforeEach(() => {
    mockSceneCreatorService = new MockSceneCreatorService();
    mockFreeGameCreatorService = new MockFreeGameCreatorService();
    mockedGameService = new MockGameService();
    TestBed.configureTestingModule(
      {
        providers: [
          {provide: SceneRendererService, useValue: mockSceneCreatorService},
          {
            provide: ActivatedRoute,
            useValue: {
              queryParams: {
                subscribe: (fn: (queryParams: string) => void) => fn(
                  // pour donner un "parametre" au subscribe
                  "3d-view?gameName=freeGame100"),
              },
            },
          },
          {provide: GameService, useValue: mockedGameService},
          {provide: FreeGameCreatorService, useValue: mockFreeGameCreatorService},

        ],
        declarations: [SceneCreatorComponent, TimerComponent, CompteurDiffComponent],

      });

    fixture = TestBed.createComponent(SceneCreatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should have the right value inside each mockService after created", () => {
    expect(mockSceneCreatorService.initCalled).toEqual("init");
    expect(mockFreeGameCreatorService.isCalled).toEqual(true);
    expect(mockedGameService.called).toEqual(true);
  });

  //
});
