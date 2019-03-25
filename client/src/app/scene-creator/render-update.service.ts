import { Injectable } from "@angular/core";
import * as THREE from "three";
import {Coordinate} from "../../../../common/free-game-json-interface/FreeGameCreatorInterface/free-game-enum";

@Injectable({
  providedIn: "root",
})
export class RenderUpdateService {
  private readonly decelerationFactor: number = 10;
  private readonly accelerationFactor: number = 600;
  private readonly camRotationSpeedFactor: number = 4000;

  private up: boolean;
  private down: boolean;
  private left: boolean;
  private right: boolean;
  private rightClick: boolean = false;
  private oldX: number = 0;
  private oldY: number = 0;
  private deltaX: number = 0;
  private deltaY: number = 0;

  public constructor() {/*vide*/}

  public updateVelocity(velocity: THREE.Vector3, delta: number): void {
    velocity.z -= velocity.z * this.decelerationFactor * delta;
    velocity.x -= velocity.x * this.decelerationFactor * delta;
    if ( this.up ) {
      velocity.z -= this.accelerationFactor * delta;
    }
    if ( this.down ) {
      velocity.z += this.accelerationFactor * delta;
    }
    if ( this.left ) {
      velocity.x -= this.accelerationFactor * delta;
    }
    if ( this.right ) {
      velocity.x += this.accelerationFactor * delta;
    }
  }

  public updateCamera(camera: THREE.Camera, delta: number, velocity: THREE.Vector3): void {
    camera.translateZ( velocity.z * delta );
    camera.translateX( velocity.x * delta );
    if ( this.rightClick ) {
      camera.rotateX(this.deltaX);
      camera.rotateY(this.deltaY);
    }
  }
  public moveForward(isMoving: boolean): void {
    this.up = isMoving;
  }
  public moveBackward(isMoving: boolean): void {
    this.down = isMoving;
  }
  public moveLeft(isMoving: boolean): void {
    this.left = isMoving;
  }
  public moveRight(isMoving: boolean): void {
    this.right = isMoving;
  }

  public rightClickHold(xPos: number, yPos: number): void {
    if (this.rightClick) {
      this.oldX = xPos;
      this.oldY = yPos;
      this.deltaX = 0;
      this.deltaY = 0;
    }
  }

  public rotateCamera(xPos: number, yPos: number): void {
    this.deltaY = (this.oldX - xPos) / this.camRotationSpeedFactor;
    this.deltaX = (this.oldY - yPos) / this.camRotationSpeedFactor;
  }

  public updateDifference(object: THREE.Intersection, scene: THREE.Scene, modifiedScene: THREE.Scene): void {
    let originalObj: THREE.Object3D = new THREE.Object3D();
    let modifObj: THREE.Object3D = new THREE.Object3D();
    for (const obj of modifiedScene.children) {
      if (this.isSameCenter(obj.position, object.object.position)) {
        modifObj = obj;
        modifObj.name = "modified";
      }
    }
    for (const obj of scene.children) {
      if (this.isSameCenter(obj.position, object.object.position)) {
        originalObj = obj.clone();
        originalObj.name = "original";
      }
    }
    if (originalObj.name !== "" && modifObj.name !== "") {
      ((modifObj as THREE.Mesh).material as THREE.MeshPhongMaterial).color =
        ((originalObj as THREE.Mesh).material as THREE.MeshPhongMaterial).color;
    } else if (originalObj.name === "") {
      modifiedScene.remove(modifObj);
    } else {
      modifiedScene.add(originalObj);
    }
  }

  private isSameCenter (center1: THREE.Vector3, center2: THREE.Vector3): boolean {
    return (center1.x === center2.x &&
      center1.y === center2.y &&
      center1.z === center2.z);
  }

  public isSameObject(obj1: number[], obj2: number[]): boolean {
    return (obj1[Coordinate.X] === obj2[Coordinate.X] &&
      obj1[Coordinate.Y] === obj2[Coordinate.Y] &&
      obj1[Coordinate.Z] === obj2[Coordinate.Z]);
  }
}
