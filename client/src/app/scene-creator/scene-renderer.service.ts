import { Injectable } from "@angular/core";
import Axios, { AxiosResponse } from "axios";
import * as Httpstatus from "http-status-codes";
import { Observable, Subject } from "rxjs";
import * as THREE from "three";
import {
  createWebsocketMessage,
  ChatMessage,
  ChatMessagePosition, ChatMessageType,
  WebsocketMessage
} from "../../../../common/communication/messages/message";
import {DIFF_VALIDATOR_3D_BASE, SERVER_BASE_URL} from "../../../../common/communication/routes";
import {SocketEvent} from "../../../../common/communication/socket-events";
import { ComponentNotLoadedError } from "../../../../common/errors/component.errors";
import {AbstractServiceError, AlreadyFoundDifferenceError, NoDifferenceAtPointError} from "../../../../common/errors/services.errors";
import { IJson3DObject } from "../../../../common/free-game-json-interface/JSONInterface/IScenesJSON";
import {OnlineType} from "../../../../common/model/game/game";
import {IFreeGameState} from "../../../../common/model/game/game-state";
import { deepCompare, sleep, X_FACTOR } from "../../../../common/util/util";
import {
  playRandomSound,
  FOUND_DIFFERENCE_SOUNDS,
  NO_DIFFERENCE_SOUNDS,
  STAR_THEME_SOUND
} from "../simple-game/game-sounds";
import {SocketService} from "../socket.service";
import {UNListService} from "../username.service";
import { RenderUpdateService } from "./render-update.service";

interface IFreeGameRendererState extends IFreeGameState {
  isCheatModeActive: boolean;
  isWaitingInThread: boolean;
  cheatDiffData?: Set<THREE.Object3D>;
  blinkThread?: NodeJS.Timeout;
}
export const SCENE_TYPE: string = "Scene";
@Injectable({
    providedIn: "root",
  })
export class SceneRendererService {

  public constructor(private renderUpdateService: RenderUpdateService,
                     private socket: SocketService) {
    this.gameState = {isCheatModeActive: false, isWaitingInThread: false, foundDifference: []};
  }
  public get foundDifferenceCount(): Observable<number> {
    return this.differenceCountSubject;
  }
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
  private readonly backGroundColor: number = 0x001A33;
  private readonly cameraX: number = 0;
  private readonly cameraY: number = 0;
  private readonly cameraZ: number = 100;
  private readonly timeFactor: number = 1000;
  private readonly BLINK_INTERVAL_MS: number = 250;
  private readonly INVISIBLE_INTERVAL_MS: number = this.BLINK_INTERVAL_MS / X_FACTOR;
  private readonly WATCH_THREAD_FINISH_INTERVAL: number = 30;
  private differenceCountSubject: Subject<number> = new Subject();
  public gameState: IFreeGameRendererState;

  private static isObjectAtSamePlace(jsonPosition: number[], objectPosition: THREE.Vector3): boolean {
    return deepCompare(jsonPosition, [objectPosition.x, objectPosition.y, objectPosition.z]);
  }
  private setRenderer(): void {
    this.rendererOri = new THREE.WebGLRenderer({preserveDrawingBuffer: true});
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
    (this.gameState.cheatDiffData as Set<THREE.Mesh>).forEach((value: THREE.Mesh) => this.changeVisibility(value));
    this.gameState.isWaitingInThread = true;
    await sleep(this.INVISIBLE_INTERVAL_MS);
    this.gameState.isWaitingInThread = false;
    (this.gameState.cheatDiffData as Set<THREE.Mesh>).forEach((value: THREE.Mesh) => this.changeVisibility(value));
  }
  public async modifyCheatState(loadCheatData: () => Promise<IJson3DObject[]>): Promise<void> {
    this.gameState.isCheatModeActive = !this.gameState.isCheatModeActive;
    if (this.gameState.isCheatModeActive) {
      STAR_THEME_SOUND.play();
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
          if (SceneRendererService.isObjectAtSamePlace(jsonValue.position, objectValue.position)) {
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
        if (SceneRendererService.isObjectAtSamePlace(jsonValue.position, objectValue.position) &&
          (objectValue instanceof THREE.Mesh || objectValue instanceof THREE.Scene)) {
          (this.gameState.cheatDiffData as Set<THREE.Object3D>).add(objectValue);
        }
      });
    });
  }
  public async deactivateCheatMode(): Promise<void> {
    STAR_THEME_SOUND.stop();
    if (this.gameState.blinkThread) {
      clearInterval(this.gameState.blinkThread);
    }
    await this.threadFinish();
    this.gameState.isCheatModeActive = false;
    this.gameState.cheatDiffData = undefined;
  }
  private async threadFinish(): Promise<void> {
    while (this.gameState.isWaitingInThread) {
      await sleep(this.WATCH_THREAD_FINISH_INTERVAL);
    }
  }
  public async objDiffValidation(xPos: number, yPos: number): Promise<IJson3DObject> {
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
      const intersectOri: THREE.Intersection[] = rayCast.intersectObjects(this.scene.children, true);
      const intersectMod: THREE.Intersection[] = rayCast.intersectObjects(this.modifiedScene.children, true);
      if (intersectOri.length === 0 && intersectMod.length === 0) {
        playRandomSound(NO_DIFFERENCE_SOUNDS);

        return this.differenceValidationAtPoint(undefined);
      }
      // Only take the first intersected object by the ray, hence the 0's
      if (intersectOri.length === 0 && intersectMod.length !== 0) {
        return this.differenceValidationAtPoint(this.get3DObject(intersectMod[0]));
      } else {
        return this.differenceValidationAtPoint(this.get3DObject(intersectOri[0]));
      }
  }
  private get3DObject(obj: THREE.Intersection): THREE.Object3D {
    if ((obj.object.parent as THREE.Object3D).type === SCENE_TYPE) {
      return obj.object;
    } else {
      return this.getRecursiveParent(obj.object);
    }
  }
  private getRecursiveParent(obj: THREE.Object3D): THREE.Object3D {
    while ((obj.parent as THREE.Object3D).type !== SCENE_TYPE) {
      return this.getRecursiveParent(obj.parent as THREE.Object3D);
    }

    return (obj.parent as THREE.Object3D);
  }
  private async differenceValidationAtPoint(object: THREE.Object3D|undefined): Promise<IJson3DObject> {
    let centerObj: number[] = [];
    if (object !== undefined) {
      centerObj = [object.position.x, object.position.y, object.position.z];
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
        this.notifyClickToWebsocket(true);
        this.updateRoutine(value.data, object as THREE.Object3D);
        await this.updateCheateDiffData([value.data as IJson3DObject]);

        return value.data as IJson3DObject;
      })
      // tslint:disable-next-line:no-any Generic error response
      .catch((reason: any) => {
        this.notifyClickToWebsocket(false);
        if (reason.response && reason.response.status === Httpstatus.NOT_FOUND) {
          playRandomSound(NO_DIFFERENCE_SOUNDS);
          throw new NoDifferenceAtPointError();
        }
        throw new AbstractServiceError(reason.message);
      });
  }
  private notifyClickToWebsocket(good: boolean): void {
    const message: WebsocketMessage<ChatMessage> = createWebsocketMessage<ChatMessage>({
        gameName: "", playerCount: OnlineType.SOLO,
        playerName: UNListService.username, position: ChatMessagePosition.NA,
        timestamp: new Date(), type: good ? ChatMessageType.DIFF_FOUND : ChatMessageType.DIFF_ERROR,
    });
    this.socket.send(SocketEvent.CHAT, message);
  }
  private checkIfAlreadyFound(object: IJson3DObject): void {
    for (const obj of this.gameState.foundDifference) {
      if (this.renderUpdateService.isSameObject(obj.position, object.position)) {
        playRandomSound(NO_DIFFERENCE_SOUNDS);
        throw new AlreadyFoundDifferenceError();
      }
    }
  }
  private updateRoutine(jsonObj: IJson3DObject, obj: THREE.Object3D): void {
    this.gameState.foundDifference.push(jsonObj);
    this.renderUpdateService.updateDifference(obj, this.scene, this.modifiedScene);
    this.differenceCountSubject.next(this.gameState.foundDifference.length);
    playRandomSound(FOUND_DIFFERENCE_SOUNDS);
  }
  private changeVisibility(value: THREE.Mesh|THREE.Scene): void {
    if (value instanceof  THREE.Mesh) {
      Array.isArray(value.material) ? value.material.forEach((material) => {material.visible = !material.visible; } ) :
        value.material.visible = !value.material.visible;
    } else {
      value.children.forEach((valueChild: THREE.Object3D) => {
        this.changeVisibility(valueChild as THREE.Scene);
      });
    }
  }
}
