import {Injectable} from "@angular/core";
import {TestBed} from "@angular/core/testing";
import * as THREE from "three";
import {
  ObjectGeometry,
  Themes
} from "../../../../../common/free-game-json-interface/FreeGameCreatorInterface/free-game-enum";
import * as IObject from "../../../../../common/free-game-json-interface/JSONInterface/IScenesJSON";
import {IScene} from "../../scene-interface";
import {Form3DService} from "../3DFormService/3-dform.service";
import {FreeGameCreatorService} from "./free-game-creator.service";

/* tslint:disable:no-magic-numbers */
@Injectable()
class MockedForm3DService extends Form3DService {
  public createCube(): THREE.Mesh {
    return new THREE.Mesh(new THREE.BoxGeometry(10, 10, 10), new THREE.Material());
  }

  public createSphere(): THREE.Mesh {
    return new THREE.Mesh(new THREE.BoxGeometry(10, 10, 10), new THREE.Material());
  }

  public createPyramid(): THREE.Mesh {
    return new THREE.Mesh(new THREE.BoxGeometry(10, 10, 10), new THREE.Material());
  }

  public createCone(): THREE.Mesh {
    return new THREE.Mesh(new THREE.BoxGeometry(10, 10, 10), new THREE.Material());
  }

  public createCylinder(): THREE.Mesh {
    return new THREE.Mesh(new THREE.BoxGeometry(10, 10, 10), new THREE.Material());
  }
}

const dummyCube: IObject.ICube = {
  type: ObjectGeometry.cube,
  color: 0xF4F4F4, position: [0, 0, 0],
  rotation: [0, 0, 0], sideLenght: 10,
  scale: 1,
  gameType: Themes.Geometry,
};
const dummyCone: IObject.ICone = {
  type: ObjectGeometry.cone,
  color: 0xF4F4F4, position: [0, 0, 0],
  rotation: [0, 0, 0],
  height: 10,
  radialSegment: 32,
  radius: 10,
  scale: 1,
  gameType: Themes.Geometry,
};
const dummySphere: IObject.ISphere = {
  type: ObjectGeometry.sphere,
  color: 0xF4F4F4, position: [0, 0, 0],
  rotation: [0, 0, 0],
  heightSegments: 32,
  radius: 10,
  widthSegments: 32,
  scale: 1,
  gameType: Themes.Geometry,
};
const dummyCylinder: IObject.ICylinder = {
  type: ObjectGeometry.cylinder,
  color: 0xF4F4F4, position: [0, 0, 0],
  rotation: [0, 0, 0],
  botRadius: 10,
  height: 10,
  radiusSegment: 32,
  topRadius: 10,
  scale: 1,
  gameType: Themes.Geometry,
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
  scale: 1,
  gameType: Themes.Geometry,
};
const dummyScenes: IObject.IScenesJSON = {
  originalObjects: [dummyCube, dummyCone, dummyCylinder, dummyPyramid, dummySphere],
  modifiedObjects: [dummyCube, dummyCone, dummyCylinder],
};

describe("FreeGameCreatorService", () => {
  beforeEach(() => {
    TestBed.configureTestingModule(
      {
        providers: [
          FreeGameCreatorService,
          MockedForm3DService,
        ],
      });
  });

  it("should create", () => {
    const service: FreeGameCreatorService = TestBed.get(FreeGameCreatorService);
    expect(service).toBeDefined();
  });

  it("should call generateOriginal/modified scene when object type is gemotric", () => {
    const service: FreeGameCreatorService = TestBed.get(FreeGameCreatorService);
    spyOn(service as any, "generateOriginalScene").and.returnValue(true);
    spyOn(service as any, "generateModifiedScene").and.returnValue(true);
    service.createScenes(dummyScenes);
    expect(service["generateOriginalScene"]).toHaveBeenCalled();
    expect(service["generateModifiedScene"]).toHaveBeenCalled();
  });

  it("should call generateThematicScene when the first object is thematic Space", () => {
    const service: FreeGameCreatorService = TestBed.get(FreeGameCreatorService);
    spyOn(service as any, "generateThematicScenes").and.returnValue(true);
    dummyScenes.originalObjects[0].gameType = Themes.Space;
    service.createScenes(dummyScenes);
    expect(service["generateThematicScenes"]).toHaveBeenCalled();
    dummyScenes.originalObjects[0].gameType = Themes.Geometry;
  });

  it("should create scenes with the 5 different types of objects in the original, only 3 in the modified", () => {
    const service: FreeGameCreatorService = TestBed.get(FreeGameCreatorService);
    service.createScenes(dummyScenes);
    expect(service["objects"].length).toEqual(5);
    expect(service["modifiedObjects"].length).toEqual(3);
  });

  it("should create 2 scenes with (objectsArray.lenght + 2 light + 1 skyBox) children", () => {
    const service: FreeGameCreatorService = TestBed.get(FreeGameCreatorService);
    const scenes: IScene = service.createScenes(dummyScenes);
    expect(scenes.scene.children.length).toEqual(service["objects"].length + 3);
    expect(scenes.modifiedScene.children.length).toEqual(service["modifiedObjects"].length + 3);
  });
});
