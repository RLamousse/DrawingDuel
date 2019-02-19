import { Injectable } from "@angular/core";
import * as THREE from "three";

@Injectable()
export class FreeGamePhotoService {
  private fieldOfView: number;
  private nearClippingPane: number;
  private farClippingPane: number;
  private backGroundColor: number;

  private cameraX: number;
  private cameraY: number;
  private cameraZ: number;

  public constructor() {
    this.fieldOfView = 90;
    this.nearClippingPane = 1;
    this.farClippingPane = 1000;
    this.backGroundColor = 0x0B7B90;

    this.cameraX = 0;
    this.cameraY = 0;
    this.cameraZ = 100;
  }

  public takePhoto(originScene: THREE.Scene, container: HTMLDivElement): void {
    const camera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera(
      this.fieldOfView,
      (container.clientWidth) / (container.clientHeight),
      this.nearClippingPane,
      this.farClippingPane,
    );
    camera.position.x = this.cameraX;
    camera.position.y = this.cameraY;
    camera.position.z = this.cameraZ;

    const renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer({ preserveDrawingBuffer: true });
    renderer.setClearColor(this.backGroundColor);
    renderer.setPixelRatio(devicePixelRatio);
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    renderer.render(originScene, camera);
  }
}
