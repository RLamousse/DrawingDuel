import { Injectable } from "@angular/core";
import * as THREE from "three";
import { Form3DService } from "./3DFormService/3-dform.service";
require("three-first-person-controls")(THREE);

@Injectable()
export class SceneRendererService {

  public constructor(private formService: Form3DService) { }

  private container: HTMLDivElement;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;

  private fpControls: THREE.FirstPersonControls;
  private mvmSpeed: number = 50;
  private lkSpeed: number = 0.05;
  private updateTime: number = 0.17;

  private lighting: THREE.DirectionalLight;
  private ambiantLight: THREE.AmbientLight;

  private fieldOfView: number = 90;
  private nearClippingPane: number = 1;
  private farClippingPane: number = 1000;
  private backGroundColor: number = 0x0B7B90;

  private cameraX: number = 0;
  private cameraY: number = 0;
  private cameraZ: number = 100;

  public obj3DToCreate: number = 100;
  public objects: THREE.Mesh[] = [];
  private minDistCenterObject: number = 43;
  private PI: number = Math.PI;
  private maxRotationAngle: number = 2 * this.PI;

  private gameEnvX: number = 300;
  private gameEnvY: number = 300;
  private gameEnvZ: number = 300;

  private setRenderer(): void {
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setClearColor(this.backGroundColor);
    this.renderer.setPixelRatio(devicePixelRatio);
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    this.container.appendChild(this.renderer.domElement);

    this.fpControls = new THREE.FirstPersonControls(this.camera, this.renderer.domElement);
    this.fpControls.movementSpeed = this.mvmSpeed;
    this.fpControls.lookSpeed = this.lkSpeed;

    this.renderLoop();
  }

  private renderLoop(): void {
    requestAnimationFrame(() => this.renderLoop());
    this.renderer.render(this.scene, this.camera);
    this.fpControls.update(this.updateTime);
  }

  private getRandomValue(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  private create3DObjects(): void {

    let object: THREE.Mesh;
    for (let i: number = 0; i < this.obj3DToCreate; ++i) {
      object = this.generate3DObject();
      object.position.set(
        this.getRandomValue(-this.gameEnvX, this.gameEnvX),
        this.getRandomValue(-this.gameEnvY, this.gameEnvY),
        this.getRandomValue(-this.gameEnvZ, this.gameEnvZ),
      );
      object.rotation.set(
        this.getRandomValue(0, this.maxRotationAngle),
        this.getRandomValue(0, this.maxRotationAngle),
        this.getRandomValue(0, this.maxRotationAngle),
      );
      object = this.handleCollision(object);
      this.objects.push(object);
      this.scene.add(object);
    }
  }

  private generate3DObject(): THREE.Mesh {
    enum objectGeometry { sphere, cube, cone, cylinder, pyramid }
    let randomObject: number;
    let createdObject: THREE.Mesh;
    const maxTypeObject: number = 4;
    randomObject = this.getRandomValue(0, maxTypeObject);
    switch (randomObject) {
      case objectGeometry.sphere: {
        createdObject = this.formService.createSphere();
        break; }
      case objectGeometry.cube: {
        createdObject = this.formService.createCube();
        break; }
      case objectGeometry.cone: {
        createdObject = this.formService.createCone();
        break; }
      case objectGeometry.cylinder: {
        createdObject = this.formService.createCylinder();
        break; }
      case objectGeometry.pyramid: {
        createdObject = this.formService.createPyramid();
        break; }
      default: {
        createdObject = new THREE.Mesh(); }
    }

    return createdObject;
  }

  private handleCollision(object: THREE.Mesh): THREE.Mesh {
    let collision: boolean = true;
    let distanceVec: THREE.Vector3;
    if (this.objects.length !== 0) {
      while (collision) {
        for (const i of this.objects) {
          distanceVec = new THREE.Vector3(
            i.position.x - object.position.x,
            i.position.y - object.position.y,
            i.position.z - object.position.z,
          );
          if (distanceVec.length() < this.minDistCenterObject) {
            object.position.set(
              this.getRandomValue(-this.gameEnvX, this.gameEnvX),
              this.getRandomValue(-this.gameEnvY, this.gameEnvY),
              this.getRandomValue(-this.gameEnvZ, this.gameEnvZ),
            );
            collision = true;
            break;
          } else { collision = false; }
        }
      }
    }

    return object;
  }

  private setLighting(): void {
    const WHITELIGHT: number = 0xFFFFFF;
    const HOTLIGHT: number = 0xF0F0F0;
    this.lighting = new THREE.DirectionalLight(WHITELIGHT, 1);
    this.lighting.position.set(0, 1, 1);
    this.scene.add(this.lighting);

    this.ambiantLight = new THREE.AmbientLight(HOTLIGHT);
    this.scene.add(this.ambiantLight);
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

  private setScene(): void {
    this.scene = new THREE.Scene();
    this.setCamera();
    this.setLighting();
  }

  private getAspectRatio(): number {
    return (this.container.clientWidth) / (this.container.clientHeight);
  }

  public onResize(): void {
    this.camera.aspect = this.getAspectRatio();
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
  }

  public init(container: HTMLDivElement): void {
    this.container = container;
    this.setScene();
    this.create3DObjects();
    this.setRenderer();
  }
}
