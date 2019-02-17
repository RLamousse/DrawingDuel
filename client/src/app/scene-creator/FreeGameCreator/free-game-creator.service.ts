import { Injectable } from "@angular/core";
import * as THREE from "three";
import { Form3DService } from "../3DFormService/3-dform.service";

@Injectable()
export class FreeGameCreatorService {

  public constructor(private formService: Form3DService) { }

  public scene: THREE.Scene;
  public modifiedScene: THREE.Scene;

  private originalLighting: THREE.DirectionalLight;
  private originalAmbiantLight: THREE.AmbientLight;
  private modifiedLighting: THREE.DirectionalLight;
  private modifiedAmbiantLight: THREE.AmbientLight;

  public obj3DToCreate: number = 100;
  public objects: THREE.Mesh[] = [];
  public modifiedObjects: THREE.Mesh[] = [];
  private minDistCenterObject: number = 43;

  private gameEnvX: number = 300;
  private gameEnvY: number = 300;
  private gameEnvZ: number = 300;

  public createScenes(): void {
    this.scene = new THREE.Scene();
    this.modifiedScene = new THREE.Scene();
    this.setLighting();
    this.generateScenes();

  }

  private getRandomValue(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  private setLighting(): void {
    const WHITELIGHT: number = 0xFFFFFF;
    const HOTLIGHT: number = 0xF0F0F0;
    this.originalLighting = new THREE.DirectionalLight(WHITELIGHT, 1);
    this.modifiedLighting = new THREE.DirectionalLight(WHITELIGHT, 1);
    this.originalLighting.position.set(0, 1, 1);
    this.modifiedLighting.position.set(0, 1, 1);
    this.scene.add(this.originalLighting);
    this.modifiedScene.add(this.modifiedLighting);

    this.originalAmbiantLight = new THREE.AmbientLight(HOTLIGHT);
    this.modifiedAmbiantLight = new THREE.AmbientLight(HOTLIGHT);
    this.scene.add(this.originalAmbiantLight);
    this.modifiedScene.add(this.modifiedAmbiantLight);
  }

  private generateScenes(): void {

    let object: THREE.Mesh;
    const PI: number = Math.PI;
    const FACTOR2: number = 2;
    const MAXROTATIONANGLE: number = PI * FACTOR2;
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
    for (const i of this.objects) {
      this.scene.add(i);
    }
  }
  private generateDifferences(): void {
    this.modifiedObjects = this.objects.map((mesh) => mesh.clone());
    enum modificationType { remove, add, colorChange }
    const maxModificationType: number = 2;
    const numberModifications: number = 7;
    for (let i: number = 0; i < numberModifications; i++) {
      const indexObjects: number = this.getRandomValue(0, this.modifiedObjects.length);
      const randomModification: number = this.getRandomValue(0, maxModificationType);
      switch (randomModification) {
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
          // this.formService.setColor(objects[indexObjects].geometry);
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
    for (const objectIndex of this.modifiedObjects) {
      this.modifiedScene.add(objectIndex);
    }
  }

  public generate3DObject(): THREE.Mesh {
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

  public handleCollision(object: THREE.Mesh): THREE.Mesh {
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
}
