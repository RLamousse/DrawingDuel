import { TestBed } from "@angular/core/testing";
// tslint:disable:no-magic-numbers
import { ObjectCollisionService } from "./object-collision.service";

describe("ObjectCollisionService", () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it("should be created", () => {
    const service: ObjectCollisionService = TestBed.get(ObjectCollisionService);
    expect(service).toBeTruthy();
  });
});
