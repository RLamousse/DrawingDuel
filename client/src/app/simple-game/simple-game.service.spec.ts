import { TestBed } from "@angular/core/testing";

import { SimpleGameService } from "./simple-game.service";

describe("SimpleGameService", () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it("should be created", () => {
    const service: SimpleGameService = TestBed.get(SimpleGameService);
    expect(service).toBeTruthy();
  });

  it("should play a sound when there's not no difference", () => {
    fail();
  });

  it("should throw on unexpected server response", () => {
    fail();
  });

  it("should return a difference cluster with successful call to server", () => {
    fail();
  });

  it("should throw if a difference cluster was already found", () => {
    fail();
  });

  it("should update the difference count", () => {
    fail();
  });
});
