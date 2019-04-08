import { TestBed } from "@angular/core/testing";
import * as THREE from "three";
import { RenderUpdateService } from "./render-update.service";
// tslint:disable:max-file-line-count
// tslint:disable:no-magic-numbers
describe("RenderUpdateService", () => {

  beforeEach(() => TestBed.configureTestingModule({}));

  it("should be created", () => {
    const service: RenderUpdateService = TestBed.get(RenderUpdateService);
    expect(service).toBeTruthy();
  });

  // Test UpdateVelocity
  it("should change the z velocity (negative)", () => {
    const service: RenderUpdateService = TestBed.get(RenderUpdateService);
    service["up"] = true;
    service["down"] = false;
    const vel: THREE.Vector3 = new THREE.Vector3(0, 0, 0);
    const delta: number = 5;
    service.updateVelocity(vel, delta);
    expect(vel.z).toBeLessThan(0);
  });
  it("should change the z velocity (positive)", () => {
    const service: RenderUpdateService = TestBed.get(RenderUpdateService);
    service["up"] = false;
    service["down"] = true;
    const vel: THREE.Vector3 = new THREE.Vector3(0, 0, 0);
    const delta: number = 5;
    service.updateVelocity(vel, delta);
    expect(vel.z).toBeGreaterThan(0);
  });
  it("should change the x velocity (negative)", () => {
    const service: RenderUpdateService = TestBed.get(RenderUpdateService);
    service["left"] = true;
    service["right"] = false;
    const vel: THREE.Vector3 = new THREE.Vector3(0, 0, 0);
    const delta: number = 5;
    service.updateVelocity(vel, delta);
    expect(vel.x).toBeLessThan(0);
  });
  it("should change the x velocity (positive)", () => {
    const service: RenderUpdateService = TestBed.get(RenderUpdateService);
    service["left"] = false;
    service["right"] = true;
    const vel: THREE.Vector3 = new THREE.Vector3(0, 0, 0);
    const delta: number = 5;
    service.updateVelocity(vel, delta);
    expect(vel.x).toBeGreaterThan(0);
  });

  // Test UpdateCamera
  it("should translate the camera of vel * delta in x and z, rightClick = true", () => {
    const service: RenderUpdateService = TestBed.get(RenderUpdateService);
    service["right"] = false;
    service.rightClick = true;
    const delta: number = 0.5;
    const vel: THREE.Vector3 = new THREE.Vector3(10, 10, 100);
    const camera: THREE.Camera = new THREE.Camera();
    service.updateCamera(camera, delta, vel);
    expect(camera.position.z).toEqual(vel.z * delta);
    expect(camera.position.x).toEqual(vel.x * delta);
  });
  it("should not translate the camera if vel or delta = 0, in x and z, rightClick = false", () => {
    const service: RenderUpdateService = TestBed.get(RenderUpdateService);
    service["right"] = true;
    service.rightClick = false;
    const delta: number = 0;
    service["deltaX"] = 10;
    service["deltaY"] = -8;
    const vel: THREE.Vector3 = new THREE.Vector3(10, 10, 100);
    const camera: THREE.Camera = new THREE.Camera();
    const baseX: number = camera.position.x;
    const baseZ: number = camera.position.z;
    service.updateCamera(camera, delta, vel);
    expect(camera.position.z).toEqual(baseX);
    expect(camera.position.x).toEqual(baseZ);
  });

  // Test moveForward/Backward/Left/Right
  it("should have the right boolean value (forward, false)", () => {
    const service: RenderUpdateService = TestBed.get(RenderUpdateService);
    service.moveForward(false);
    expect(service["up"]).toBeFalsy();
  });
  it("should have the right boolean value (forward, true)", () => {
    const service: RenderUpdateService = TestBed.get(RenderUpdateService);
    service.moveForward(true);
    expect(service["up"]).toBeTruthy();
  });
  it("should have the right boolean value (backward, false)", () => {
    const service: RenderUpdateService = TestBed.get(RenderUpdateService);
    service.moveBackward(false);
    expect(service["down"]).toBeFalsy();
  });
  it("should have the right boolean value (backward, true)", () => {
    const service: RenderUpdateService = TestBed.get(RenderUpdateService);
    service.moveBackward(true);
    expect(service["down"]).toBeTruthy();
  });
  it("should have the right boolean value (left, false)", () => {
    const service: RenderUpdateService = TestBed.get(RenderUpdateService);
    service.moveLeft(false);
    expect(service["left"]).toBeFalsy();
  });
  it("should have the right boolean value (left, true)", () => {
    const service: RenderUpdateService = TestBed.get(RenderUpdateService);
    service.moveLeft(true);
    expect(service["left"]).toBeTruthy();
  });
  it("should have the right boolean value (right, false)", () => {
    const service: RenderUpdateService = TestBed.get(RenderUpdateService);
    service.moveRight(false);
    expect(service["right"]).toBeFalsy();
  });
  it("should have the right boolean value (right, true)", () => {
    const service: RenderUpdateService = TestBed.get(RenderUpdateService);
    service.moveRight(true);
    expect(service["right"]).toBeTruthy();
  });

  // Test RightClickHold
  it("should setUp oldX, oldY", () => {
    const service: RenderUpdateService = TestBed.get(RenderUpdateService);
    service["right"]  = true;
    service.rightClick = true;
    service.rightClickHold(45, 123);
    expect(service["oldX"]).toEqual(45);
    expect(service["oldY"]).toEqual(123);
  });
  it("should not setUp oldX, oldY or change the value of deltaX and Y", () => {
    const service: RenderUpdateService = TestBed.get(RenderUpdateService);
    service["right"] = false;
    service["oldX"] = 0;
    service["oldY"] = 200;
    service["deltaX"] = -169;
    service["deltaY"] = -2;
    service.rightClickHold(45, 123);
    expect(service["deltaX"]).toEqual(-169);
    expect(service["deltaY"]).toEqual(-2);
    expect(service["oldX"]).toEqual(0);
    expect(service["oldY"]).toEqual(200);
  });

  // Test rotationCamera
  it("should compute deltaX and deltaY according to values", () => {
    const service: RenderUpdateService = TestBed.get(RenderUpdateService);
    service["oldX"] = 0;
    service["oldY"] = 0;
    service.rotationCamera(100, -150);
    expect(service["deltaY"]).toEqual((0 - 100) * Math.PI / 800);
    expect(service["deltaX"]).toEqual((0 - (-150)) * Math.PI / 800);
  });

  // Test UpdateDifference
  it("should add inside the modifiedScene the deleted element", () => {
    const service: RenderUpdateService = TestBed.get(RenderUpdateService);
    const scene: THREE.Scene = new THREE.Scene();
    const modifiedScene: THREE.Scene = new THREE.Scene();
    const obj: THREE.Object3D = new THREE.Object3D();
    scene.add(obj);
    service.updateDifference(obj, scene, modifiedScene);
    expect(modifiedScene.children.length).toEqual(1);
  });

  it("should not add obj inside the modifiedScene since not the same obj", () => {
    const service: RenderUpdateService = TestBed.get(RenderUpdateService);
    const scene: THREE.Scene = new THREE.Scene();
    const modifiedScene: THREE.Scene = new THREE.Scene();
    const obj1: THREE.Object3D = new THREE.Object3D();
    obj1.position.set(50, 50, 50);
    const obj2: THREE.Object3D = new THREE.Object3D();
    scene.add(obj1);
    service.updateDifference(obj2, scene, modifiedScene);
    expect(modifiedScene.children.length).toEqual(0);
  });

  it("should delete the added obj inside modifiedScene", () => {
    const service: RenderUpdateService = TestBed.get(RenderUpdateService);
    const scene: THREE.Scene = new THREE.Scene();
    const modifiedScene: THREE.Scene = new THREE.Scene();
    const obj: THREE.Object3D = new THREE.Object3D();
    modifiedScene.add(obj);
    expect(modifiedScene.children.length).toEqual(1);
    service.updateDifference(obj, scene, modifiedScene);
    expect(modifiedScene.children.length).toEqual(0);
  });

  it("should update the color of the modObj, modObj clicked", () => {
    const service: RenderUpdateService = TestBed.get(RenderUpdateService);
    const scene: THREE.Scene = new THREE.Scene();
    const modifiedScene: THREE.Scene = new THREE.Scene();
    const oriGeo: THREE.BoxGeometry = new THREE.BoxGeometry();
    const oriMaterial: THREE.MeshPhongMaterial = new THREE.MeshPhongMaterial();
    oriMaterial.color.setHex(0xFFFFFF);
    const modGeo: THREE.BoxGeometry = new THREE.BoxGeometry();
    const modMaterial: THREE.MeshPhongMaterial = new THREE.MeshPhongMaterial();
    oriMaterial.color.setHex(0x000000);
    const oriObj: THREE.Mesh = new THREE.Mesh(oriGeo, oriMaterial);
    const modObj: THREE.Mesh = new THREE.Mesh(modGeo, modMaterial);
    scene.add(oriObj);
    modifiedScene.add(modObj);
    service.updateDifference(modObj, scene, modifiedScene);
    expect(((modifiedScene.children[0] as THREE.Mesh).material as THREE.MeshPhongMaterial).color.getHex())
      .toEqual(0x000000);
  });

  it("should update the color of the modObj, oriObj clicked", () => {
    const service: RenderUpdateService = TestBed.get(RenderUpdateService);
    const scene: THREE.Scene = new THREE.Scene();
    const modifiedScene: THREE.Scene = new THREE.Scene();
    const oriGeo: THREE.BoxGeometry = new THREE.BoxGeometry();
    const oriMaterial: THREE.MeshPhongMaterial = new THREE.MeshPhongMaterial();
    oriMaterial.color.setHex(0xFFFFFF);
    const modGeo: THREE.BoxGeometry = new THREE.BoxGeometry();
    const modMaterial: THREE.MeshPhongMaterial = new THREE.MeshPhongMaterial();
    oriMaterial.color.setHex(0x000000);
    const oriObj: THREE.Mesh = new THREE.Mesh(oriGeo, oriMaterial);
    const modObj: THREE.Mesh = new THREE.Mesh(modGeo, modMaterial);
    scene.add(oriObj);
    modifiedScene.add(modObj);
    service.updateDifference(oriObj, scene, modifiedScene);
    expect(((modifiedScene.children[0] as THREE.Mesh).material as THREE.MeshPhongMaterial).color.getHex())
      .toEqual(0x000000);
  });

  it("should not update the scenes, obj3 does not exist inside scenes", () => {
    const service: RenderUpdateService = TestBed.get(RenderUpdateService);
    const scene: THREE.Scene = new THREE.Scene();
    const modifiedScene: THREE.Scene = new THREE.Scene();
    const obj1: THREE.Object3D = new THREE.Object3D();
    obj1.position.set(10, -10, 100);
    const obj2: THREE.Object3D = new THREE.Object3D();
    obj2.position.set(0, -10, 200);
    const obj3: THREE.Object3D = new THREE.Object3D();
    obj3.position.set(10, 10, 300);
    scene.add(obj1);
    modifiedScene.add(obj2);
    service.updateDifference(obj3, scene, modifiedScene);
    expect(scene.children[0]).toEqual(obj1);
    expect(modifiedScene.children[0]).toEqual(obj2);
  });

  it("should modified the scenes, the modified scene added should not be visible", () => {
    const service: RenderUpdateService = TestBed.get(RenderUpdateService);
    const scene: THREE.Scene = new THREE.Scene();
    const modifiedScene: THREE.Scene = new THREE.Scene();
    const obj1: THREE.Scene = new THREE.Scene();
    obj1.position.set(10, -10, 100);
    const obj2: THREE.Scene = new THREE.Scene();
    obj2.position.set(10, -10, 100);
    scene.add(obj1);
    modifiedScene.add(obj2);
    service.updateDifference(obj1, scene, modifiedScene);
    expect(scene.children[0].visible).toBeTruthy();
    expect(modifiedScene.children[0].visible).toBeFalsy();
  });

  it("should modified the scenes, the modifiedScene should have length + 1", () => {
    const service: RenderUpdateService = TestBed.get(RenderUpdateService);
    const scene: THREE.Scene = new THREE.Scene();
    const modifiedScene: THREE.Scene = new THREE.Scene();
    const obj1: THREE.Scene = new THREE.Scene();
    obj1.position.set(10, -10, 100);
    const obj2: THREE.Scene = new THREE.Scene();
    obj2.position.set(10, -10, 100);
    scene.add(obj1);
    modifiedScene.add(obj2);
    service.updateDifference(obj1, scene, modifiedScene);
    expect(modifiedScene.children.length).toEqual(2);
  });

  // Test isSameObject
  it("should return true if the 2 object have the same center", () => {
    const service: RenderUpdateService = TestBed.get(RenderUpdateService);
    const pos1: number[] = [10, 69, 700];
    const pos2: number[] = [10, 69, 700];
    expect(service.isSameObject(pos1, pos2)).toBeTruthy();
  });

  it("should return false if the 2 object have a different center", () => {
    const service: RenderUpdateService = TestBed.get(RenderUpdateService);
    const pos1: number[] = [10, 69, 700];
    const pos2: number[] = [0, 1, -850];
    expect(service.isSameObject(pos1, pos2)).toBeFalsy();
  });
});
