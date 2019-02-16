import { TestBed } from "@angular/core/testing";

import { FreeGameCreatorService } from "./free-game-creator.service";

describe("FreeGameCreatorService", () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it("should be created", () => {
    const service: FreeGameCreatorService = TestBed.get(FreeGameCreatorService);
    expect(service).toBeTruthy();
  });
});
