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

  public computeCollision(): boolean {
    return !!(this.camera && this.originalObjects && this.modifiedObjects);
  }
}
