import { TestBed } from "@angular/core/testing";
import {BoxGeometry, Mesh, MeshPhongMaterial, Scene} from "three";
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
  it("should takePhoto to return the data string", async(done) => {
    const service: FreeGamePhotoService = TestBed.get(FreeGamePhotoService);
    const scene: Scene = new Scene();
    const size: number = 36;
    const cube: Mesh = new Mesh(new BoxGeometry(size, size, size), new MeshPhongMaterial());
    scene.add(cube);
    const photoData: string = await service.takePhoto(scene);
    const dataHeader: string = "data:";

    expect(photoData.substr(0, dataHeader.length)).toEqual(dataHeader);
    expect(photoData.length).toBeGreaterThan(dataHeader.length);
    done();
  });
});
