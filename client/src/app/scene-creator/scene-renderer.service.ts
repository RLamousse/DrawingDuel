import { Injectable } from "@angular/core";
import Axios, { AxiosResponse } from "axios";
import * as Httpstatus from "http-status-codes";
import {Observable, Subject} from "rxjs";
import * as THREE from "three";
import { DIFF_VALIDATOR_3D_BASE, SERVER_BASE_URL } from "../../../../common/communication/routes";
import { ComponentNotLoadedError } from "../../../../common/errors/component.errors";
import {IJson3DObject} from "../../../../common/free-game-json-interface/JSONInterface/IScenesJSON";
import {deepCompare, sleep, X_FACTOR} from "../../../../common/util/util";
require("three-first-person-controls")(THREE);
import { AlreadyFoundDifferenceError, NoDifferenceAtPointError } from "../../../../common/errors/services.errors";
import { Coordinate } from "../../../../common/free-game-json-interface/FreeGameCreatorInterface/free-game-enum";
import { playRandomSound, FOUND_DIFFERENCE_SOUNDS, NO_DIFFERENCE_SOUNDS } from "../simple-game/game-sounds";
import { RenderUpdateService } from "./render-update.service";

interface IFreeGameState {
  isCheatModeActive: boolean;
  isWaitingInThread: boolean;
  foundDifference: IJson3DObject[];
  cheatDiffData?: Set<THREE.Object3D>;
  blinkThread?: NodeJS.Timeout;
}

@Injectable()
@Injectable({
    providedIn: "root",
  })
export class SceneRendererService {

  public originalContainer: HTMLDivElement;
  public modifiedContainer: HTMLDivElement;
  public scene: THREE.Scene;
  public modifiedScene: THREE.Scene;
  public gameName: string;

  private camera: THREE.PerspectiveCamera;
  private rendererOri: THREE.WebGLRenderer;
  private rendererMod: THREE.WebGLRenderer;

  protected time: number;
  protected prevTime: number;
  protected velocity: THREE.Vector3;

  private readonly fieldOfView: number = 90;
  private readonly nearClippingPane: number = 1;
  private readonly farClippingPane: number = 1000;
  private readonly backGroundColor: number = 0x0B7B90;

  private readonly cameraX: number = 0;
  private readonly cameraY: number = 0;
  private readonly cameraZ: number = 100;
  private readonly timeFactor: number = 1000;

  private readonly BLINK_INTERVAL_MS: number = 250;
  private readonly INVISIBLE_INTERVAL_MS: number = this.BLINK_INTERVAL_MS / X_FACTOR;
  // et la mettre dans utile si necessaire
  private readonly WATCH_THREAD_FINISH_INTERVAL: number = 30;
  private gameState: IFreeGameState = {isCheatModeActive: false, isWaitingInThread: false, foundDifference: []};

  private differenceCountSubject: Subject<number> = new Subject();

  public constructor(private renderUpdateService: RenderUpdateService) {}

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
    this.renderUpdateService.updateVelocity(this.velocity, delta);
    this.renderUpdateService.updateCamera(this.camera, delta, this.velocity);
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
    this.gameState.foundDifference = [];
    this.renderLoop();
  }
  private async blink(): Promise<void> {
    (this.gameState.cheatDiffData as Set<THREE.Object3D>).forEach((value) => {value.visible = false; });
    this.gameState.isWaitingInThread = true;
    await sleep(this.INVISIBLE_INTERVAL_MS);
    this.gameState.isWaitingInThread = false;
    (this.gameState.cheatDiffData as Set<THREE.Object3D>).forEach((value) => {value.visible = true; });
  }
  public async modifyCheatState(loadCheatData: () => Promise<IJson3DObject[]>): Promise<void> {
    this.gameState.isCheatModeActive = !this.gameState.isCheatModeActive;
    if (this.gameState.isCheatModeActive) {
      await this.loadCheatData(loadCheatData);
      await this.updateCheateDiffData(this.gameState.foundDifference);
      this.gameState.blinkThread = setInterval(async () => this.blink(),
                                               this.BLINK_INTERVAL_MS);
    } else {
      await this.deactivateCheatMode();
    }
  }
  private async updateCheateDiffData(newData: IJson3DObject[]): Promise<void> {
    await this.threadFinish();
    if (this.gameState.isCheatModeActive) {

      newData.forEach((jsonValue: IJson3DObject) => {
        (this.gameState.cheatDiffData as Set<THREE.Object3D>).forEach((objectValue: THREE.Object3D) => {
          if (this.isObjectAtSamePlace(jsonValue.position, objectValue.position)) {
            (this.gameState.cheatDiffData as Set<THREE.Object3D>).delete(objectValue);
          }
        });
      });
    }
  }

  private async loadCheatData(callBackFunction: () => Promise<IJson3DObject[]>): Promise<void> {
    this.gameState.cheatDiffData = new Set<THREE.Object3D>();
    (await callBackFunction()).forEach((jsonValue: IJson3DObject) => {
      this.scene.children.concat(this.modifiedScene.children).forEach((objectValue: THREE.Object3D) => {
        if (this.isObjectAtSamePlace(jsonValue.position, objectValue.position) && objectValue instanceof THREE.Mesh) {
          (this.gameState.cheatDiffData as Set<THREE.Object3D>).add(objectValue);
        }
      });
    });
  }

  public async deactivateCheatMode(): Promise<void> {
    if (this.gameState.blinkThread) {
      clearInterval(this.gameState.blinkThread);
    }
    await this.threadFinish();
    this.gameState.isCheatModeActive = false;
    this.gameState.cheatDiffData = undefined;
  }

  private isObjectAtSamePlace(jsonPosition: number[], objectPosition: THREE.Vector3): boolean {
    return deepCompare(jsonPosition, [objectPosition.x, objectPosition.y, objectPosition.z]);
  }

  private async threadFinish(): Promise<void> {
    while (this.gameState.isWaitingInThread) {
      await sleep(this.WATCH_THREAD_FINISH_INTERVAL);
    }
  }

  public objDiffValidation(xPos: number, yPos: number): Promise<IJson3DObject> {
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

        return this.differenceValidationAtPoint(undefined);
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
  private differenceValidationAtPoint(object: THREE.Intersection|undefined): Promise<IJson3DObject> {
    let centerObj: number[] = [];
    if (object !== undefined) {
      centerObj = [object.object.position.x, object.object.position.y, object.object.position.z];
    }

    return Axios.get<IJson3DObject>(
      SERVER_BASE_URL + DIFF_VALIDATOR_3D_BASE,
      {
        params: {center: JSON.stringify(centerObj), gameName: this.gameName},
      })
      .then(async (value: AxiosResponse<IJson3DObject>) => {
        if (this.gameState.foundDifference.length !== 0 || this.gameState.foundDifference !== undefined) {
          this.checkIfAlreadyFound(value.data);
        }
        this.updateRoutine(value.data, object as THREE.Intersection);
        await this.updateCheateDiffData([value.data as IJson3DObject]);

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
    for (const obj of this.gameState.foundDifference) {
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
      }
    }
    for (const obj of this.scene.children) {
      if (this.isSameCenter(obj.position, object.object.position)) {
        originalObj = obj.clone();
        originalObj.name = "original";
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
    return this.differenceCountSubject;
  }
  private updateRoutine(jsonObj: IJson3DObject, obj: THREE.Intersection): void {
    this.gameState.foundDifference.push(jsonObj);
    this.updateDifference(obj);
    this.differenceCountSubject.next(this.gameState.foundDifference.length);
    playRandomSound(FOUND_DIFFERENCE_SOUNDS);
  }
}
