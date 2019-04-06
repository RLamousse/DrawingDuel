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

  it("should put to 0 vel.x when vel.x > 0 && comparisonVec.x > 0", () => {
    const service: ObjectCollisionService = TestBed.get(ObjectCollisionService);
    const vel: THREE.Vector3 = new THREE.Vector3(1, 0, 0);
    const oriDir: THREE.Vector3 = new THREE.Vector3(0, 0, 0);
    const dirColl: THREE.Vector3 = new THREE.Vector3(0.8, 0, 0);
    service["cancelVelocity"](vel, dirColl, oriDir);
    expect(vel.x).toEqual(0);
  });

  it("should not put vel.x to 0 when vel.x < 0 && comparisonVec.x > 0", () => {
    const service: ObjectCollisionService = TestBed.get(ObjectCollisionService);
    const vel: THREE.Vector3 = new THREE.Vector3(-1, 0, 0);
    const oriDir: THREE.Vector3 = new THREE.Vector3(0, 0, 0);
    const dirColl: THREE.Vector3 = new THREE.Vector3(0.8, 0, 0);
    service["cancelVelocity"](vel, dirColl, oriDir);
    expect(vel.x).toEqual(-1);
  });

  it("should not put vel.x to 0 when vel.x < 0 && comparisonVec.x > 0", () => {
    const service: ObjectCollisionService = TestBed.get(ObjectCollisionService);
    const vel: THREE.Vector3 = new THREE.Vector3(1, 0, 0);
    const oriDir: THREE.Vector3 = new THREE.Vector3(0, 0, 0);
    const dirColl: THREE.Vector3 = new THREE.Vector3(-0.8, 0, 0);
    service["cancelVelocity"](vel, dirColl, oriDir);
    expect(vel.x).toEqual(1);
  });

  it("should put to 0 vel.z when vel.z < 0 && comparisonVec.z < 0", () => {
    const service: ObjectCollisionService = TestBed.get(ObjectCollisionService);
    const vel: THREE.Vector3 = new THREE.Vector3(0, 0, -1);
    const oriDir: THREE.Vector3 = new THREE.Vector3(0, 0, 0);
    const dirColl: THREE.Vector3 = new THREE.Vector3(0, 0, -0.8);
    service["cancelVelocity"](vel, dirColl, oriDir);
    expect(vel.z).toEqual(0);
  });

  it("should put to 0 vel.z when vel.z > 0 && comparisonVec.z > 0", () => {
    const service: ObjectCollisionService = TestBed.get(ObjectCollisionService);
    const vel: THREE.Vector3 = new THREE.Vector3(0, 0, 1);
    const oriDir: THREE.Vector3 = new THREE.Vector3(0, 0, 0);
    const dirColl: THREE.Vector3 = new THREE.Vector3(0, 0, 0.8);
    service["cancelVelocity"](vel, dirColl, oriDir);
    expect(vel.z).toEqual(0);
  });

  it("should not put vel.z to 0 when vel.z < 0 && comparisonVec.z > 0", () => {
    const service: ObjectCollisionService = TestBed.get(ObjectCollisionService);
    const vel: THREE.Vector3 = new THREE.Vector3(0, 0, -1);
    const oriDir: THREE.Vector3 = new THREE.Vector3(0, 0, 0);
    const dirColl: THREE.Vector3 = new THREE.Vector3(0, 0, 0.8);
    service["cancelVelocity"](vel, dirColl, oriDir);
    expect(vel.z).toEqual(-1);
  });

  it("should not put vel.z to 0 when vel.z < 0 && comparisonVec.z > 0", () => {
    const service: ObjectCollisionService = TestBed.get(ObjectCollisionService);
    const vel: THREE.Vector3 = new THREE.Vector3(0, 0, 1);
    const oriDir: THREE.Vector3 = new THREE.Vector3(0, 0, 0);
    const dirColl: THREE.Vector3 = new THREE.Vector3(0, 0, -0.8);
    service["cancelVelocity"](vel, dirColl, oriDir);
    expect(vel.z).toEqual(1);
  });

  // Test isCollision
  it("should return false when there is no collision (distance is higher)", () => {
    const service: ObjectCollisionService = TestBed.get(ObjectCollisionService);
    const objsColl: THREE.Intersection[] = [
      {
        distance: 100,
        point: new THREE.Vector3(),
        object: new THREE.Object3D(),
      },
    ];
    expect(service["isCollision"](objsColl)).toBeFalsy();
  });

  it("should return false when there is no collision (distance is equal)", () => {
    const service: ObjectCollisionService = TestBed.get(ObjectCollisionService);
    const objsColl: THREE.Intersection[] = [
      {
        distance: service["collisionDist"],
        point: new THREE.Vector3(),
        object: new THREE.Object3D(),
      },
    ];
    expect(service["isCollision"](objsColl)).toBeFalsy();
  });

  it("should return false when there is no collision (no object)", () => {
    const service: ObjectCollisionService = TestBed.get(ObjectCollisionService);
    const objsColl: THREE.Intersection[] = [];
    expect(service["isCollision"](objsColl)).toBeFalsy();
  });

  it("should return true when there is a collision (distance is lower)", () => {
    const service: ObjectCollisionService = TestBed.get(ObjectCollisionService);
    const objsColl: THREE.Intersection[] = [
      {
        distance: 0,
        point: new THREE.Vector3(),
        object: new THREE.Object3D(),
      },
    ];
    expect(service["isCollision"](objsColl)).toBeTruthy();
  });
});
