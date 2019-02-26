import { TestBed } from "@angular/core/testing";
//import * as THREE from "three";
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
});
