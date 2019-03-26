import {ComponentFixture, TestBed} from "@angular/core/testing";
import {MatDialogModule, MatDialogRef, MAT_DIALOG_DATA} from "@angular/material/dialog";
import { ActivatedRoute, Router } from "@angular/router";
import {of, Observable} from "rxjs";
import * as THREE from "three";
import {IFreeGame} from "../../../../common/model/game/free-game";
import { DiffCounterComponent } from "../diff-counter/diff-counter.component";
import { EndGameNotifComponent } from "../diff-counter/end-game-notif/end-game-notif.component";
import {GameService} from "../game.service";
import {IScene} from "../scene-interface";
import {SocketService} from "../socket.service";
import {TimerComponent} from "../timer/timer.component";
import {FreeGameCreatorService} from "./FreeGameCreator/free-game-creator.service";
import {SceneCreatorComponent} from "./scene-creator.component";
import {SceneRendererService} from "./scene-renderer.service";

describe("SceneCreatorComponent", () => {
  let component: SceneCreatorComponent;
  let fixture: ComponentFixture<SceneCreatorComponent>;

  class MockSceneCreatorService {
    public resizedCalled: string = "";
    public initCalled: string = "";

    public onResize(): void {
      this.resizedCalled = "onResize";
    }

    public init(): void {
      this.initCalled = "init";
    }

    public loadScenes(): void {
      return;
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
      scenes: {modifiedObjects: [], originalObjects: []},
      toBeDeleted: false,
    };

    public getFreeGameByName(): Observable<IFreeGame> {
      this.called = true;

      return of(this.mockGame);
    }
  }

  let mockedGameService: MockGameService;

  // tslint:disable-next-line:max-func-body-length
  beforeEach(() => {
    mockSceneCreatorService = new MockSceneCreatorService();
    mockFreeGameCreatorService = new MockFreeGameCreatorService();
    mockedGameService = new MockGameService();
    TestBed.configureTestingModule(
      {
        providers: [
          // tslint:disable-next-line:max-classes-per-file
          { provide: Router, useClass: class { public navigate: jasmine.Spy = jasmine.createSpy("navigate"); } },
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
          // tslint:disable-next-line:max-classes-per-file
          { provide: Router, useClass: class { public navigate: jasmine.Spy = jasmine.createSpy("navigate"); } },
          {provide: MatDialogRef, useValue: {}},
          {provide: MAT_DIALOG_DATA, useValue: {}, },
          SocketService,

        ],
        imports: [MatDialogModule],
        declarations: [SceneCreatorComponent, TimerComponent, DiffCounterComponent, EndGameNotifComponent],

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
