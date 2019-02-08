import { Injectable } from '@angular/core';
import * as THREE from 'three';
import { Form3DService } from "./3DFormService/3-dform.service";
import { OrbitControls } from 'three-orbitcontrols-ts';

@Injectable()
export class SceneRendererService {

  public constructor(private formService: Form3DService) { };

  private container: HTMLDivElement;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private controls: OrbitControls;

  private lighting: THREE.DirectionalLight;
  private ambiantLight: THREE.AmbientLight;

  private fieldOfView: number = 90;
  private nearClippingPane: number = 1;
  private farClippingPane: number = 1000;

  private cameraX: number = 0;
  private cameraY: number = 0;
  private cameraZ: number = 100;

  private obj3DToCreate: number = 100;

  private setRenderer(): void {
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setClearColor(0x0b7b90);
    this.renderer.setPixelRatio(devicePixelRatio);
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    this.renderer.shadowMap.type = THREE.BasicShadowMap;
    this.renderer.shadowMap.enabled = true;
    this.container.appendChild(this.renderer.domElement);
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);

    this.renderLoop();
  }

  private renderLoop(): void {
    requestAnimationFrame(() => this.renderLoop());
    this.renderer.render(this.scene, this.camera);
    this.controls.update();
  }

  private getRandomValue(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  private create3DObjects() {
    enum objectGemoetry { sphere, cube, cone, cylinder, pyramid }
    let randomObject: number;
    let object: THREE.Mesh;
    for (let i = 0; i < this.obj3DToCreate; ++i) {
      randomObject = this.getRandomValue(0, 4);
      switch (randomObject) {
        case objectGemoetry.sphere: {
          object = this.formService.createSphere();
          object.position.set(this.getRandomValue(0, 10), this.getRandomValue(0,10), this.getRandomValue(this.nearClippingPane, this.farClippingPane));
          this.scene.add(object);
          break;
        }
        case objectGemoetry.cube: {
          break;
        }
        case objectGemoetry.cone: {
          break;
        }
        case objectGemoetry.cylinder: {
          break;
        }
        case objectGemoetry.pyramid: {
          break;
        }
          }
    }
  }

  private setLighting(): void {
    this.lighting = new THREE.DirectionalLight(0xffffff, 1);
    this.lighting.position.set(0, 1.0, 1.0);
    this.scene.add(this.lighting);

    this.ambiantLight = new THREE.AmbientLight(0xF0F0F0);
    this.scene.add(this.ambiantLight);
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
    this.setLighting();
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
