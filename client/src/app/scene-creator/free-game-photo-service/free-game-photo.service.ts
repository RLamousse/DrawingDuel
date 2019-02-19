import { Injectable } from "@angular/core";
// let domtoimage = require('dom-to-image');
import * as THREE from "three";

@Injectable()
export class FreeGamePhotoService {
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;

  private fieldOfView: number = 90;
  private nearClippingPane: number = 1;
  private farClippingPane: number = 1000;
  private backGroundColor: number = 0x0B7B90;

  private cameraX: number = 0;
  private cameraY: number = 0;
  private cameraZ: number = 100;

  public takePhotos(originScene: THREE.Scene, container: HTMLDivElement): void {
    this.camera = new THREE.PerspectiveCamera(
      this.fieldOfView,
      (container.clientWidth) / (container.clientHeight),
      this.nearClippingPane,
      this.farClippingPane,
    );
    this.camera.position.x = this.cameraX;
    this.camera.position.y = this.cameraY;
    this.camera.position.z = this.cameraZ;

    this.renderer = new THREE.WebGLRenderer({ preserveDrawingBuffer: true });
    this.renderer.setClearColor(this.backGroundColor);
    this.renderer.setPixelRatio(devicePixelRatio);
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(this.renderer.domElement);

    this.renderer.render(originScene, this.camera);
  }
}
