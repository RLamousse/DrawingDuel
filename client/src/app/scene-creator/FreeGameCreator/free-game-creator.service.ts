import { Injectable } from "@angular/core";
import { ModificationType, ObjectGeometry } from "src/app/FreeGameCreatorInterface/free-game-enum";
import * as THREE from "three";
import { Form3DService } from "../3DFormService/3-dform.service";

@Injectable()
export class FreeGameCreatorService {

  public constructor(private formService: Form3DService) { }

  public scene: THREE.Scene;
  public modifiedScene: THREE.Scene;
  public objectTypes: ObjectGeometry[];
  public modificationTypes: ModificationType[];
  public obj3DToCreate: number = 50;

  private originalLighting: THREE.DirectionalLight;
  private originalAmbiantLight: THREE.AmbientLight;
  private modifiedLighting: THREE.DirectionalLight;
  private modifiedAmbiantLight: THREE.AmbientLight;

  public objects: THREE.Mesh[] = [];
  public modifiedObjects: THREE.Mesh[] = [];
  private minDistCenterObject: number = 43;

  private gameEnvX: number = 300;
  private gameEnvY: number = 300;
  private gameEnvZ: number = 300;

  public createScenes(): void {
    this.objects = [];
    this.modifiedObjects = [];
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
      object = this.handleCollision(object, this.objects);
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
    const numberModifications: number = 7;
    const indexes: Set<number> = new Set();
    while (indexes.size !== numberModifications) {
      indexes.add(this.getRandomValue(0, this.modifiedObjects.length - 1));
    }
    this.randomDifference(indexes);
    this.generateModifiedScene();
  }

  private randomDifference(table: Set<number>): void {
    const maxModificationType: number = this.modificationTypes.length - 1;
    const arrayIndexes: number[] = Array.from(table).sort().reverse();
    for (const index of arrayIndexes) {
      const randomModification: number = this.getRandomValue(0, maxModificationType);
      switch (this.modificationTypes[randomModification]) {
        case ModificationType.remove: {
          this.modifiedObjects.splice(index, 1);
          break;
        }
        case ModificationType.add: {
          let object: THREE.Mesh = this.generate3DObject();
          object = this.handleCollision(object, this.modifiedObjects);
          this.modifiedObjects.push(object);
          break;
        }
        case ModificationType.changeColor: {
          const mask: number = 0xFFFFFF;
          this.modifiedObjects[index].material = new THREE.MeshPhongMaterial({ color: (Math.random() * mask) });
          break;
        }
        default: {
          break;
        }
      }
    }
  }

  private generateModifiedScene(): void {
    for (const objectIndex of this.modifiedObjects) {
      this.modifiedScene.add(objectIndex);
    }
  }

  private generate3DObject(): THREE.Mesh {
    let randomObject: number;
    let createdObject: THREE.Mesh;
    const maxTypeObject: number = 4;
    randomObject = this.getRandomValue(0, maxTypeObject);
    switch (this.objectTypes[randomObject]) {
      case ObjectGeometry.sphere: {
        createdObject = this.formService.createSphere();
        break; }
      case ObjectGeometry.cube: {
        createdObject = this.formService.createCube();
        break; }
      case ObjectGeometry.cone: {
        createdObject = this.formService.createCone();
        break; }
      case ObjectGeometry.cylinder: {
        createdObject = this.formService.createCylinder();
        break; }
      case ObjectGeometry.pyramid: {
        createdObject = this.formService.createPyramid();
        break; }
      default: {
        createdObject = new THREE.Mesh(); }
    }

    return createdObject;
  }

  private handleCollision(object: THREE.Mesh, list: THREE.Mesh[]): THREE.Mesh {
    let collision: boolean = true;
    let distanceVec: THREE.Vector3;
    if (list.length !== 0) {
      while (collision) {
        for (const i of list) {
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