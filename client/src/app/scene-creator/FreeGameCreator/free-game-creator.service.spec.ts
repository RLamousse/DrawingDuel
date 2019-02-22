import { TestBed } from "@angular/core/testing";
import * as IObject from "../../../../../common/free-game-json-interface/JSONInterface/IScenesJSON";
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
  it("should create empty scenes, objects array empty", () => {
    const emptyScenes: IObject.IScenesJSON = { originalObjects: [], modifiedObjects: [] };
    const service: FreeGameCreatorService = new FreeGameCreatorService(emptyScenes, new Form3DService());
    service.createScenes();
  });

});
