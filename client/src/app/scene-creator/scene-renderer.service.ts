import { Injectable } from '@angular/core';
import * as THREE from 'three';

@Injectable()
export class SceneRendererService {

  private container: HTMLDivElement;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  //private controls: THREE.FirstPersonControls;

  private fieldOfView = 70;
  private nearClippingPane = 1;
  private farClippingPane = 1000;

  private cameraX = 0;
  private cameraY = 0;
  private cameraZ = 400;

  private setRenderer(): void {
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setPixelRatio(devicePixelRatio);
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    this.container.appendChild(this.renderer.domElement);

    this.renderLoop();
  }

  private renderLoop(): void {
    this.renderer.render(this.scene, this.camera);
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
    return this.container.clientWidth / this.container.clientHeight;
  }

  public onResize() {
    this.camera.aspect = this.getAspectRatio();
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
  }

  public init(container: HTMLDivElement): void {
    this.setScene();
    //this.controls = new THREE.FirstPersonControls(this.camera, this.container);

    this.container = container;
    this.setRenderer();
  }
}
