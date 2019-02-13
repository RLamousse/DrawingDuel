import { AfterViewInit, Component, ElementRef, ViewChild } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { Form3DService } from "./3DFormService/3-dform.service";
import { SceneRendererService } from "./scene-renderer.service";

describe("SceneRendererService", () => {

  @Component({
    selector: "app-scene-creator",
    template: "<div #container><p>Mocked div container</p></div>",
  })
  class MockComponent implements AfterViewInit {
    @ViewChild("container")
    private container: ElementRef;
    public resized: boolean = false;
    public cont: HTMLDivElement;
    public setContainer(): void {
      this.cont = this.container.nativeElement;
    }
    public ngAfterViewInit(): void {
      this.setContainer();
    }
  }

  let mockComponentInstance: MockComponent;
  let fixture: ComponentFixture<MockComponent>;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SceneRendererService, Form3DService],
      declarations: [MockComponent],
    });
    fixture = TestBed.createComponent(MockComponent);
    mockComponentInstance = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should be created", () => {
    const service: SceneRendererService = TestBed.get(SceneRendererService);
    expect(service).toBeTruthy();
  });

  it("should have a defined array of objects after init is called", () => {
    const service: SceneRendererService = TestBed.get(SceneRendererService);
    service.init(mockComponentInstance.cont);
    expect(service.objects.length).not.toEqual(0);
  });
});
