import { Injectable } from "@angular/core";
import * as THREE from "three";

@Injectable({
  providedIn: "root",
})
export class ObjectCollisionService {

  private camera: THREE.Camera;
  private originalObjects: THREE.Object3D[];
  private modifiedObjects: THREE.Object3D[];

  public constructor() {
    this.camera = new THREE.Camera();
    this.originalObjects = [];
    this.modifiedObjects = [];
  }

  public setCollision(camera: THREE.Camera, original: THREE.Object3D[], modified: THREE.Object3D[]): void {
    this.camera = camera;
    this.originalObjects = original;
    this.modifiedObjects = modified;
  }

  public computeCollision(velocity: THREE.Vector3): boolean {
    return !!(this.camera && this.originalObjects && this.modifiedObjects);
    const direction = this.computeDirection(velocity);

  }

  private computeDirection(velocity: THREE.Vector3): THREE.Vector3 {
    const direction: THREE.Vector3 = new THREE.Vector3(0 , 0, 0);
    if (velocity.x < 0) {
      direction.x = -1;
    } else if (velocity.x > 0) {
      direction.x = 1;
    }
    if (velocity.y < 0) {
      direction.y = -1;
    } else if (velocity.y > 0) {
      direction.y = 1;
    }
    if (velocity.z < 0) {
      direction.z = -1;
    } else if (velocity.z > 0) {
      direction.z = 1;
    }

    return direction;
  }
}
