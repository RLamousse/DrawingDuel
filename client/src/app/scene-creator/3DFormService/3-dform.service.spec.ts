import { TestBed } from "@angular/core/testing";
// import * as THREE from "three";
import { Form3DService } from "./3-dform.service";

describe("3DFormService", () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [Form3DService],
  }));

  it("should be created", () => {
    const service: Form3DService = TestBed.get(Form3DService);
    expect(service).toBeTruthy();
  });
  // Test createCube
  /*it("should create a THREE.Mesh with cube geometry", () => {
    const service: Form3DService = TestBed.get(Form3DService);
    const cube: THREE.Mesh = service.createCube();
    expect(cube.geometry.type).toBe("BoxGeometry");
  });

  // Test createSphere
  it("should create a THREE.Mesh with sphere geometry", () => {
    const service: Form3DService = TestBed.get(Form3DService);
    const sphere: THREE.Mesh = service.createSphere();
    expect(sphere.geometry.type).toBe("SphereGeometry");
  });

  // Test createCone
  it("should create a THREE.Mesh with cone geometry", () => {
    const service: Form3DService = TestBed.get(Form3DService);
    const cone: THREE.Mesh = service.createCone();
    expect(cone.geometry.type).toBe("ConeGeometry");
  });

  // Test createCylinder
  it("should create a THREE.Mesh with cylinder geometry", () => {
    const service: Form3DService = TestBed.get(Form3DService);
    const cylinder: THREE.Mesh = service.createCylinder();
    expect(cylinder.geometry.type).toBe("CylinderGeometry");
  });

  // Test createPyramid
  it("should create a THREE.Mesh with cylinder geometry", () => {
    const service: Form3DService = TestBed.get(Form3DService);
    const pyramid: THREE.Mesh = service.createPyramid();
    expect(pyramid.geometry.type).toBe("CylinderGeometry");
  });*/
});
