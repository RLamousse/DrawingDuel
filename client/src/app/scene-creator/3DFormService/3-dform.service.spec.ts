import { TestBed } from "@angular/core/testing";
// import * as THREE from "three";
import { Form3DService } from "./3-dform.service";
import * as IObject from "../../../../../common/free-game-json-interface/JSONInterface/IScenesJSON";
import { ObjectGeometry } from "../../../../../common/free-game-json-interface/FreeGameCreatorInterface/free-game-enum";

/* tslint:disable:no-magic-numbers */
const dummyCube: IObject.ICube = {
  type: ObjectGeometry.cube,
  color: 0xF4F4F4, position: [0, 0, 0],
  rotation: [0, 0, 0], sideLenght: 10,
};
const dummyCone: IObject.ICone = {
  type: ObjectGeometry.cone,
  color: 0xF4F4F4, position: [0, 0, 0],
  rotation: [0, 0, 0],
  height: 10,
  radialSegment: 32,
  radius: 10,
};
const dummySphere: IObject.ISphere = {
  type: ObjectGeometry.sphere,
  color: 0xF4F4F4, position: [0, 0, 0],
  rotation: [0, 0, 0],
  heightSegments: 32,
  radius: 10,
  widthSegments: 32,
};
const dummyCylinder: IObject.ICylinder = {
  type: ObjectGeometry.cylinder,
  color: 0xF4F4F4, position: [0, 0, 0],
  rotation: [0, 0, 0],
  botRadius: 10,
  height: 10,
  radiusSegment: 32,
  topRadius: 10,
};
const dummyPyramid: IObject.IPyramid = {
  type: ObjectGeometry.pyramid,
  color: 0xF4F4F4, position: [0, 0, 0],
  rotation: [0, 0, 0],
  topRadius: 0,
  heightSegment: 1,
  radiusSegment: 3,
  botRadius: 10,
  height: 10,
};

describe("3DFormService", () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [Form3DService],
  }));

  it("should be created", () => {
    const service: Form3DService = TestBed.get(Form3DService);
    expect(service).toBeTruthy();
  });
  // Test createCube
  it("should create a THREE.Mesh with cube geometry", () => {
    const service: Form3DService = TestBed.get(Form3DService);
    const cube: THREE.Mesh = service.createCube(dummyCube);
    expect(cube.geometry.type).toBe("BoxGeometry");
  });

  // Test createSphere
  it("should create a THREE.Mesh with sphere geometry", () => {
    const service: Form3DService = TestBed.get(Form3DService);
    const sphere: THREE.Mesh = service.createSphere(dummySphere);
    expect(sphere.geometry.type).toBe("SphereGeometry");
  });

  // Test createCone
  it("should create a THREE.Mesh with cone geometry", () => {
    const service: Form3DService = TestBed.get(Form3DService);
    const cone: THREE.Mesh = service.createCone(dummyCone);
    expect(cone.geometry.type).toBe("ConeGeometry");
  });

  // Test createCylinder
  it("should create a THREE.Mesh with cylinder geometry", () => {
    const service: Form3DService = TestBed.get(Form3DService);
    const cylinder: THREE.Mesh = service.createCylinder(dummyCylinder);
    expect(cylinder.geometry.type).toBe("CylinderGeometry");
  });

  // Test createPyramid
  it("should create a THREE.Mesh with cylinder geometry", () => {
    const service: Form3DService = TestBed.get(Form3DService);
    const pyramid: THREE.Mesh = service.createPyramid(dummyPyramid);
    expect(pyramid.geometry.type).toBe("CylinderGeometry");
  });
});
