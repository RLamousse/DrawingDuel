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
});
