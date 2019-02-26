import { GameService } from "../game.service";
import { FreeGameCreatorService } from "../scene-creator/FreeGameCreator/free-game-creator.service";
import { SceneRendererService } from "./scene-renderer.service";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ActivatedRoute /*, Router*/ } from "@angular/router";
import { SceneCreatorComponent } from "./scene-creator.component";
import { TimerComponent } from "../timer/timer.component";
import { IScene } from "../../../scene-interface";
import * as THREE from "three";
import { IFreeGame } from "../../../../common/model/game/free-game";
import { of, Observable } from "rxjs";

describe("SceneCreatorComponent", () => {
  let component: SceneCreatorComponent;
  let fixture: ComponentFixture<SceneCreatorComponent>;

  class MockSceneCreatorService {
    public resizedCalled: string = "";
    public initCalled: string = "";
    public onResize(): void { this.resizedCalled = "onResize"; }
    public init(): void { this.initCalled = "init"; }

    public loadScenes(): void {
      // nop
    }
  }
  let mockSceneCreatorService: MockSceneCreatorService;

  class MockFreeGameCreatorService {
    public isCalled: boolean = false;
    public createScenes(): IScene {
      this.isCalled = true;

      return { scene: new THREE.Scene(), modifiedScene: new THREE.Scene() };
    }
  }
  let mockFreeGameCreatorService: MockFreeGameCreatorService;

  class MockGameService {
    public called: boolean = false;
    private mockGame: IFreeGame = {
      bestMultiTimes: [],
      bestSoloTimes: [],
      gameName: "TEST",
      scenes: { modifiedObjects: [], originalObjects: [] },
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
    TestBed.configureTestingModule({
      providers: [
        { provide: SceneRendererService, useValue: mockSceneCreatorService },
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: {
              subscribe: (fn: (queryParams: string) => void) => fn(
                // pour donner un "parametre" au subscribe
                "3d-view?gameName=freeGame100"
              ,
              ),
            },
          }
        },
        { provide: GameService, useValue: mockedGameService },
        { provide: FreeGameCreatorService, useValue: mockFreeGameCreatorService },


      ],
      declarations: [SceneCreatorComponent, TimerComponent],

    });

    fixture = TestBed.createComponent(SceneCreatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeDefined();
  });

  it("should have the right value inside each mockService after created", () => {
    expect(mockSceneCreatorService.initCalled).toEqual("init");
    expect(mockFreeGameCreatorService.isCalled).toEqual(true);
    expect(mockedGameService.called).toEqual(true);
  });
});
