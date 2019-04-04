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
    new THREE.Vector3(0, 1, 0),
    new THREE.Vector3(0, -1, 0),
    new THREE.Vector3(1, 0, 1),
    new THREE.Vector3(-1, 0, -1),
    new THREE.Vector3(1, 0, -1),
    new THREE.Vector3(-1, 0, 1),
    ];

  private readonly collisionDist: number = 25;

  public raycastCollision(camera: THREE.Camera, oriObjs: THREE.Object3D[], modObjs: THREE.Object3D[], vel: THREE.Vector3): void {
    for (const vec of this.directionVecs) {
      const vecClone: THREE.Vector3 = vec.clone().applyQuaternion(camera.quaternion);
      const ray: THREE.Raycaster = new THREE.Raycaster(camera.position.clone(), vecClone.normalize());
      const interOri: THREE.Intersection[] = ray.intersectObjects(oriObjs, true);
      const interMod: THREE.Intersection[] = ray.intersectObjects(modObjs, true);
      if (this.isCollision(interOri) || this.isCollision(interMod)) {
        this.cancelVelocity(vel, vecClone, vec);
      }
    }
  }
  private isCollision(inter: THREE.Intersection[]): boolean {
    return (inter.length > 0 && inter[0].distance < this.collisionDist);
  }

  private cancelVelocity(vel: THREE.Vector3, dirColl: THREE.Vector3, oriDir: THREE.Vector3): void {
    const comparisonVec: THREE.Vector3 = dirColl.clone();
    if (oriDir.x - dirColl.x < -1 || oriDir.x - dirColl.x > 1) {
      comparisonVec.x = -comparisonVec.x;
    }
    if (oriDir.z - dirColl.z < -1 || oriDir.z - dirColl.z > 1) {
      comparisonVec.z = -comparisonVec.z;
    }
    if (vel.x < 0 && comparisonVec.x < 0) {
      vel.x = 0;
    } else if (vel.x > 0 && comparisonVec.x > 0) {
      vel.x = 0;
    }
    if (vel.z < 0 && comparisonVec.z < 0) {
      vel.z = 0;
    } else if (vel.z > 0 && comparisonVec.z > 0) {
      vel.z = 0;
    }
  }
}
