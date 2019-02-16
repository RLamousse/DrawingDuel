import { TestBed } from "@angular/core/testing";
import { Form3DService } from "../3DFormService/3-dform.service";
import { FreeGameCreatorService } from "./free-game-creator.service";
import * as THREE from "three";

const mocked3DObject: THREE.Mesh = new THREE.Mesh(new THREE.BoxGeometry(10, 10, 10), new THREE.Material());

const mockedForm3DService = {
  createCube: () => { return mocked3DObject },
  createSphere: () => { return mocked3DObject },
  createPyramid: () => { return mocked3DObject },
  createCone: () => { return mocked3DObject },
  createCylinder: () => { return mocked3DObject },
};

describe("FreeGameCreatorService", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        FreeGameCreatorService,
        { provide: Form3DService, useValue: mockedForm3DService }
      ],
    });
  });

  it("should be created", () => {
    const service: FreeGameCreatorService = TestBed.get(FreeGameCreatorService);
    expect(service).toBeTruthy();
  });

  // Test createScenes
  it("should not have undefined scenes after createScenes is called", () => {
    const service: FreeGameCreatorService = TestBed.get(FreeGameCreatorService);
    service.createScenes();
    expect(service.scene).toBeUndefined();
    expect(service.modifiedScene).toBeUndefined();
  });

  it("have an objects array of the size of object to create", () => {
    const service: FreeGameCreatorService = TestBed.get(FreeGameCreatorService);
    service.createScenes();
    expect(service.objects.length).toEqual(service.obj3DToCreate);
  });
});
