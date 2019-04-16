import {TestBed} from "@angular/core/testing";
import {SocketService} from "../socket.service";
import {SceneDiffValidator} from "./scene-diff-validator.service";

describe("SceneRendererService", () => {

  beforeEach(() => {

    return TestBed.configureTestingModule(
      {
        providers: [SocketService],
      });
  });

  it("should create", () => {
    const service: SceneDiffValidator = TestBed.get(SceneDiffValidator);
    expect(service).toBeDefined();
  });

  it("should validate a difference", () => {
    fail();
  });

  it("should reject with an NoDifferenceAtPointError if the difference was already found", () => {
    fail();
  });

  it("should reject with an NoDifferenceAtPointError if there's no differences", () => {
    fail();
  });

  it("should reject with an AbstractServiceError if there's an unexpected error", () => {
    fail();
  });
});
