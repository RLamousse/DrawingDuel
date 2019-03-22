import { TestBed } from "@angular/core/testing";

import { RenderUpdateService } from "./render-update.service";

describe("RenderUpdateService", () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it("should be created", () => {
    const service: RenderUpdateService = TestBed.get(RenderUpdateService);
    expect(service).toBeTruthy();
  });
});
