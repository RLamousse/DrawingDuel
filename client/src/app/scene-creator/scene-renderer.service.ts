import { Injectable } from "@angular/core";
import * as THREE from "three";
import { ComponentNotLoadedError } from "../../../../common/errors/component.errors";

@Injectable()
export class SceneRendererService {

  public originalContainer: HTMLDivElement;
  public modifiedContainer: HTMLDivElement;
  public scene: THREE.Scene;
  public modifiedScene: THREE.Scene;

  private camera: THREE.PerspectiveCamera;
  private rendererOri: THREE.WebGLRenderer;
  private rendererMod: THREE.WebGLRenderer;

  private time: number;
  private prevTime: number;
  private velocity: THREE.Vector3;

  public up: boolean;
  public down: boolean;
  public left: boolean;
  public right: boolean;

  public rightClick: boolean = false;
  public oldX: number = 0;
  public oldY: number = 0;
  public deltaX: number = 0;
  public deltaY: number = 0;

  private readonly fieldOfView: number = 90;
  private readonly nearClippingPane: number = 1;
  private readonly farClippingPane: number = 1000;
  private readonly backGroundColor: number = 0x0B7B90;

  private readonly cameraX: number = 0;
  private readonly cameraY: number = 0;
  private readonly cameraZ: number = 100;
  private readonly camRotationSpeedFactor: number = 4000;
  private readonly timeFactor: number = 1000;
  private readonly decelerationFactor: number = 10;
  private readonly accelerationFactor: number = 600;

  private setRenderer(): void {
    this.rendererOri = new THREE.WebGLRenderer({ preserveDrawingBuffer: true });
    this.rendererOri.setClearColor(this.backGroundColor);
    this.rendererOri.setPixelRatio(devicePixelRatio);
    this.rendererOri.setSize(this.originalContainer.clientWidth, this.originalContainer.clientHeight);
    this.originalContainer.appendChild(this.rendererOri.domElement);

    this.rendererMod = new THREE.WebGLRenderer();
    this.rendererMod.setClearColor(this.backGroundColor);
    this.rendererMod.setPixelRatio(devicePixelRatio);
    this.rendererMod.setSize(this.modifiedContainer.clientWidth, this.modifiedContainer.clientHeight);
    this.modifiedContainer.appendChild(this.rendererMod.domElement);
  }

  private renderLoop(): void {

    requestAnimationFrame(() => this.renderLoop());
    this.rendererOri.render(this.scene, this.camera);
    this.rendererMod.render(this.modifiedScene, this.camera);
    this.time = performance.now();
    const delta: number = (this.time - this.prevTime) / this.timeFactor;
    this.velocity.z -= this.velocity.z * this.decelerationFactor * delta;
    this.velocity.x -= this.velocity.x * this.decelerationFactor * delta;
    if ( this.up ) {
      this.velocity.z -= this.accelerationFactor * delta;
    }
    if ( this.down ) {
      this.velocity.z += this.accelerationFactor * delta;
    }
    if ( this.left ) {
      this.velocity.x -= this.accelerationFactor * delta;
    }
    if ( this.right ) {
      this.velocity.x += this.accelerationFactor * delta;
    }
    this.camera.translateZ( this.velocity.z * delta );
    this.camera.translateX( this.velocity.x * delta );
    if ( this.rightClick ) {
      this.camera.rotateX(this.deltaX);
      this.camera.rotateY(this.deltaY);
    }
    this.prevTime = this.time;
  }
  private setCamera(): void {
    const aspectRatio: number = this.getAspectRatio();

    this.camera = new THREE.PerspectiveCamera(
      this.fieldOfView,
      aspectRatio,
      this.nearClippingPane,
      this.farClippingPane,
    );
    this.camera.position.x = this.cameraX;
    this.camera.position.y = this.cameraY;
    this.camera.position.z = this.cameraZ;
  }

  private getAspectRatio(): number {
    return (this.originalContainer.clientWidth) / (this.originalContainer.clientHeight);
  }

  public init(oriCont: HTMLDivElement, modCont: HTMLDivElement): void {
    this.originalContainer = oriCont;
    this.modifiedContainer = modCont;
    this.setCamera();
    this.setRenderer();
  }

  public loadScenes(original: THREE.Scene, modified: THREE.Scene): void {
    if (this.originalContainer === undefined || this.modifiedContainer === undefined) {
      throw (new ComponentNotLoadedError());
    }
    this.scene = original;
    this.modifiedScene = modified;
    this.time = 0;
    this.prevTime = performance.now();
    this.velocity = new THREE.Vector3();
    this.renderLoop();
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

  public getClickedObject(xPos: number, yPos: number): void {
      let x: number = 0;
      let y: number = 0;
      const POS_FACT: number = 2;
      if ( xPos < this.rendererMod.domElement.offsetLeft) {
        x = ((xPos - this.rendererOri.domElement.offsetLeft) / this.rendererOri.domElement.offsetWidth) * POS_FACT - 1;
        y = -((yPos - this.rendererOri.domElement.offsetTop) / this.rendererOri.domElement.offsetHeight) * POS_FACT + 1;
      } else {
        x = ((xPos - this.rendererMod.domElement.offsetLeft) / this.rendererMod.domElement.offsetWidth) * POS_FACT - 1;
        y = -((yPos - this.rendererMod.domElement.offsetTop) / this.rendererMod.domElement.offsetHeight) * POS_FACT + 1;
      }
      const direction: THREE.Vector2 = new THREE.Vector2(x, y);
      const rayCast: THREE.Raycaster = new THREE.Raycaster();
      rayCast.setFromCamera(direction, this.camera);
      const intersectOri: THREE.Intersection[] = rayCast.intersectObjects(this.scene.children);
      const interMod: THREE.Intersection[] = rayCast.intersectObjects(this.modifiedScene.children);

      if (intersectOri.length > interMod.length) { // Deletion
        this.modifiedScene.add(intersectOri[0].object.clone());
      } else if (intersectOri.length < interMod.length) { // Deletion
        let index: number = 0;
        for ( const i of this.modifiedScene.children) {
          if ( i.position === interMod[0].object.position) {
            this.modifiedScene.children.splice(index, 1);
          }
          index++;
        }
      } else if (intersectOri.length === interMod.length ) {
          if (!((intersectOri[0].object as THREE.Mesh).material as THREE.MeshPhongMaterial)
              .color.equals(((interMod[0].object as THREE.Mesh).material as THREE.MeshPhongMaterial).color)) {
            ((interMod[0].object as THREE.Mesh).material as THREE.MeshPhongMaterial).color =
              ((intersectOri[0].object as THREE.Mesh).material as THREE.MeshPhongMaterial).color;
          }
      }
  }
}
