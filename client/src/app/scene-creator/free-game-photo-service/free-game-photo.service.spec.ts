import { TestBed } from "@angular/core/testing";
import * as THREE from "three";
import { FreeGamePhotoService } from "./free-game-photo.service";

describe("FreeGamePhotoService", () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [FreeGamePhotoService],
  }));

  it("should be created", () => {
    const service: FreeGamePhotoService = TestBed.get(FreeGamePhotoService);
    expect(service).toBeTruthy();
  });

  // Test takePhoto
  it("should takePhoto to return the data string", () => {
    const service: FreeGamePhotoService = TestBed.get(FreeGamePhotoService);
    const scene: THREE.Scene = new THREE.Scene();
    const size: number = 36;
    const cube: THREE.Mesh = new THREE.Mesh(new THREE.BoxGeometry(size, size, size), new THREE.MeshPhongMaterial());
    scene.add(cube);
    const photoData: string = service.takePhoto(scene);
    const dataHeader: string = "data:";

    expect(photoData.substr(0, dataHeader.length)).toEqual(dataHeader);
    expect(photoData.length).toBeGreaterThan(dataHeader.length);
  });
});
