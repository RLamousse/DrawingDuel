import { Injectable } from "@angular/core";
import {Camera, Euler, Mesh, MeshPhongMaterial, Object3D, Scene, Vector3} from "three";

@Injectable({
  providedIn: "root",
})
export class RenderUpdateService {
  private readonly decelerationFactor: number = 10;
  private readonly accelerationFactor: number = 600;
  private readonly camRotationSpeedFactor: number = 800;
  private readonly ORIGINAL_NAME: string = "original";
  private readonly MODIFIED_NAME: string = "modified";

  private up: boolean;
  private down: boolean;
  private left: boolean;
  private right: boolean;
  private oldX: number;
  private oldY: number;
  private deltaX: number;
  private deltaY: number;

  public rightClick: boolean = false;

  public constructor() {
    this.up = false;
    this.down = false;
    this.left = false;
    this.right = false;
    this.oldX = 0;
    this.oldY = 0;
    this.deltaX = 0;
    this.deltaY = 0;
  }

  public updateVelocity(velocity: Vector3, delta: number): void {
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

  public updateCamera(camera: Camera, delta: number, velocity: Vector3): void {
    camera.translateZ( velocity.z * delta );
    camera.translateX( velocity.x * delta );
    if ( this.rightClick ) {
      const eulerRotation: Euler = new Euler(0, 0, 0, "YXZ");
      eulerRotation.x = this.deltaX;
      eulerRotation.y = this.deltaY;
      camera.quaternion.setFromEuler(eulerRotation);
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
    }
  }

  public rotationCamera(xPos: number, yPos: number): void {
    this.deltaY += (this.oldX - xPos) * Math.PI / this.camRotationSpeedFactor;
    this.deltaX += (this.oldY - yPos) * Math.PI / this.camRotationSpeedFactor;
  }

  public updateDifference(object: Object3D, scene: Scene, modifiedScene: Scene): void {
    let originalObj: Object3D = new Object3D();
    let modifObj: Object3D = new Object3D();
    for (const obj of modifiedScene.children) {
      if (obj.position.equals(object.position)) {
        modifObj = obj;
        modifObj.name = this.MODIFIED_NAME;
      }
    }
    for (const obj of scene.children) {
      if (obj.position.equals(object.position)) {
        originalObj = obj.clone();
        originalObj.name = this.ORIGINAL_NAME;
      }
    }
    if (originalObj.name && modifObj.name) {
      const modifMaterial: MeshPhongMaterial = (modifObj as Mesh).material as MeshPhongMaterial;
      if (modifMaterial) {
        (modifMaterial).color =
          ((originalObj as Mesh).material as MeshPhongMaterial).color;
      } else {
        modifObj.visible = false;
        modifiedScene.add(originalObj);
      }
    } else if (!originalObj.name) {
      modifiedScene.remove(modifObj);
    } else {
      modifiedScene.add(originalObj);
    }
  }
}
