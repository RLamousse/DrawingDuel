import { Injectable } from "@angular/core";
import * as THREE from "three";

@Injectable()
export class FreeGamePhotoService {
  private readonly fieldOfView: number = 90;
  private readonly nearClippingPane: number = 1;
  private readonly farClippingPane: number = 1000;
  private readonly backGroundColor: number = 0x0B7B90;
  private readonly renderSize: number = 400;

  private readonly cameraX: number = 0;
  private readonly cameraY: number = 0;
  private readonly cameraZ: number = 2;

  public takePhoto(originScene: THREE.Scene): string {
    const divElem: HTMLDivElement = (document.createElement("div")) as HTMLDivElement;
    const camera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera(
      this.fieldOfView,
      1,
      this.nearClippingPane,
      this.farClippingPane,
    );
    camera.position.x = this.cameraX;
    camera.position.y = this.cameraY;
    camera.position.z = this.cameraZ;

    const renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer({ preserveDrawingBuffer: true });
    renderer.setClearColor(this.backGroundColor);
    renderer.setPixelRatio(devicePixelRatio);
    renderer.setSize(this.renderSize, this.renderSize);
    divElem.appendChild(renderer.domElement);

    renderer.render(originScene, camera);

    return (divElem.children[0] as HTMLCanvasElement).toDataURL();
  }
}
