import { Injectable } from "@angular/core";
import Axios, { AxiosResponse } from "axios";
import * as Httpstatus from "http-status-codes";
import {Observable, Subject} from "rxjs";
import * as THREE from "three";
import { DIFF_VALIDATOR_3D_BASE, SERVER_BASE_URL } from "../../../../common/communication/routes";
import { ComponentNotLoadedError } from "../../../../common/errors/component.errors";
import { AlreadyFoundDifferenceError, NoDifferenceAtPointError } from "../../../../common/errors/services.errors";
import { Coordinate } from "../../../../common/free-game-json-interface/FreeGameCreatorInterface/free-game-enum";
import { IJson3DObject } from "../../../../common/free-game-json-interface/JSONInterface/IScenesJSON";
import { playRandomSound, FOUND_DIFFERENCE_SOUNDS, NO_DIFFERENCE_SOUNDS } from "../simple-game/game-sounds";

@Injectable({
    providedIn: "root",
  })
export class SceneRendererService {

  public originalContainer: HTMLDivElement;
  public modifiedContainer: HTMLDivElement;
  public scene: THREE.Scene;
  public modifiedScene: THREE.Scene;
  // Test load with gameName now todo
  public gameName: string;
  protected foundDifference: IJson3DObject[];

  private camera: THREE.PerspectiveCamera;
  private rendererOri: THREE.WebGLRenderer;
  private rendererMod: THREE.WebGLRenderer;

  protected time: number;
  protected prevTime: number;
  protected velocity: THREE.Vector3;

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

  private _differenceCountSubject: Subject<number> = new Subject();

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

  public loadScenes(original: THREE.Scene, modified: THREE.Scene, gameName: string): void {
    if (this.originalContainer === undefined || this.modifiedContainer === undefined) {
      throw (new ComponentNotLoadedError());
    }
    this.scene = original;
    this.modifiedScene = modified;
    this.time = 0;
    this.prevTime = performance.now();
    this.velocity = new THREE.Vector3();
    this.gameName = gameName;
    this.foundDifference = [];
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

  public objDiffValidation(xPos: number, yPos: number): Promise<IJson3DObject> {
    console.log(xPos);
    console.log(yPos);
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
      const intersectMod: THREE.Intersection[] = rayCast.intersectObjects(this.modifiedScene.children);
      if (intersectOri.length === 0 && intersectMod.length === 0) {
        playRandomSound(NO_DIFFERENCE_SOUNDS);
        throw new NoDifferenceAtPointError();
      }
      // Only take the first intersected object by the ray, hence the 0's
      if (intersectOri.length === 0 && intersectMod.length !== 0) {// add
        return this.differenceValidationAtPoint(intersectMod[0]);
      } else if (intersectOri.length !== 0 && intersectMod.length === 0) {// remove
        return this.differenceValidationAtPoint(intersectOri[0]);
      } else {
        return this.differenceValidationAtPoint(intersectOri[0]);
      }
  }
  private differenceValidationAtPoint(object: THREE.Intersection): Promise<IJson3DObject> {
    const centerObj: number[] = [object.object.position.x, object.object.position.y, object.object.position.z];

    return Axios.get<IJson3DObject>(
      SERVER_BASE_URL + DIFF_VALIDATOR_3D_BASE,
      {
        params: {
          center: JSON.stringify(centerObj),
          gameName: this.gameName,
        },
      })
      .then((value: AxiosResponse<IJson3DObject>) => {
        if (this.foundDifference.length !== 0 || this.foundDifference !== undefined) {
          this.checkIfAlreadyFound(value.data);
        }
        this.foundDifference.push(value.data);
        this.updateDifference(object);
        this._differenceCountSubject.next(this.foundDifference.length);
        playRandomSound(FOUND_DIFFERENCE_SOUNDS);

        return value.data as IJson3DObject;
      })
      // tslint:disable-next-line:no-any Generic error response
      .catch((reason: any) => {
        if (reason.response && reason.response.status === Httpstatus.NOT_FOUND) {
          playRandomSound(NO_DIFFERENCE_SOUNDS);
          throw new NoDifferenceAtPointError();
        }
        throw new Error(reason.message);
      });
  }
  private checkIfAlreadyFound(object: IJson3DObject): void {
    for (const obj of this.foundDifference) {
      if (this.isSameObject(obj.position, object.position)) {
        playRandomSound(NO_DIFFERENCE_SOUNDS);
        throw new AlreadyFoundDifferenceError();
      }
    }
  }
  private isSameObject(obj1: number[], obj2: number[]): boolean {
    return (obj1[Coordinate.X] === obj2[Coordinate.X] &&
      obj1[Coordinate.Y] === obj2[Coordinate.Y] &&
      obj1[Coordinate.Z] === obj2[Coordinate.Z]);
}
  private isSameCenter (center1: THREE.Vector3, center2: THREE.Vector3): boolean {
    return (center1.x === center2.x &&
      center1.y === center2.y &&
      center1.z === center2.z);
  }
  private updateDifference(object: THREE.Intersection): void {
    let originalObj: THREE.Object3D = new THREE.Object3D();
    let modifObj: THREE.Object3D = new THREE.Object3D();
    for (const obj of this.modifiedScene.children) {
      if (this.isSameCenter(obj.position, object.object.position)) {
        modifObj = obj;
        modifObj.name = "modified";
        break;
      }
    }
    for (const obj of this.scene.children) {
      if (this.isSameCenter(obj.position, object.object.position)) {
        originalObj = obj.clone();
        originalObj.name = "original";
        break;
      }
    }
    if (originalObj.name !== "" && modifObj.name !== "") {
      ((modifObj as THREE.Mesh).material as THREE.MeshPhongMaterial).color =
        ((originalObj as THREE.Mesh).material as THREE.MeshPhongMaterial).color;
    } else if (originalObj.name === "") {
      this.modifiedScene.remove(modifObj);
    } else {
      this.modifiedScene.add(originalObj);
    }
  }
  public get foundDifferenceCount(): Observable<number> {
    return this._differenceCountSubject;
  }
}
