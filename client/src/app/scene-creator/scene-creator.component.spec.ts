import { HttpClientModule } from "@angular/common/http";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ActivatedRoute } from "@angular/router";
import * as THREE from "three";
import { IScene } from "../../../scene-interface";
import { FreeGameCreatorService } from "../scene-creator/FreeGameCreator/free-game-creator.service";
import { SceneCreatorComponent } from "./scene-creator.component";
import { SceneRendererService } from "./scene-renderer.service";

describe("SceneCreatorComponent", () => {
  let component: SceneCreatorComponent;
  let fixture: ComponentFixture<SceneCreatorComponent>;

  class MockSceneCreatorService {
    public called: string = "";
    public onResize(): void { this.called = "onResize"; }
    public init(): void { this.called = "init"; }
  }
  const mockedService: MockSceneCreatorService = new MockSceneCreatorService();

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
      declarations: [SceneCreatorComponent],
      imports: [HttpClientModule],
      providers: [
        { provide: SceneRendererService, useValue: mockedService },
        {
          provide: ActivatedRoute, useValue: {
            params: null,
          },
        },
        { provide: FreeGameCreatorService, useValue: mockedFreeGameCreator },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
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
    expect(mockedService.called).toEqual("onResize");
  });

  it("should call onResize when windoe:resize event is happening", () => {
    window.dispatchEvent(new Event("resize"));
    expect(mockedService.called).toEqual("onResize");
  });

  it("should call the service method when ngAfterViewInit is called", () => {
    component.ngAfterViewInit();
    expect(mockedService.called).toEqual("init");
  });
});
