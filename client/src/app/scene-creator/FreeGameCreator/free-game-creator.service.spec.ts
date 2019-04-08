import {Injectable} from "@angular/core";
import {TestBed} from "@angular/core/testing";
import * as THREE from "three";
import {
  ObjectGeometry,
  ObjectTexture,
  Themes
} from "../../../../../common/free-game-json-interface/FreeGameCreatorInterface/free-game-enum";
import * as IObject from "../../../../../common/free-game-json-interface/JSONInterface/IScenesJSON";
import {IScene} from "../../scene-interface";
import {Form3DService} from "../3DFormService/3-dform.service";
import {FreeGameCreatorService} from "./free-game-creator.service";

// tslint:disable:no-magic-numbers
// tslint:disable:no-any  to be able to spyOn private method of a service
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

  public setUpThematicParameters(object: IObject.IJson3DObject, gltf: THREE.GLTF): void {
    return;
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

  // Test generateThematicScenes
  it ("should call generate thematicObject and setSkyBoxThematic", () => {
    const service: FreeGameCreatorService = TestBed.get(FreeGameCreatorService);
    spyOn(service as any, "generateThematicObject").and.returnValue(true);
    spyOn(service as any, "setSkyBoxThematic").and.returnValue(true);
    service["generateThematicScenes"](dummyScenes);
    expect(service["generateThematicObject"]).toHaveBeenCalled();
    expect(service["setSkyBoxThematic"]).toHaveBeenCalled();
  });

  // Test traverseChildren
  it("should call setTexture if scene elem is a Mesh", () => {
    const service: FreeGameCreatorService = TestBed.get(FreeGameCreatorService);
    spyOn(service as any, "setTexture").and.returnValue(true);
    const scene: THREE.Scene = new THREE.Scene();
    scene.add(new THREE.Mesh(new THREE.BoxGeometry(),  new THREE.MeshBasicMaterial()));
    service["traverseChildren"](scene, ObjectTexture.blue);
    expect(service["setTexture"]).toHaveBeenCalled();
  });

  it("should not call setTexture if no object of type Mesh inside the scene", () => {
    const service: FreeGameCreatorService = TestBed.get(FreeGameCreatorService);
    spyOn(service as any, "setTexture").and.returnValue(true);
    const scene: THREE.Scene = new THREE.Scene();
    scene.add(new THREE.Object3D().add(new THREE.Camera()));
    service["traverseChildren"](scene, ObjectTexture.blue);
    expect(service["setTexture"]).not.toHaveBeenCalled();
  });

  it("should not call setTexture if no object inside the scene", () => {
    const service: FreeGameCreatorService = TestBed.get(FreeGameCreatorService);
    spyOn(service as any, "setTexture").and.returnValue(true);
    const scene: THREE.Scene = new THREE.Scene();
    service["traverseChildren"](scene, ObjectTexture.blue);
    expect(service["setTexture"]).not.toHaveBeenCalled();
  });

  // Test setTexture
  it("should replace the object material with a new one containing the texture", () => {
    const service: FreeGameCreatorService = TestBed.get(FreeGameCreatorService);
    const mat: THREE.MeshBasicMaterial = new THREE.MeshBasicMaterial();
    const obj: THREE.Mesh = new THREE.Mesh(new THREE.BoxGeometry(), mat);
    service["setTexture"](obj, ObjectTexture.rainbow);
    expect(mat.type).not.toEqual((obj.material as THREE.MeshBasicMaterial).type);
  });

  // Test setSkyBoxThematic
  it("should add a skyBox obj to the scene and modified scene", () => {
    const service: FreeGameCreatorService = TestBed.get(FreeGameCreatorService);
    service["scene"] = new THREE.Scene();
    service["modifiedScene"] = new THREE.Scene();
    service["setSkyBoxThematic"]();
    expect(service["scene"].children[0].name).toEqual("skyBox");
    expect(service["modifiedScene"].children[0].name).toEqual("skyBox");
  });

  // Test setSkyBoxGeometric
  it("should add a skyBox obj to the geometric scene and modified scene", () => {
    const service: FreeGameCreatorService = TestBed.get(FreeGameCreatorService);
    service["scene"] = new THREE.Scene();
    service["modifiedScene"] = new THREE.Scene();
    service["setSkyBoxGeometric"]();
    expect(service["scene"].children[0].name).toEqual("skyBox");
    expect(service["modifiedScene"].children[0].name).toEqual("skyBox");
  });

  // Test buildObjectPath
  it("should return the right format of a string", () => {
    const service: FreeGameCreatorService = TestBed.get(FreeGameCreatorService);
    expect(service["buildObjectPath"](ObjectGeometry[5])).toEqual("assets/Models/space/comet/scene.gltf");
  });

  // Test generate3DObject, default case
  it("should return with the default case when invalid objType is pass to the function", () => {
    const service: FreeGameCreatorService = TestBed.get(FreeGameCreatorService);
    const obj: IObject.IJson3DObject = {
      type: 100,
      position: [],
      rotation: [],
      color: 0xFFFFFF,
      scale: 1,
      gameType: Themes.Geometry,
      texture: ObjectTexture.rainbow,
    };
    const createdObj: THREE.Mesh = service["generate3DObject"](obj);
    expect((createdObj.material as THREE.MeshBasicMaterial).type).toEqual("MeshBasicMaterial");
    expect(createdObj.geometry.type).toEqual("BufferGeometry");
  });

  // Test generateThematicObject
  it("should calls buildObjectPath and not call traverseChildren, originalObject", () => {
    const service: FreeGameCreatorService = TestBed.get(FreeGameCreatorService);
    const obj: IObject.IJson3DObject = {
      position: [],
      rotation: [],
      color: 0xFFFFFF,
      type: 5,
      gameType: Themes.Space,
      scale: 1,
    };
    spyOn(service as any, "buildObjectPath").and.callThrough();
    spyOn(service as any, "traverseChildren").and.returnValue(false);
    service["scene"] = new THREE.Scene;
    service["generateThematicObject"](obj, true);
    expect(service["buildObjectPath"]).toHaveBeenCalled();
    expect(service["traverseChildren"]).not.toHaveBeenCalled();
  });

  // Test generateThematicObject
  it("should calls buildObjectPath and call not traverseChildren, modifiedObject", () => {
    const service: FreeGameCreatorService = TestBed.get(FreeGameCreatorService);
    const obj: IObject.IJson3DObject = {
      position: [],
      rotation: [],
      color: 0xFFFFFF,
      type: 5,
      gameType: Themes.Space,
      scale: 1,
      texture: ObjectTexture.rainbow,
    };
    spyOn(service as any, "buildObjectPath").and.callThrough();
    spyOn(service as any, "traverseChildren").and.returnValue(true);
    service["modifiedScene"] = new THREE.Scene;
    service["generateThematicObject"](obj, false);
    expect(service["buildObjectPath"]).toHaveBeenCalled();
    expect(service["traverseChildren"]).not.toHaveBeenCalled();
  });
});
