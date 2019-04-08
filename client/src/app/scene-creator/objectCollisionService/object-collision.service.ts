import {Injectable} from "@angular/core";
import * as THREE from "three";

@Injectable({
  providedIn: "root",
})
export class ObjectCollisionService {
  private readonly directionVecs: THREE.Vector3[] = [
    new THREE.Vector3(0, 0, 1),
    new THREE.Vector3(0, 0, -1),
    new THREE.Vector3(1, 0, 0),
    new THREE.Vector3(-1, 0, 0),
    new THREE.Vector3(1, 0, 1),
    new THREE.Vector3(-1, 0, -1),
    new THREE.Vector3(1, 0, -1),
    new THREE.Vector3(-1, 0, 1),
    new THREE.Vector3(0, 1, -1),
    new THREE.Vector3(0, -1, -1),
    ];
  private readonly collisionDist: number = 25;

  private comparisonVec: THREE.Vector3;

  public constructor() {
    this.comparisonVec = new THREE.Vector3();
  }

  public raycastCollision(camera: THREE.Camera, oriObjs: THREE.Object3D[], modObjs: THREE.Object3D[], vel: THREE.Vector3): THREE.Vector3 {
    const velocity: THREE.Vector3 = vel.clone();
    for (const vec of this.directionVecs) {
      const vecClone: THREE.Vector3 = vec.clone().applyQuaternion(camera.quaternion);
      const ray: THREE.Raycaster = new THREE.Raycaster(camera.position.clone(), vecClone.normalize());
      const interOri: THREE.Intersection[] = ray.intersectObjects(oriObjs, true);
      if (this.isCollision(interOri)) {
        this.cancelVelocity(velocity, vecClone, vec);
      } else {
        const interMod: THREE.Intersection[] = ray.intersectObjects(modObjs, true);
        if (this.isCollision(interMod)) {
          this.cancelVelocity(velocity, vecClone, vec);
        }
      }
    }

    return velocity;
  }

  private isCollision(inter: THREE.Intersection[]): boolean {
    return (inter.length > 0 && inter[0].distance < this.collisionDist);
  }

  private cancelVelocity(vel: THREE.Vector3, dirColl: THREE.Vector3, oriDir: THREE.Vector3): void {
    this.comparisonVec = dirColl.clone();
    if (this.isReverseOrientation(oriDir.x, dirColl.x)) {
      this.comparisonVec.x = -this.comparisonVec.x;
    }
    if (this.isReverseOrientation(oriDir.z, dirColl.z)) {
      this.comparisonVec.z = -this.comparisonVec.z;
    }
    vel.x = this.velocityCalculation(vel.x, this.comparisonVec.x);
    vel.z = this.velocityCalculation(vel.z, this.comparisonVec.z);
  }

  private isReverseOrientation(oriDir: number, dirColl: number): boolean {
    return oriDir - dirColl < -1 || oriDir - dirColl > 1;
  }

  private velocityCalculation(vel: number, compVec: number): number {
    if (vel < 0 && compVec < 0) {
      return 0;
    } else if (vel > 0 && compVec > 0) {
      return 0;
    }

    return vel;
  }
}
