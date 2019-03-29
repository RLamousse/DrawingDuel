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

  it("should initialized the 3 private attribute (not undefined) on creation", () => {
    const service: ObjectCollisionService = TestBed.get(ObjectCollisionService);
    expect(service["camera"]).toBeTruthy();
    expect(service["originalObjects"]).toBeTruthy();
    expect(service["modifiedObjects"]).toBeTruthy();
  });

  // Test setCollision
  it("should assign the objects table and the camera to the private attribute", () => {
    const service: ObjectCollisionService = TestBed.get(ObjectCollisionService);
    const oriObjs: THREE.Object3D[] = [new THREE.Object3D(), new THREE.Object3D()];
    const modObjs: THREE.Object3D[] = [new THREE.Object3D()];
    const camera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera();
    service.setCollision(camera, oriObjs, modObjs);
    expect(service["originalObjects"].length).toEqual(2);
    expect(service["modifiedObjects"].length).toEqual(1);
  });
});
