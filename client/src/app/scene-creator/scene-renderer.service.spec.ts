import { TestBed } from "@angular/core/testing";
import * as THREE from "three";
import { SceneRendererService } from "./scene-renderer.service";

describe("SceneRendererService", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SceneRendererService],
    });
  });

  it("should create", () => {
    const service: SceneRendererService = new SceneRendererService();
    expect(service).toBeDefined();
  });

  // Test loadScenes
  it("should throw an error if loadScenes is called before init(...)", () => {
    const service: SceneRendererService = TestBed.get(SceneRendererService);
    const original: THREE.Scene = new THREE.Scene();
    const modified: THREE.Scene = new THREE.Scene();

    expect(() => service.loadScenes(original, modified)).toThrowError("La composante n'a pas ete initialise!");
  });

  it("should asign scenes at first call", () => {
    const service: SceneRendererService = TestBed.get(SceneRendererService);
    const original: THREE.Scene = new THREE.Scene();
    const modified: THREE.Scene = new THREE.Scene();
    const oriCont: HTMLDivElement = (document.createElement("div")) as HTMLDivElement;
    const modCont: HTMLDivElement = (document.createElement("div")) as HTMLDivElement;
    service.init(oriCont, modCont);
    service.loadScenes(original, modified);
    expect(service.scene).toBe(original);
    expect(service.modifiedScene).toBe(modified);
  });

  it("should reasign the new scenes at second call", () => {
    const service: SceneRendererService = TestBed.get(SceneRendererService);
    const original1: THREE.Scene = new THREE.Scene();
    const modified1: THREE.Scene = new THREE.Scene();
    const original2: THREE.Scene = new THREE.Scene();
    const modified2: THREE.Scene = new THREE.Scene();
    const oriCont: HTMLDivElement = (document.createElement("div")) as HTMLDivElement;
    const modCont: HTMLDivElement = (document.createElement("div")) as HTMLDivElement;
    service.init(oriCont, modCont);
    service.loadScenes(original1, modified1);
    service.loadScenes(original2, modified2);
    expect(service.scene).toBe(original2);
    expect(service.modifiedScene).toBe(modified2);
  });
});
