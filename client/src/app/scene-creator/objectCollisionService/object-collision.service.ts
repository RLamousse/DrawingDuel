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
    new THREE.Vector3(-1, 0, 1),
    new THREE.Vector3(1, 0, -1),
    new THREE.Vector3(-1, 0, -1),
    ];

  private readonly collisionDist: number = 30;

  public constructor() {
  }

  public raycastCollision(camera: THREE.Camera, oriObjs: THREE.Object3D[], modObjs: THREE.Object3D[], vel: THREE.Vector3): void {
    for (const vec of this.directionVecs) {
      const ray: THREE.Raycaster = new THREE.Raycaster(camera.position.clone(), vec.normalize().clone());
      const interOri: THREE.Intersection[] = ray.intersectObjects(oriObjs, true);
      const interMod: THREE.Intersection[] = ray.intersectObjects(oriObjs, true);
      if (this.isCollision(interOri)) {
        this.cancelVelocity(vel, vec);
      } else if (this.isCollision(interMod)) {
        this.cancelVelocity(vel, vec);
      }
    }
  }
  private isCollision(inter: THREE.Intersection[]): boolean {
    return (inter.length > 0 && inter[0].distance < this.collisionDist);
  }

  private cancelVelocity(vel: THREE.Vector3, dir: THREE.Vector3): void {
    if (vel.x < 0 && dir.x < 0) {
      vel.x = 0;
    } else if (vel.x > 0 && dir.x > 0) {
      vel.x = 0;
    }
    if (vel.z < 0 && dir.z < 0) {
      vel.z = 0;
    } else if (vel.z > 0 && dir.z > 0) {
      vel.z = 0;
    }
  }
}
