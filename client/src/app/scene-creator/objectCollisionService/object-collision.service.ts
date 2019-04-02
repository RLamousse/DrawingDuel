import { Injectable } from "@angular/core";
import * as THREE from "three";

@Injectable({
  providedIn: "root",
})
export class ObjectCollisionService {

  private originalCollisionBoxes: THREE.Box3[];
  private modifiedCollisionBoxes: THREE.Box3[];
  private inCollision: boolean;
  private distance: THREE.Vector3;
  private resetDistX: number;
  private resetDistZ: number;

  private readonly maxDist: number = 5;
  private readonly distAmplifiyer: number = 2;

  public constructor() {
    this.originalCollisionBoxes = [];
    this.modifiedCollisionBoxes = [];
    this.inCollision  = false;
    this.distance = new THREE.Vector3;
    this.resetDistX = 0;
    this.resetDistZ = 0;
  }

  public setCollisionBox(original: THREE.Object3D[], modified: THREE.Object3D[]): void {
    for (const obj of original) {
      let box: THREE.Box3 = new THREE.Box3();
      box = box.setFromObject(obj);
      this.originalCollisionBoxes.push(box);
    }
    for (const obj of modified) {
      let box: THREE.Box3 = new THREE.Box3();
      box = box.setFromObject(obj);
      this.modifiedCollisionBoxes.push(box);
    }
  }

  public computeCollision(velocity: THREE.Vector3, camera: THREE.Camera, delta: number): void {
      if (!this.inCollision) {
        this.checkCollision(this.originalCollisionBoxes, camera, velocity);
        this.checkCollision(this.modifiedCollisionBoxes, camera, velocity);
      }
      this.computeDirection(velocity, this.distance, delta);
  }

  private checkCollision (collBoxes: THREE.Box3[], camera: THREE.Camera, velocity: THREE.Vector3): void {
    for (const obj of collBoxes) {
      if (obj.containsPoint(camera.position)) {
        const pos: THREE.Vector3 = new THREE.Vector3();
        obj.getCenter(pos);
        this.inCollision = true;
        this.distance = new THREE.Vector3(
          this.amplifyDist(pos.x, velocity.x),
          this.amplifyDist(pos.y, velocity.y),
          this.amplifyDist(pos.z, velocity.z),
        ).sub(camera.position);
      }
    }
  }

  private computeDirection(vel: THREE.Vector3, relDist: THREE.Vector3, delta: number): void {
    if (relDist.x < 0 && vel.x < 0) {
        vel.x = 0;
    } else if (relDist.x > 0 && vel.x > 0) {
        vel.x = 0;
    }
    this.resetDistX += delta * vel.x;
    if (this.resetDistX < -this.maxDist || this.resetDistX > this.maxDist) {
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
    if (this.resetDistZ < -this.maxDist || this.resetDistZ > this.maxDist) {
      this.inCollision = false;
      this.resetDistZ = 0;
      this.distance.set(0, 0, 0);
    }
  }
  private amplifyDist(dist: number, vel: number): number {
    if (vel < 0 && dist < 0) {
      dist = dist * this.distAmplifiyer;
    } else if (vel < 0 && dist > 0) {
      dist *= -this.distAmplifiyer;
    } else if (vel > 0 && dist < 0) {
      dist *= -this.distAmplifiyer;
    } else {
      dist *= this.distAmplifiyer;
    }

    return dist;
  }
}
