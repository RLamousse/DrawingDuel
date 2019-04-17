import {ComponentFixture, TestBed} from "@angular/core/testing";
import {MatDialogModule, MatDialogRef, MAT_DIALOG_DATA} from "@angular/material/dialog";
import {ActivatedRoute, Router, RouterModule} from "@angular/router";
import {of, Observable, Subject} from "rxjs";
import {Scene} from "three";
import {IFreeGame} from "../../../../common/model/game/free-game";
import { DiffCounterComponent } from "../diff-counter/diff-counter.component";
import { EndGameNotifComponent } from "../diff-counter/end-game-notif/end-game-notif.component";
import {GameService} from "../game.service";
import { MessageBoxComponent } from "../message-box/message-box.component";
import {IScene} from "../scene-interface";
import {SocketService} from "../socket.service";
import {TimerComponent} from "../timer/timer.component";
import {FreeGameCreatorService} from "./FreeGameCreator/free-game-creator.service";
import {SceneCreatorComponent} from "./scene-creator.component";
import {SceneRendererService} from "./scene-renderer.service";
import {MatIconModule} from "@angular/material";

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

    public get foundDifferenceCount(): Observable<number> {
      return new Subject<number>();
    }

    public async objDiffValidation(x?: number): Promise<void> {
      this.objDiffCalled = "objDiffValidation";

      return new Promise<void>(() => {
        return;
      });
    }

    public async deactivateCheatMode(): Promise<void> {
      return Promise.resolve();
    }
  }

  let mockSceneCreatorService: MockSceneCreatorService;

  class MockFreeGameCreatorService {
    public isCalled: boolean = false;

    public createScenes(): IScene {
      this.isCalled = true;

      return {scene: new Scene(), modifiedScene: new Scene()};
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
        imports: [MatDialogModule,  RouterModule, MatIconModule],
        declarations: [SceneCreatorComponent, TimerComponent, DiffCounterComponent, EndGameNotifComponent, MessageBoxComponent],

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

  // Test onDivContClick
  it("should have call the mocked diffObjValidation function on original scene click", () => {
    const mouseEvt: MouseEvent = new MouseEvent("click", {
      button: 0,
      clientX: 325,
      clientY: 430,
    });

    component.onDivContClick(mouseEvt);
    expect(mockSceneCreatorService.objDiffCalled).toEqual("objDiffValidation");
  });
  it("should have call the mocked diffObjValidation function on modified scene click", () => {
    const mouseEvt: MouseEvent = new MouseEvent("click", {
      button: 0,
      clientX: 1120,
      clientY: 430,
    });

    component.onDivContClick(mouseEvt);
    expect(mockSceneCreatorService.objDiffCalled).toEqual("objDiffValidation");
  });
});
