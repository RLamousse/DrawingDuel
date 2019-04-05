import { TestBed } from "@angular/core/testing";
import * as THREE from "three";
// tslint:disable:no-magic-numbers
// tslint:disable:no-any
import { ObjectCollisionService } from "./object-collision.service";

describe("ObjectCollisionService", () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it("should be created", () => {
    const service: ObjectCollisionService = TestBed.get(ObjectCollisionService);
    expect(service).toBeTruthy();
  });

  // Test rayCastCollision
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
  it("should call cancelVelocity when there is a collision", () => {
    const service: ObjectCollisionService = TestBed.get(ObjectCollisionService);
    spyOn(service as any, "isCollision").and.returnValue(true);
    spyOn(service as any, "cancelVelocity").and.callThrough();
    const ori: THREE.Object3D[] = [];
    const mod: THREE.Object3D[] = [];
    const cam: THREE.Camera = new THREE.Camera();
    const vel: THREE.Vector3 = new THREE.Vector3();
    service.raycastCollision(cam, ori, mod, vel);
    expect(service["cancelVelocity"]).toHaveBeenCalled();
  });
  it("should switch the sign of comparisonVec.x when ori.x - dir.x < -1", () => {
    const service: ObjectCollisionService = TestBed.get(ObjectCollisionService);
    const vel: THREE.Vector3 = new THREE.Vector3(0, 0, 0);
    const oriDir: THREE.Vector3 = new THREE.Vector3(-1, 0, 0);
    const dirColl: THREE.Vector3 = new THREE.Vector3(0.8, 0, 0);
    service["cancelVelocity"](vel, dirColl, oriDir);
    expect(service["comparisonVec"].x).toEqual(-dirColl.x);
  });
  it("should switch the sign of comparisonVec.x when ori.x - dir.x > 1", () => {
    const service: ObjectCollisionService = TestBed.get(ObjectCollisionService);
    const vel: THREE.Vector3 = new THREE.Vector3(0, 0, 0);
    const oriDir: THREE.Vector3 = new THREE.Vector3(1, 0, 0);
    const dirColl: THREE.Vector3 = new THREE.Vector3(-0.8, 0, 0);
    service["cancelVelocity"](vel, dirColl, oriDir);
    expect(service["comparisonVec"].x).toEqual(-dirColl.x);
  });
  it("should switch the sign of comparisonVec.z when ori.z - dir.z < -1", () => {
    const service: ObjectCollisionService = TestBed.get(ObjectCollisionService);
    const vel: THREE.Vector3 = new THREE.Vector3(0, 0, 0);
    const oriDir: THREE.Vector3 = new THREE.Vector3(1, 0, -1);
    const dirColl: THREE.Vector3 = new THREE.Vector3(-0.8, 0, 0.7);
    service["cancelVelocity"](vel, dirColl, oriDir);
    expect(service["comparisonVec"].z).toEqual(-dirColl.z);
  });
  it("should switch the sign of comparisonVec.z when ori.z - dir.z > 1", () => {
    const service: ObjectCollisionService = TestBed.get(ObjectCollisionService);
    const vel: THREE.Vector3 = new THREE.Vector3(0, 0, 0);
    const oriDir: THREE.Vector3 = new THREE.Vector3(1, 0, 1);
    const dirColl: THREE.Vector3 = new THREE.Vector3(-0.8, 0, -0.7);
    service["cancelVelocity"](vel, dirColl, oriDir);
    expect(service["comparisonVec"].z).toEqual(-dirColl.z);
  });
  it("should put to 0 vel.x when vel.x < 0 && comparisonVec.x < 0", () => {
    const service: ObjectCollisionService = TestBed.get(ObjectCollisionService);
    const vel: THREE.Vector3 = new THREE.Vector3(-1, 0, 0);
    const oriDir: THREE.Vector3 = new THREE.Vector3(0, 0, 0);
    const dirColl: THREE.Vector3 = new THREE.Vector3(-0.8, 0, 0);
    service["cancelVelocity"](vel, dirColl, oriDir);
    expect(vel.x).toEqual(0);
  });
});
