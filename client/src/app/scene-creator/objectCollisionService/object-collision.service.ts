import { Injectable } from "@angular/core";
import * as THREE from "three";

@Injectable({
  providedIn: "root",
})
export class ObjectCollisionService {

  private originalObjects: THREE.Object3D[];
  private modifiedObjects: THREE.Object3D[];
  private inCollision: boolean;
  private distance: THREE.Vector3;
  private resetDistX: number;
  private resetDistZ: number;

  public constructor() {
    this.originalObjects = [];
    this.modifiedObjects = [];
    this.inCollision  = false;
    this.distance = new THREE.Vector3;
    this.resetDistX = 0;
    this.resetDistZ = 0;
  }

  public setCollision(original: THREE.Object3D[], modified: THREE.Object3D[]): void {
    this.originalObjects = original;
    this.modifiedObjects = modified;
  }

  public computeCollision(velocity: THREE.Vector3, camera: THREE.Camera, delta: number): void {
      if (!this.inCollision) {
        for (const obj of this.originalObjects) {
          let box: THREE.Box3 = new THREE.Box3();
          box = box.setFromObject(obj);
          if (box.containsPoint(camera.position)) {
            const pos: THREE.Vector3 = obj.position.clone();
            this.inCollision = true;
            this.distance = new THREE.Vector3(
              this.amplifyDist(pos.x, velocity.x),
              this.amplifyDist(pos.y, velocity.y),
              this.amplifyDist(pos.z, velocity.z),
            ).sub(camera.position);
          }
        }
      }
      this.computeDirection(velocity, this.distance, delta);
  }

  private computeDirection(vel: THREE.Vector3, relDist: THREE.Vector3, delta: number): void {
    if (relDist.x < 0 && vel.x < 0) {
        vel.x = 0;
    } else if (relDist.x > 0 && vel.x > 0) {
        vel.x = 0;
    }
    this.resetDistX += delta * vel.x;
    if (this.resetDistX < -5 || this.resetDistX > 5) {
      this.inCollision = false;
      this.resetDistX = 0;
      this.distance.set(0, 0, 0);
    }
    if (relDist.z < 0 && vel.z < 0) {
      vel.z = 0;
    } else if (relDist.z > 0 && vel.z > 0) {
      vel.z = 0;
    }
    this.resetDistZ += delta * vel.z;
    if (this.resetDistZ < -5 || this.resetDistZ > 5) {
      this.inCollision = false;
      this.resetDistZ = 0;
      this.distance.set(0, 0, 0);
    }
  }
  private amplifyDist(dist: number, vel: number): number {
    if (vel < 0 && dist < 0) {
      dist = dist * 2;
    } else if (vel < 0 && dist > 0) {
      dist *= -2;
    } else if (vel > 0 && dist < 0) {
      dist *= -2;
    } else {
      dist *= 2;
    }

    return dist;
  }
}
