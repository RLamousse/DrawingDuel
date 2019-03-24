import { TestBed } from "@angular/core/testing";
import * as THREE from "three";
import { RenderUpdateService } from "./render-update.service";

describe("RenderUpdateService", () => {

  beforeEach(() => TestBed.configureTestingModule({}));

  it("should be created", () => {
    const service: RenderUpdateService = TestBed.get(RenderUpdateService);
    expect(service).toBeTruthy();
  });

  // Test UpdateVelocity
  it("should change the z velocity (negative)", () => {
    const service: RenderUpdateService = TestBed.get(RenderUpdateService);
    service.up = true;
    service.down = false;
    const vel: THREE.Vector3 = new THREE.Vector3(0, 0, 0);
    const delta: number = 5;
    service.updateVelocity(vel, delta);
    expect(vel.z).toBeLessThan(0);
  });
  it("should change the z velocity (positive)", () => {
    const service: RenderUpdateService = TestBed.get(RenderUpdateService);
    service.up = false;
    service.down = true;
    const vel: THREE.Vector3 = new THREE.Vector3(0, 0, 0);
    const delta: number = 5;
    service.updateVelocity(vel, delta);
    expect(vel.z).toBeGreaterThan(0);
  });
  it("should change the x velocity (negative)", () => {
    const service: RenderUpdateService = TestBed.get(RenderUpdateService);
    service.left = true;
    service.right = false;
    const vel: THREE.Vector3 = new THREE.Vector3(0, 0, 0);
    const delta: number = 5;
    service.updateVelocity(vel, delta);
    expect(vel.x).toBeLessThan(0);
  });
  it("should change the x velocity (positive)", () => {
    const service: RenderUpdateService = TestBed.get(RenderUpdateService);
    service.left = false;
    service.right = true;
    const vel: THREE.Vector3 = new THREE.Vector3(0, 0, 0);
    const delta: number = 5;
    service.updateVelocity(vel, delta);
    expect(vel.x).toBeGreaterThan(0);
  });

  // Test UpdateCamera
  it("should translate the camera of vel * delta in x and z", () => {
    const service: RenderUpdateService = TestBed.get(RenderUpdateService);
    service.rightClick = false;
    const delta: number = 0.5;
    // tslint:disable-next-line:no-magic-numbers
    const vel: THREE.Vector3 = new THREE.Vector3(10, 10, 100);
    const camera: THREE.Camera = new THREE.Camera();
    service.updateCamera(camera, delta, vel);
    expect(camera.position.z).toEqual(vel.z * delta);
    expect(camera.position.x).toEqual(vel.x * delta);
  });
  it("should not translate the camera if vel or delta = 0, in x and z", () => {
    const service: RenderUpdateService = TestBed.get(RenderUpdateService);
    service.rightClick = true;
    const delta: number = 0;
    // tslint:disable:no-magic-numbers
    service.deltaX = 10;
    service.deltaY = -8;
    const vel: THREE.Vector3 = new THREE.Vector3(10, 10, 100);
    const camera: THREE.Camera = new THREE.Camera();
    const baseX: number = camera.position.x;
    const baseZ: number = camera.position.z;
    service.updateCamera(camera, delta, vel);
    expect(camera.position.z).toEqual(baseX);
    expect(camera.position.x).toEqual(baseZ);
  });

  // Test moveForward/Backwar/Left/Right
  it("should have the right boolean value (forward, false)", () => {
    const service: RenderUpdateService = TestBed.get(RenderUpdateService);
    service.moveForward(false);
    expect(service.up).toBeFalsy();
  });
  it("should have the right boolean value (forward, true)", () => {
    const service: RenderUpdateService = TestBed.get(RenderUpdateService);
    service.moveForward(true);
    expect(service.up).toBeTruthy();
  });
  it("should have the right boolean value (backward, false)", () => {
    const service: RenderUpdateService = TestBed.get(RenderUpdateService);
    service.moveBackward(false);
    expect(service.down).toBeFalsy();
  });
  it("should have the right boolean value (backward, true)", () => {
    const service: RenderUpdateService = TestBed.get(RenderUpdateService);
    service.moveBackward(true);
    expect(service.down).toBeTruthy();
  });
  it("should have the right boolean value (left, false)", () => {
    const service: RenderUpdateService = TestBed.get(RenderUpdateService);
    service.moveLeft(false);
    expect(service.left).toBeFalsy();
  });
  it("should have the right boolean value (left, true)", () => {
    const service: RenderUpdateService = TestBed.get(RenderUpdateService);
    service.moveLeft(true);
    expect(service.left).toBeTruthy();
  });
  it("should have the right boolean value (right, false)", () => {
    const service: RenderUpdateService = TestBed.get(RenderUpdateService);
    service.moveRight(false);
    expect(service.right).toBeFalsy();
  });
  it("should have the right boolean value (right, true)", () => {
    const service: RenderUpdateService = TestBed.get(RenderUpdateService);
    service.moveRight(true);
    expect(service.right).toBeTruthy();
  });

  // Test RightClickHold
  it("should setUp oldX, oldY, deltaX and deltaY", () => {
    const service: RenderUpdateService = TestBed.get(RenderUpdateService);
    service.rightClick  = true;
    service.rightClickHold(45, 123);
    expect(service.deltaX).toEqual(0);
    expect(service.deltaY).toEqual(0);
    expect(service.oldX).toEqual(45);
    expect(service.oldY).toEqual(123);
  });
  it("should not setUp oldX, oldY, deltaX and deltaY", () => {
    const service: RenderUpdateService = TestBed.get(RenderUpdateService);
    service.rightClick = false;
    service.oldX = 0;
    service.oldY = 200;
    service.deltaX = -169;
    service.deltaY = -2;
    service.rightClickHold(45, 123);
    expect(service.deltaX).toEqual(-169);
    expect(service.deltaY).toEqual(-2);
    expect(service.oldX).toEqual(0);
    expect(service.oldY).toEqual(200);
  });

  // Test RotateCamera
  it("should compute deltaX and deltaY according to values", () => {
    const service: RenderUpdateService = TestBed.get(RenderUpdateService);
    service.oldX = 0;
    service.oldY = 0;
    service.rotateCamera(100, -150);
    expect(service.deltaY).toEqual((0 - 100) / 4000);
    expect(service.deltaX).toEqual((0 - (-150)) / 4000);
  });
});
