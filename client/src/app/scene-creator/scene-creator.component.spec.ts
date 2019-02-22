import { ComponentFixture, TestBed } from "@angular/core/testing";
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

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SceneCreatorComponent],
      providers: [{ provide: SceneRendererService, useValue: mockedService }],
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
