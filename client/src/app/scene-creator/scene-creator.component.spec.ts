import {HttpClientModule} from "@angular/common/http";
import {ComponentFixture, TestBed} from "@angular/core/testing";
import {ActivatedRoute, Router} from "@angular/router";
import {of, Observable} from "rxjs";
import * as THREE from "three";
import {IFreeGame} from "../../../../common/model/game/free-game";
import {IScene} from "../../../scene-interface";
import {GameService} from "../game.service";
import {TimerComponent} from "../timer/timer.component";
import {FreeGameCreatorService} from "./FreeGameCreator/free-game-creator.service";
import {SceneCreatorComponent} from "./scene-creator.component";
import {SceneRendererService} from "./scene-renderer.service";

describe("SceneCreatorComponent", () => {
  let component: SceneCreatorComponent;
  let fixture: ComponentFixture<SceneCreatorComponent>;

  class MockSceneCreatorService {
    public called: string = "";
    public onResize(): void { this.called = "onResize"; }
    public init(): void { this.called = "init"; }

    public loadScenes(): void {
      // nop
    }
  }
  const mockedRendererService: MockSceneCreatorService = new MockSceneCreatorService();

  class MockFreeGameCreatorService {
    public isCalled: boolean = false;
    public createScenes(): IScene {
      this.isCalled = true;

      return { scene: new THREE.Scene(), modifiedScene: new THREE.Scene() };
    }
  }
  const mockedFreeGameCreator: MockFreeGameCreatorService = new MockFreeGameCreatorService();

  // Mocked services classes are acceptable for tests  https://angular.io/guide/testing#nested-component-tests
  // tslint:disable-next-line:max-classes-per-file
  class MockGameService {
    private mockGame: IFreeGame = {
      bestMultiTimes: [],
      bestSoloTimes: [],
      gameName: "TEST",
      scenes: { modifiedObjects: [], originalObjects: [] },
    };
    public getFreeGameByName(): Observable<IFreeGame> {
      return of(this.mockGame);
    }
  }
  const mockedGameService: MockGameService = new MockGameService();

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SceneCreatorComponent, TimerComponent],
      imports: [HttpClientModule],
      providers: [
        { provide: SceneRendererService, useValue: mockedRendererService },
        // tslint:disable-next-line:max-classes-per-file
        { provide: Router, useClass: class { public navigate: jasmine.Spy = jasmine.createSpy("navigate"); }, },
        {
          provide: ActivatedRoute,
          useValue: {queryParams: {
            subscribe: (fn: (queryParams: string ) => void) => fn(
              // pour donner un "parametre" au subscribe
              "3d-view?gameName=freeGame100"
              ,
            ),
          },
          },
        },
        { provide: FreeGameCreatorService, useValue: mockedFreeGameCreator },
        { provide: GameService, useValue: mockedGameService },
      ],

    });
    fixture = TestBed.createComponent(SceneCreatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeDefined();
  });

  it("should call the service method when onResize is called", () => {
    component.onResize();
    expect(mockedRendererService.called).toEqual("onResize");
  });

  // it("should call onResize when windoe:resize event is happening", () => {
  //   window.dispatchEvent(new Event("resize"));
  //   expect(mockedRendererService.called).toEqual("onResize");
  // });

  it("should call the service method when ngAfterViewInit is called", () => {
    component.ngAfterViewInit();
    expect(mockedRendererService.called).toEqual("init");
  });
});
