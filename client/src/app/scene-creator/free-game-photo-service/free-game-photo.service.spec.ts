import { TestBed } from "@angular/core/testing";

import { FreeGamePhotoService } from "./free-game-photo.service";

describe("FreeGamePhotoService", () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it("should be created", () => {
    const service: FreeGamePhotoService = TestBed.get(FreeGamePhotoService);
    expect(service).toBeTruthy();
  });
});
