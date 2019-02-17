import { TestBed } from "@angular/core/testing";
import * as THREE from "three";
import { Form3DService } from "../3DFormService/3-dform.service";
import { FreeGameCreatorService } from "./free-game-creator.service";

/* tslint:disable:no-magic-numbers */
class MockedForm3DService {
  public createCube(): THREE.Mesh { return new THREE.Mesh(new THREE.BoxGeometry(10, 10, 10), new THREE.Material()); }
  public createSphere(): THREE.Mesh { return new THREE.Mesh(new THREE.BoxGeometry(10, 10, 10), new THREE.Material()); }
  public createPyramid(): THREE.Mesh { return new THREE.Mesh(new THREE.BoxGeometry(10, 10, 10), new THREE.Material()); }
  public createCone(): THREE.Mesh { return new THREE.Mesh(new THREE.BoxGeometry(10, 10, 10), new THREE.Material()); }
  public createCylinder(): THREE.Mesh { return new THREE.Mesh(new THREE.BoxGeometry(10, 10, 10), new THREE.Material()); }
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

  it("should be created", () => {
    const service: FreeGameCreatorService = TestBed.get(FreeGameCreatorService);
    expect(service).toBeDefined();
  });

  // Test createScenes
  it("should not have undefined scenes after createScenes is called", () => {
    const service: FreeGameCreatorService = TestBed.get(FreeGameCreatorService);
    service.obj3DToCreate = 10;
    service.createScenes();
    expect(service.scene).toBeDefined();
    expect(service.modifiedScene).toBeDefined();
  });

  it("have an objects array of the size of object to create", () => {
    const service: FreeGameCreatorService = TestBed.get(FreeGameCreatorService);
    service.createScenes();
    expect(service.objects.length).toEqual(service.obj3DToCreate);
  });
});
