import { Injectable } from "@angular/core";
import * as THREE from "three";

@Injectable({
  providedIn: "root",
})
export class RenderUpdateService {
  private readonly decelerationFactor: number = 10;
  private readonly accelerationFactor: number = 600;
  private readonly camRotationSpeedFactor: number = 4000;

  public up: boolean;
  public down: boolean;
  public left: boolean;
  public right: boolean;
  public rightClick: boolean = false;
  public oldX: number = 0;
  public oldY: number = 0;
  public deltaX: number = 0;
  public deltaY: number = 0;

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
}
