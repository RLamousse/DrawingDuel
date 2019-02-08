import { Injectable } from '@angular/core';
import * as THREE from 'three';
import { Form3DService } from "./3DFormService/3-dform.service";

@Injectable()
export class SceneRendererService {

  public constructor(private formService: Form3DService) { };

  private container: HTMLDivElement;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  //private controls: THREE.FirstPersonControls;

  private fieldOfView: number = 90;
  private nearClippingPane: number = 1;
  private farClippingPane: number = 1000;

  private cameraX: number = 0;
  private cameraY: number = 0;
  private cameraZ: number = 400;

  private setRenderer(): void {
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setPixelRatio(devicePixelRatio);
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    this.container.appendChild(this.renderer.domElement);

    this.renderLoop();
  }

  private renderLoop(): void {
    requestAnimationFrame(() => this.renderLoop());
    this.renderer.render(this.scene, this.camera);
  }

  private create3DObjects() {

    this.scene.add(this.formService.createCube());
  }

  private setCamera(): void {
    const aspectRatio: number = this.getAspectRatio();

    this.camera = new THREE.PerspectiveCamera(
      this.fieldOfView,
      aspectRatio,
      this.nearClippingPane,
      this.farClippingPane
    );
    this.camera.position.x = this.cameraX;
    this.camera.position.y = this.cameraY;
    this.camera.position.z = this.cameraZ;
  }

  private setScene(): void {
    this.scene = new THREE.Scene();
    this.setCamera();
  }

  private getAspectRatio() {
    return (this.container.clientWidth) / (this.container.clientHeight);
  }

  public onResize() {
    this.camera.aspect = this.getAspectRatio();
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
  }

  public init(container: HTMLDivElement): void {
    this.container = container;
    this.setScene();
    //this.controls = new THREE.FirstPersonControls(this.camera, this.container);
    this.create3DObjects();
    this.setRenderer();
  }
}
