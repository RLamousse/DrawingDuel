import { Injectable } from "@angular/core";
import * as THREE from "three";
import { ComponentNotLoadedError } from "../../../../common/errors/component.errors";
import {customIndexOf, deepCompare, sleep} from "../../../../common/util/util";
import {IJson3DObject} from "../../../../common/free-game-json-interface/JSONInterface/IScenesJSON";
require("three-first-person-controls")(THREE);

interface IFreeGameState {
  isCheatModeActive: boolean;
  foundDiffs: IJson3DObject[];// TODO replace foundDiffs after anthony merge
  cheatDiffData?: IJson3DObject[];
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
  private readonly INVISBLE_INTERVAL_MS = this.BLINK_INTERVAL_MS/2;
  private gameState: IFreeGameState = {isCheatModeActive: false, foundDiffs: []};

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

  public async blink(objects: IJson3DObject[]): Promise<void>{
    console.log(this);//make invisible
    await sleep(this.INVISBLE_INTERVAL_MS);
    console.log("woow :o");//make visible
  }

  public async modifyCheatState(loadCheatData: () => Promise<IJson3DObject[]>): Promise<void> {
    this.gameState.isCheatModeActive = !this.gameState.isCheatModeActive;
    if (this.gameState.isCheatModeActive) {
      this.gameState.cheatDiffData = await loadCheatData();
      this.updateCheateDiffData();
      this.gameState.blinkThread = setInterval(() => {
        this.blink(<IJson3DObject[]>this.gameState.cheatDiffData);
      }, this.BLINK_INTERVAL_MS);
    } else {
      this.deactivateCheatMode();
    }
  }

  //TODO call this function after a diff is found
  private updateCheateDiffData(): void {
    if (this.gameState.isCheatModeActive) {

      this.gameState.foundDiffs.forEach((value: IJson3DObject, index: number, array: IJson3DObject[]) => {
        const indexPosition = customIndexOf<IJson3DObject>(<IJson3DObject[]>this.gameState.cheatDiffData, value, deepCompare);
        if (indexPosition >= 0) {
          (<IJson3DObject[]>this.gameState.cheatDiffData).splice(indexPosition, 1);
        }
      })
    }
  }

  public deactivateCheatMode(): void {
    if(this.gameState.blinkThread) {
      clearInterval(this.gameState.blinkThread);
    }
    this.gameState.cheatDiffData = undefined;
    this.gameState.isCheatModeActive = false;
  }

}
