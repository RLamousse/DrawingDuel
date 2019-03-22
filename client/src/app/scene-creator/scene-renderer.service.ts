import { Injectable } from "@angular/core";
import * as THREE from "three";
import { ComponentNotLoadedError } from "../../../../common/errors/component.errors";
import {IJson3DObject} from "../../../../common/free-game-json-interface/JSONInterface/IScenesJSON";
import {deepCompare, sleep} from "../../../../common/util/util";
require("three-first-person-controls")(THREE);

interface IFreeGameState {
  isCheatModeActive: boolean;
  isWaitingInThread: boolean;
  foundDiffs: IJson3DObject[]; // TODO replace foundDiffs after anthony merge
  cheatDiffData?: THREE.Object3D[];
  blinkThread?: NodeJS.Timeout;
}

@Injectable()
export class SceneRendererService {

  public originalContainer: HTMLDivElement;
  public modifiedContainer: HTMLDivElement;
  public scene: THREE.Scene;
  public modifiedScene: THREE.Scene;

  private camera: THREE.PerspectiveCamera;
  private rendererOri: THREE.WebGLRenderer;
  private rendererMod: THREE.WebGLRenderer;

  private fpControls: THREE.FirstPersonControls;
  private readonly mvmSpeed: number = 10;
  private readonly lkSpeed: number = 0.05;
  private readonly updateTime: number = 0.17;

  private readonly fieldOfView: number = 90;
  private readonly nearClippingPane: number = 1;
  private readonly farClippingPane: number = 1000;
  private readonly backGroundColor: number = 0x0B7B90;

  private readonly cameraX: number = 0;
  private readonly cameraY: number = 0;
  private readonly cameraZ: number = 100;

  private readonly BLINK_INTERVAL_MS: number = 250;
  private readonly INVISIBLE_INTERVAL_MS: number = this.BLINK_INTERVAL_MS / 2; // TODO utiliser la constante factor two
  // et la mettre dans utile si necessaire
  private readonly WATCH_THREAD_FINISH_INTERVAL: number = 5;
  private gameState: IFreeGameState = {isCheatModeActive: false, isWaitingInThread: false, foundDiffs: []};

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

    this.fpControls = new THREE.FirstPersonControls(this.camera, this.rendererOri.domElement);
    this.fpControls.movementSpeed = this.mvmSpeed;
    this.fpControls.lookSpeed = this.lkSpeed;
  }

  private renderLoop(): void {
    requestAnimationFrame(() => this.renderLoop());
    this.rendererOri.render(this.scene, this.camera);
    this.rendererMod.render(this.modifiedScene, this.camera);
    this.fpControls.update(this.updateTime);
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
    this.renderLoop();
  }

  private async blink(): Promise<void> {
    (this.gameState.cheatDiffData as THREE.Object3D[]).forEach((value) => {value.visible = false; });
    this.gameState.isWaitingInThread = true;
    await sleep(this.INVISIBLE_INTERVAL_MS);
    this.gameState.isWaitingInThread = false;
    (this.gameState.cheatDiffData as THREE.Object3D[]).forEach((value) => {value.visible = true; });
  }

  public async modifyCheatState(loadCheatData: () => Promise<IJson3DObject[]>): Promise<void> {
    this.gameState.isCheatModeActive = !this.gameState.isCheatModeActive;
    if (this.gameState.isCheatModeActive) {
      await this.loadCheatData(loadCheatData);
      await this.updateCheateDiffData(this.gameState.foundDiffs);
      this.gameState.blinkThread = setInterval(async () => this.blink(),
                                               this.BLINK_INTERVAL_MS);
    } else {
      await this.deactivateCheatMode();
    }
  }

  // TODO call this function after a diff is found
  private async updateCheateDiffData(newData: IJson3DObject[]): Promise<void> {
    await this.threadFinish();
    if (this.gameState.isCheatModeActive) {

      newData.forEach((jsonValue: IJson3DObject) => {
        (this.gameState.cheatDiffData as THREE.Object3D[]).forEach((objectValue: THREE.Object3D, index: number) => {
          if (this.isObjectAtSamePlace(jsonValue.position, objectValue.position)) {
            (this.gameState.cheatDiffData as THREE.Object3D[]).splice(index, 1);
          }
        });
      });
    }
  }

  private async loadCheatData(callBackFunction: () => Promise<IJson3DObject[]>): Promise<void> {
    this.gameState.cheatDiffData = [];
    (await callBackFunction()).forEach((jsonValue: IJson3DObject) => {
      this.scene.children.concat(this.modifiedScene.children).forEach((objectValue: THREE.Object3D) => {
        if (this.isObjectAtSamePlace(jsonValue.position, objectValue.position) && objectValue instanceof THREE.Mesh) {
          (this.gameState.cheatDiffData as THREE.Object3D[]).push(objectValue);
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
}
