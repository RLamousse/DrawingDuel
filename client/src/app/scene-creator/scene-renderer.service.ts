import { Injectable } from "@angular/core";
import * as THREE from "three";
import { Form3DService } from "./3DFormService/3-dform.service";
require("three-first-person-controls")(THREE);

@Injectable()
export class SceneRendererService {

  public constructor(private formService: Form3DService) { }

  private originalContainer: HTMLDivElement;
  private modifiedContainer: HTMLDivElement;
  private camera: THREE.PerspectiveCamera;
  private rendererOri: THREE.WebGLRenderer;
  private rendererMod: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private modifiedScene: THREE.Scene;

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

  public obj3DToCreate: number = 2;
  public objects: THREE.Mesh[] = [];
  public modifiedObjects: THREE.Mesh[] = [];
  private minDistCenterObject: number = 43;

  private gameEnvX: number = 300;
  private gameEnvY: number = 300;
  private gameEnvZ: number = 300;

  private setRenderer(): void {
    this.rendererOri = new THREE.WebGLRenderer();
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

    this.renderLoop();
  }

  private renderLoop(): void {
    requestAnimationFrame(() => this.renderLoop());
    this.rendererOri.render(this.scene, this.camera);
    this.rendererMod.render(this.modifiedScene, this.camera);
    this.fpControls.update(this.updateTime);
  }

  private getRandomValue(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  private create3DObjects(): void {

    let object: THREE.Mesh;
    const MAXROTATIONANGLE: number = 2 * Math.PI;
    for (let i: number = 0; i < this.obj3DToCreate; ++i) {
      object = this.generate3DObject();
      object.position.set(
        this.getRandomValue(-this.gameEnvX, this.gameEnvX),
        this.getRandomValue(-this.gameEnvY, this.gameEnvY),
        this.getRandomValue(-this.gameEnvZ, this.gameEnvZ),
      );
      object.rotation.set(
        this.getRandomValue(0, MAXROTATIONANGLE),
        this.getRandomValue(0, MAXROTATIONANGLE),
        this.getRandomValue(0, MAXROTATIONANGLE),
      );
      object = this.handleCollision(object);
      this.objects.push(object);
    }
    this.generateOriginalScene();
    this.generateDifferences();
  }

  private generateOriginalScene(): void {
    for (let i of this.objects) {
      this.scene.add(i);
    }
  }
  public generateDifferences(): void {
    /*for (let i of objSource) {
      i = this.handleCollision(i);
    }*/
    this.modifiedObjects = this.objects.map((mesh)=> mesh.clone());
    //this.modifiedObjects = this.objects;
    enum modificationType { remove, add, colorChange }
    //const maxModificationType: number = 2;
    const numberModifications: number = 7;
    for (let i: number = 0; i < numberModifications; i++) {
      const indexObjects: number = this.getRandomValue(0, this.modifiedObjects.length);
      //const randomModification: number = this.getRandomValue(0, maxModificationType);
      switch (modificationType.add) {
        case modificationType.remove: {
          this.modifiedObjects.splice(indexObjects, 1);
          break;
        }
        case modificationType.add: {
          let object: THREE.Mesh = this.generate3DObject();
          object = this.handleCollision(object);
          this.modifiedObjects.push(object);
          break;
        }
        case modificationType.colorChange: {
          //this.formService.setColor(objects[indexObjects].geometry);
          break;
        }
        default: {
          break;
        }
      }
    }
    this.generateModifiedScene();
  }

  private generateModifiedScene(): void {
    //const objs: THREE.Mesh[] = this.generateDifferences(this.objects, this.modifObjects);
    for (let objectIndex of this.modifiedObjects) {
      //objectIndex = this.handleCollision(objectIndex);
      this.modifiedScene.add(objectIndex);
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
    this.modifiedScene.add(this.lighting);

    this.ambiantLight = new THREE.AmbientLight(HOTLIGHT);
    this.scene.add(this.ambiantLight);
    this.modifiedScene.add(this.ambiantLight);
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
    this.modifiedScene = new THREE.Scene();
    this.setCamera();
    this.setLighting();
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
    this.setScene();
    this.create3DObjects();
    this.setRenderer();
  }
}
