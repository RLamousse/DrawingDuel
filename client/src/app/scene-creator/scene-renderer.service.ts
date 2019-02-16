import { Injectable } from "@angular/core";
import * as THREE from "three";
require("three-first-person-controls")(THREE);

@Injectable()
export class SceneRendererService {

  private originalContainer: HTMLDivElement;
  private modifiedContainer: HTMLDivElement;
  private camera: THREE.PerspectiveCamera;
  private rendererOri: THREE.WebGLRenderer;
  private rendererMod: THREE.WebGLRenderer;
  public scene: THREE.Scene;
  public modifiedScene: THREE.Scene;
  private screenshot: boolean = true;

  private fpControls: THREE.FirstPersonControls;
  private mvmSpeed: number = 10;
  private lkSpeed: number = 0.05;
  private updateTime: number = 0.17;

  private fieldOfView: number = 90;
  private nearClippingPane: number = 1;
  private farClippingPane: number = 1000;
  private backGroundColor: number = 0x0B7B90;

  private cameraX: number = 0;
  private cameraY: number = 0;
  private cameraZ: number = 100;

  public obj3DToCreate: number = 100;
  public objects: THREE.Mesh[] = [];
  public modifiedObjects: THREE.Mesh[] = [];

  private setRenderer(): void {
    this.rendererOri = new THREE.WebGLRenderer({ preserveDrawingBuffer: true });
    this.rendererOri.setClearColor(this.backGroundColor);
    this.rendererOri.setPixelRatio(devicePixelRatio);
    this.rendererOri.setSize(this.originalContainer.clientWidth, this.originalContainer.clientHeight);
    this.originalContainer.appendChild(this.rendererOri.domElement);

    this.rendererMod = new THREE.WebGLRenderer();
    this.rendererMod.setClearColor(this.backGroundColor);
    this.rendererMod.setPixelRatio(devicePixelRatio);
    this.rendererMod.setSize(this.modifiedContainer.clientWidth, this.modifiedContainer.clientHeight);
    this.modifiedContainer.appendChild(this.rendererMod.domElement);

    this.fpControls = new THREE.FirstPersonControls(this.camera, this.rendererOri.domElement);
    this.fpControls.movementSpeed = this.mvmSpeed;
    this.fpControls.lookSpeed = this.lkSpeed;
  }

  private renderLoop(): void {
    requestAnimationFrame(() => this.renderLoop());
    this.rendererOri.render(this.scene, this.camera);
    this.rendererMod.render(this.modifiedScene, this.camera);
    this.fpControls.update(this.updateTime);
  }
  private setCamera(): void {
    const aspectRatio: number = this.getAspectRatio();

    this.camera = new THREE.PerspectiveCamera(
      this.fieldOfView,
      aspectRatio,
      this.nearClippingPane,
      this.farClippingPane,
    );
    this.camera.position.x = this.cameraX;
    this.camera.position.y = this.cameraY;
    this.camera.position.z = this.cameraZ;
  }

  private getAspectRatio(): number {
    return (this.originalContainer.clientWidth) / (this.originalContainer.clientHeight);
  }

  public onResize(): void {
    this.camera.aspect = this.getAspectRatio();
    this.camera.updateProjectionMatrix();
    this.rendererOri.setSize(this.originalContainer.clientWidth, this.originalContainer.clientHeight);
    this.rendererMod.setSize(this.modifiedContainer.clientWidth, this.modifiedContainer.clientHeight);
  }

  public init(oriCont: HTMLDivElement, modCont: HTMLDivElement): void {
    this.originalContainer = oriCont;
    this.modifiedContainer = modCont;
    this.setCamera();
    this.setRenderer();
  }

  public loadScenes(original: THREE.Scene, modified: THREE.Scene): void {
    this.scene = original;
    this.modifiedScene = modified;
    this.renderLoop();
  }

  public getSreenshots(original: THREE.Scene, modified: THREE.Scene): void {
    this.screenshot = true;
    if (this.screenshot) {
      const saveFile = (strData: string, filename: string) => {
        const link: HTMLAnchorElement = document.createElement("a");
        if (typeof link.download === "string") {
          document.body.appendChild(link);
          link.download = filename;
          link.href = strData;
          link.click();
          document.body.removeChild(link);
        } else {
          // location.replace(uri);
        }
      };
      try {
        const strMime: string = "image/jpeg";
        let imgData: string = this.rendererOri.domElement.toDataURL(strMime);
        const strDownloadMime: string = "image/octet-stream";
        saveFile(imgData.replace(strMime, strDownloadMime), "test1.jpg");
        this.camera.translateZ(-700);
        imgData = this.rendererOri.domElement.toDataURL(strMime);
        saveFile(imgData.replace(strMime, strDownloadMime), "test2.jpg");
      } catch (e) {
          throw (e);

          return;
      }
      this.screenshot = false;
    }
  }
}
