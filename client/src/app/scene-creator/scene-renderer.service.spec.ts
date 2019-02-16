import { AfterViewInit, Component, ElementRef, ViewChild } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import * as THREE from "three";
import { Form3DService } from "./3DFormService/3-dform.service";
import { SceneRendererService } from "./scene-renderer.service";

describe("SceneRendererService", () => {

  @Component({
    selector: "app-scene-creator",
    template: "<div #container1><p>Mocked div container1</p></div><div #container2><p>Mocked div container2</p></div>",
  })
  class MockComponent implements AfterViewInit {
    @ViewChild("container1")
    private container1: ElementRef;
    @ViewChild("container2")
    private container2: ElementRef;
    public resized: boolean = false;
    public cont1: HTMLDivElement;
    public cont2: HTMLDivElement;
    public setContainer(): void {
      this.cont1 = this.container1.nativeElement;
      this.cont2 = this.container2.nativeElement;
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

  it("should asign the div container to the attributes after init is call", () => {
    const service: SceneRendererService = TestBed.get(SceneRendererService);
    service.init(mockComponentInstance.cont1, mockComponentInstance.cont2);
    expect(service.originalContainer).toBe(mockComponentInstance.cont1);
    expect(service.modifiedContainer).toBe(mockComponentInstance.cont2);
  });

  // Test loadScenes
  it("should throw an error if loadScenes is called before init(...)", () => {
    const service: SceneRendererService = TestBed.get(SceneRendererService);
    try {
      const original: THREE.Scene = new THREE.Scene;
      const modified: THREE.Scene = new THREE.Scene;
      service.loadScenes(original, modified);
    } catch (e) {
      expect(e).toEqual(new Error("La composante n'a pas ete initialise!"));
    }
  });

  it("should asign scenes at first call", () => {
    const service: SceneRendererService = TestBed.get(SceneRendererService);
    const original: THREE.Scene = new THREE.Scene;
    const modified: THREE.Scene = new THREE.Scene;
    service.init(mockComponentInstance.cont1, mockComponentInstance.cont2);
    service.loadScenes(original, modified);
    expect(service.scene).toBe(original);
    expect(service.modifiedScene).toBe(modified);
  });

  it("should reasign the new scenes at second call", () => {
    const service: SceneRendererService = TestBed.get(SceneRendererService);
    const original1: THREE.Scene = new THREE.Scene;
    const modified1: THREE.Scene = new THREE.Scene;
    const original2: THREE.Scene = new THREE.Scene;
    const modified2: THREE.Scene = new THREE.Scene;
    service.init(mockComponentInstance.cont1, mockComponentInstance.cont2);
    service.loadScenes(original1, modified1);
    service.loadScenes(original2, modified2);
    expect(service.scene).toBe(original2);
    expect(service.modifiedScene).toBe(modified2);
  });

  // Test getScreenshots
});
