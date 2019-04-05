import { TestBed } from "@angular/core/testing";
import * as THREE from "three";
// tslint:disable:no-magic-numbers
import { ObjectCollisionService } from "./object-collision.service";

describe("ObjectCollisionService", () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it("should be created", () => {
    const service: ObjectCollisionService = TestBed.get(ObjectCollisionService);
    expect(service).toBeTruthy();
  });

  // Test rayCastCollision
  //  public raycastCollision(camera: THREE.Camera, oriObjs: THREE.Object3D[], modObjs: THREE.Object3D[], vel: THREE.Vector3): void {
  it ("should not call cancelVelocity if noObject in collision", () => {
    const service: ObjectCollisionService = TestBed.get(ObjectCollisionService);
    spyOn(service as any, "isCollision").and.returnValue(false);
    spyOn(service as any, "cancelVelocity").and.callThrough();
    const ori: THREE.Object3D[] = [];
    const mod: THREE.Object3D[] = [];
    const cam: THREE.Camera = new THREE.Camera();
    const vel: THREE.Vector3 = new THREE.Vector3();
    service.raycastCollision(cam, ori, mod, vel);
    expect(service["cancelVelocity"]).not.toHaveBeenCalled();
  });
});
