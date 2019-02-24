import { TestBed } from "@angular/core/testing";
import * as IObject from "../../../../../common/free-game-json-interface/JSONInterface/IScenesJSON";
import { ObjectGeometry } from "../../../../../common/free-game-json-interface/FreeGameCreatorInterface/free-game-enum";
import * as THREE from "three";
import { Form3DService } from "../3DFormService/3-dform.service";
import { FreeGameCreatorService } from "./free-game-creator.service";

/* tslint:disable:no-magic-numbers */
class MockedForm3DService {
  public createCube(cube: IObject.ICube): THREE.Mesh { return new THREE.Mesh(new THREE.BoxGeometry(10, 10, 10), new THREE.Material()); }
  public createSphere(sphere: IObject.ISphere): THREE.Mesh { return new THREE.Mesh(new THREE.BoxGeometry(10, 10, 10), new THREE.Material()); }
  public createPyramid(pyr: IObject.IPyramid): THREE.Mesh { return new THREE.Mesh(new THREE.BoxGeometry(10, 10, 10), new THREE.Material()); }
  public createCone(cone: IObject.ICone): THREE.Mesh { return new THREE.Mesh(new THREE.BoxGeometry(10, 10, 10), new THREE.Material()); }
  public createCylinder(cyl: IObject.ICylinder): THREE.Mesh { return new THREE.Mesh(new THREE.BoxGeometry(10, 10, 10), new THREE.Material()); }
}

const mockedInstance: MockedForm3DService = new MockedForm3DService();
const dummyCube: IObject.ICube = { type: ObjectGeometry.cube, color: 0xF4F4F4, position: [0, 0, 0], rotation: [0, 0, 0], sideLenght: 10 };
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
const dummyScenes: IObject.IScenesJSON = {
  originalObjects: [dummyCube, dummyCone, dummyCylinder, dummyPyramid, dummySphere],
  modifiedObjects: [dummyCube, dummyCone, dummyCylinder],
}

describe("FreeGameCreatorService", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        FreeGameCreatorService,
        { provide: Form3DService, useValue: mockedInstance },
      ],
    });
  });

  // Test createScenes
  it("should create empty scenes => objects array empty", () => {
    const emptyScenes: IObject.IScenesJSON = { originalObjects: [], modifiedObjects: [] };
    const service: FreeGameCreatorService = new FreeGameCreatorService();
    service.createScenes(emptyScenes);
    expect(service.objects.length).toEqual(0);
    expect(service.modifiedObjects.length).toEqual(0);
  });

  it("should create scenes with the 5 different types of objects in the original, only 3 in the modified", () => {
    const service: FreeGameCreatorService = new FreeGameCreatorService();
    service.createScenes(dummyScenes);
    expect(service.objects.length).toEqual(5);
    expect(service.modifiedObjects.length).toEqual(3);
  });
});
