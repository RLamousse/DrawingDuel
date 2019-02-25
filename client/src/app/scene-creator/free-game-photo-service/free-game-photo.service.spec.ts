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
  it("should put inside the HMTLDivElement the rendererDomElement canvas", () => {
    const service: FreeGamePhotoService = TestBed.get(FreeGamePhotoService);
    const scene: THREE.Scene = new THREE.Scene();
    const size: number = 36;
    const cube: THREE.Mesh = new THREE.Mesh(new THREE.BoxGeometry(size, size, size), new THREE.MeshPhongMaterial());
    scene.add(cube);
    const divElem: HTMLDivElement = (document.createElement("div")) as HTMLDivElement;
    expect(divElem.innerHTML.length).toEqual(0);
    service.takePhoto(scene);

    expect(divElem.innerHTML.length).not.toEqual(0);
    expect(divElem.firstChild).toBeDefined();

    const compDivElem: HTMLDivElement = (document.createElement("div")) as HTMLDivElement;
    const compRenderer: THREE.WebGLRenderer = new THREE.WebGLRenderer({ preserveDrawingBuffer: true });
    compRenderer.setSize(compDivElem.clientWidth, compDivElem.clientHeight);
    compDivElem.appendChild(compRenderer.domElement);
    expect(divElem.innerHTML).toBe(compDivElem.innerHTML);
  });
});
