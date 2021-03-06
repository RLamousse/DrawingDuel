import {TestBed} from "@angular/core/testing";
import {Mesh} from "three";
import {
  ObjectGeometry,
  Themes
} from "../../../../../common/free-game-json-interface/FreeGameCreatorInterface/free-game-enum";
import {ICone, ICube, ICylinder, IPyramid, ISphere} from "../../../../../common/free-game-json-interface/JSONInterface/IScenesJSON";
import {getOrigin3D} from "../../../../../common/model/point";
import {Form3DService} from "./3-dform.service";

/* tslint:disable:no-magic-numbers */
describe("3DFormService", () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [Form3DService],
  }));

  it("should be created", () => {
    const service: Form3DService = TestBed.get(Form3DService);
    expect(service).toBeTruthy();
  });

  // Test createCube
  it("should create a Mesh with cube geometry with right position", () => {
    const service: Form3DService = TestBed.get(Form3DService);
    const dummyCube: ICube = {
      type: ObjectGeometry.cube,
      color: 0xF4F4F4,
      position: {x: 25, y: 12, z: 2},
      rotation: getOrigin3D(),
      sideLength: 10,
      scale: 1,
      gameType: Themes.Geometry,
    };
    const cube: Mesh = service.createCube(dummyCube);

    expect(cube.geometry.type).toBe("BoxGeometry");

    expect(cube.position.x).toEqual(25);
    expect(cube.position.y).toEqual(12);
    expect(cube.position.z).toEqual(2);
  });

  // Test createSphere
  it("should create a Mesh with sphere geometry with right position", () => {
    const service: Form3DService = TestBed.get(Form3DService);
    const dummySphere: ISphere = {
      type: ObjectGeometry.sphere,
      color: 0xF4F4F4,
      position: {x: 25, y: 12, z: 2},
      rotation: getOrigin3D(),
      heightSegments: 32,
      radius: 10,
      widthSegments: 32,
      scale: 1,
      gameType: Themes.Geometry,
    };
    const sphere: Mesh = service.createSphere(dummySphere);

    expect(sphere.geometry.type).toBe("SphereGeometry");

    expect(sphere.position.x).toEqual(25);
    expect(sphere.position.y).toEqual(12);
    expect(sphere.position.z).toEqual(2);
  });

  // Test createCone
  it("should create a Mesh with cone geometry with right position", () => {
    const service: Form3DService = TestBed.get(Form3DService);
    const dummyCone: ICone = {
      type: ObjectGeometry.cone,
      color: 0xF4F4F4,
      position: {x: 5, y: 12, z: 2},
      rotation: getOrigin3D(),
      height: 10,
      radialSegment: 32,
      radius: 10,
      scale: 1,
      gameType: Themes.Geometry,
    };
    const cone: Mesh = service.createCone(dummyCone);

    expect(cone.geometry.type).toBe("ConeGeometry");

    expect(cone.position.x).toEqual(5);
    expect(cone.position.y).toEqual(12);
    expect(cone.position.z).toEqual(2);
  });

  // Test createCylinder
  it("should create a Mesh with cylinder geometry with right position", () => {
    const service: Form3DService = TestBed.get(Form3DService);
    const dummyCylinder: ICylinder = {
      type: ObjectGeometry.cylinder,
      color: 0xF4F4F4,
      position: getOrigin3D(),
      rotation: getOrigin3D(),
      botRadius: 10,
      height: 10,
      radiusSegment: 32,
      topRadius: 10,
      scale: 1,
      gameType: Themes.Geometry,
    };
    const cylinder: Mesh = service.createCylinder(dummyCylinder);

    expect(cylinder.geometry.type).toBe("CylinderGeometry");

    expect(cylinder.position.x).toEqual(0);
    expect(cylinder.position.y).toEqual(0);
    expect(cylinder.position.z).toEqual(0);
  });

  // Test createPyramid
  it("should create a Mesh with cylinder geometry with right position", () => {
    const service: Form3DService = TestBed.get(Form3DService);
    const dummyPyramid: IPyramid = {
      type: ObjectGeometry.pyramid,
      color: 0xF4F4F4,
      position: {x: 100, y: 2, z: 2},
      rotation: getOrigin3D(),
      topRadius: 0,
      heightSegment: 1,
      radiusSegment: 3,
      botRadius: 10,
      height: 10,
      scale: 1,
      gameType: Themes.Geometry,
    };
    const pyramid: Mesh = service.createPyramid(dummyPyramid);

    expect(pyramid.geometry.type).toBe("CylinderGeometry");

    expect(pyramid.position.x).toEqual(100);
    expect(pyramid.position.y).toEqual(2);
    expect(pyramid.position.z).toEqual(2);
  });
});
