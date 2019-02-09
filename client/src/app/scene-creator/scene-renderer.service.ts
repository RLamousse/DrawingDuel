import { Injectable } from '@angular/core';
import * as THREE from 'three';
import { Form3DService } from "./3DFormService/3-dform.service";
//import { OrbitControls } from 'three-orbitcontrols-ts';
require('three-first-person-controls')(THREE);
@Injectable()
export class SceneRendererService {

  public constructor(private formService: Form3DService) { };

  private container: HTMLDivElement;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  //private controls: OrbitControls;
  private fpControls: THREE.FirstPersonControls;

  private lighting: THREE.DirectionalLight;
  private ambiantLight: THREE.AmbientLight;

  private fieldOfView: number = 90;
  private nearClippingPane: number = 1;
  private farClippingPane: number = 1000;

  private cameraX: number = 0;
  private cameraY: number = 0;
  private cameraZ: number = 100;

  private obj3DToCreate: number = 100;
  private objects: THREE.Mesh[] = [];
  private minDistCenterObject: number = 43.0;

  private setRenderer(): void {
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setClearColor(0x0b7b90);
    this.renderer.setPixelRatio(devicePixelRatio);
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    this.container.appendChild(this.renderer.domElement);
    //this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.fpControls = new THREE.FirstPersonControls(this.camera, this.renderer.domElement);
    this.fpControls.movementSpeed = 50;
    this.fpControls.lookSpeed = 0.05;
    this.renderLoop();
  }

  private renderLoop(): void {
    requestAnimationFrame(() => this.renderLoop());
    this.renderer.render(this.scene, this.camera);
    //this.controls.update();
    this.fpControls.update(0.17);
  }

  private getRandomValue(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  private create3DObjects() {
    enum objectGeometry { sphere, cube, cone, cylinder, pyramid }
    let randomObject: number;
    let object: THREE.Mesh;
    for (let i = 0; i < this.obj3DToCreate; ++i) {
      randomObject = this.getRandomValue(0, 4);
      switch (randomObject) {
        case objectGeometry.sphere: {
          object = this.formService.createSphere();
          break;
        }
        case objectGeometry.cube: {
          object = this.formService.createCube();
          break;
        }
        case objectGeometry.cone: {
          object = this.formService.createCone();
          break;
        }
        case objectGeometry.cylinder: {
          object = this.formService.createCylinder();
          break;
        }
        case objectGeometry.pyramid: {
          object = this.formService.createPyramid();
          break;
        }
        default: {
          object = new THREE.Mesh();
        }
      }
      let collision = true;
      let distanceVec: THREE.Vector3;
      object.position.set(
        this.getRandomValue(-300, 300),
        this.getRandomValue(-300, 300),
        this.getRandomValue(-300, 300)
      );
      object.rotation.set(this.getRandomValue(0, 360), this.getRandomValue(0, 360), this.getRandomValue(0, 360));
      if (this.objects.length != 0) {
        while (collision) {
          for (let i = 0; i < this.objects.length; ++i) {
            distanceVec = new THREE.Vector3(
              this.objects[i].position.x - object.position.x,
              this.objects[i].position.y - object.position.y,
              this.objects[i].position.z - object.position.z,
            );
            console.log(distanceVec.length());
            if (distanceVec.length() < this.minDistCenterObject) {
              object.position.set(this.getRandomValue(-300, 300), this.getRandomValue(-300, 300), this.getRandomValue(-300, 300));
              object.rotation.set(this.getRandomValue(0, 360), this.getRandomValue(0, 360), this.getRandomValue(0, 360));
              collision = true;
              break;
            } else { collision = false; }
          }
        }
      }
      
      this.objects.push(object);
      this.scene.add(object);
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
