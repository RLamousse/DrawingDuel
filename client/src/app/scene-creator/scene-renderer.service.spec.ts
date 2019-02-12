import { TestBed } from "@angular/core/testing";

import { SceneRendererService } from "./scene-renderer.service";

describe("SceneRendererService", () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it("should be created", () => {
    const service: SceneRendererService = TestBed.get(SceneRendererService);
    expect(service).toBeTruthy();
  });
});
