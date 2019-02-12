import { TestBed } from "@angular/core/testing";
import { Form3DService } from "./3DFormService/3-dform.service";
import { SceneRendererService } from "./scene-renderer.service";

describe("SceneRendererService", () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [SceneRendererService, Form3DService],
  }));

  it("should be created", () => {
    const service: SceneRendererService = TestBed.get(SceneRendererService);
    expect(service).toBeTruthy();
  });
});
