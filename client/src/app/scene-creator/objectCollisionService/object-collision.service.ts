import {Injectable} from "@angular/core";
import {Camera, Intersection, Object3D, Raycaster, Vector3} from "three";

@Injectable({
  providedIn: "root",
})
export class ObjectCollisionService {
  private readonly directionVecs: Vector3[] = [
    new Vector3(0, 0, 1),
    new Vector3(0, 0, -1),
    new Vector3(1, 0, 0),
    new Vector3(-1, 0, 0),
    new Vector3(1, 0, 1),
    new Vector3(-1, 0, -1),
    new Vector3(1, 0, -1),
    new Vector3(-1, 0, 1),
    new Vector3(0, 1, -1),
    new Vector3(0, -1, -1),
    ];
  private readonly collisionDist: number = 25;

  private comparisonVec: Vector3;

  public constructor() {
    this.comparisonVec = new Vector3();
  }

  public raycastCollision(camera: Camera, oriObjs: Object3D[], modObjs: Object3D[], vel: Vector3): Vector3 {
    const velocity: Vector3 = vel.clone();
    for (const vec of this.directionVecs) {
      const vecClone: Vector3 = vec.clone().applyQuaternion(camera.quaternion);
      const ray: Raycaster = new Raycaster(camera.position.clone(), vecClone.normalize());
      const interOri: Intersection[] = ray.intersectObjects(oriObjs, true);
      if (this.isCollision(interOri)) {
        this.cancelVelocity(velocity, vecClone, vec);
      } else {
        const interMod: Intersection[] = ray.intersectObjects(modObjs, true);
        if (this.isCollision(interMod)) {
          this.cancelVelocity(velocity, vecClone, vec);
        }
      }
    }

    return velocity;
  }

  private isCollision(inter: Intersection[]): boolean {
    return (inter.length > 0 && inter[0].distance < this.collisionDist);
  }

  private cancelVelocity(vel: Vector3, dirColl: Vector3, oriDir: Vector3): void {
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
