import { TestBed } from "@angular/core/testing";

import { SimpleGameService } from "./simple-game.service";

describe("SimpleGameService", () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it("should be created", () => {
    const service: SimpleGameService = TestBed.get(SimpleGameService);
    expect(service).toBeTruthy();
  });
});
