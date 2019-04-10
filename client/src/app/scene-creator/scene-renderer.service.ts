import {Injectable} from "@angular/core";
import Axios, {AxiosResponse} from "axios";
import * as Httpstatus from "http-status-codes";
import {Observable, Subject} from "rxjs";
import {Intersection, Mesh, Object3D, PerspectiveCamera, Raycaster, Scene, Vector2, Vector3, WebGLRenderer} from "three";
import {ChatMessage, ChatMessagePosition, ChatMessageType, WebsocketMessage} from "../../../../common/communication/messages/message";
import {I3DDiffValidatorControllerRequest} from "../../../../common/communication/requests/diff-validator-controller.request";
import {DIFF_VALIDATOR_3D_BASE, SERVER_BASE_URL} from "../../../../common/communication/routes";
import {SocketEvent} from "../../../../common/communication/socket-events";
import {ComponentNotLoadedError} from "../../../../common/errors/component.errors";
import {AbstractServiceError, AlreadyFoundDifferenceError, NoDifferenceAtPointError} from "../../../../common/errors/services.errors";
import {IJson3DObject} from "../../../../common/free-game-json-interface/JSONInterface/IScenesJSON";
import {OnlineType} from "../../../../common/model/game/game";
import {getOrigin3D, IVector3} from "../../../../common/model/point";
import {deepCompare, sleep, X_FACTOR} from "../../../../common/util/util";
import {playRandomSound, FOUND_DIFFERENCE_SOUNDS, NO_DIFFERENCE_SOUNDS, STAR_THEME_SOUND} from "../simple-game/game-sounds";
import {SocketService} from "../socket.service";
import {UNListService} from "../username.service";
import {ObjectCollisionService} from "./objectCollisionService/object-collision.service";
import {RenderUpdateService} from "./render-update.service";
interface IFreeGameState {
import { RenderUpdateService } from "./render-update.service";

interface IFreeGameRendererState extends IFreeGameState {
  isCheatModeActive: boolean;
  isWaitingInThread: boolean;
  cheatDiffData?: Set<Object3D>;
  blinkThread?: NodeJS.Timeout;
}
export const SCENE_TYPE: string = "Scene";
@Injectable({
    providedIn: "root",
  })
export class SceneRendererService {

  public constructor(private renderUpdateService: RenderUpdateService,
                     private socket: SocketService,
                     private objectCollisionService: ObjectCollisionService,
  ) {
    this.gameState = {isCheatModeActive: false, isWaitingInThread: false, foundDifference: []};
  }
  public get foundDifferenceCount(): Observable<number> {
    return this.differenceCountSubject;
  }
  public originalContainer: HTMLDivElement;
  public modifiedContainer: HTMLDivElement;
  public scene: Scene;
  public modifiedScene: Scene;
  public gameName: string;
  private camera: PerspectiveCamera;
  private rendererOri: WebGLRenderer;
  private rendererMod: WebGLRenderer;
  protected time: number;
  protected prevTime: number;
  protected velocity: Vector3;
  private readonly fieldOfView: number = 90;
  private readonly nearClippingPane: number = 1;
  private readonly farClippingPane: number = 2900;
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

  private static compareToThreeVector3(x: IVector3, y: Vector3): boolean {
    return deepCompare(x, {x: y.x, y: y.y, z: y.z} as IVector3);
  }
  private setRenderer(): void {
    this.rendererOri = new WebGLRenderer({preserveDrawingBuffer: true});
    this.rendererOri.setClearColor(this.backGroundColor);
    this.rendererOri.setPixelRatio(devicePixelRatio);
    this.rendererOri.setSize(this.originalContainer.clientWidth, this.originalContainer.clientHeight);
    this.originalContainer.appendChild(this.rendererOri.domElement);
    this.rendererMod = new WebGLRenderer();
    this.rendererMod.setClearColor(this.backGroundColor);
    this.rendererMod.setPixelRatio(devicePixelRatio);
    this.rendererMod.setSize(this.modifiedContainer.clientWidth, this.modifiedContainer.clientHeight);
    this.modifiedContainer.appendChild(this.rendererMod.domElement);
  }
  private renderLoop(): void {
    this.rendererOri.render(this.scene, this.camera);
    this.rendererMod.render(this.modifiedScene, this.camera);
    this.time = performance.now();
    const delta: number = (this.time - this.prevTime) / this.timeFactor;
    this.renderUpdateService.updateVelocity(this.velocity, delta);
    this.velocity = this.objectCollisionService.raycastCollision
      (this.camera, this.scene.children, this.modifiedScene.children, this.velocity);
    this.renderUpdateService.updateCamera(this.camera, delta, this.velocity);
    this.prevTime = this.time;
    requestAnimationFrame(() => this.renderLoop());
  }
  private setCamera(): void {
    const aspectRatio: number = this.getAspectRatio();
    this.camera = new PerspectiveCamera(
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
  public loadScenes(original: Scene, modified: Scene, gameName: string): void {
    if (this.originalContainer === undefined || this.modifiedContainer === undefined) {
      throw (new ComponentNotLoadedError());
    }
    this.scene = original;
    this.modifiedScene = modified;
    this.time = 0;
    this.prevTime = performance.now();
    this.velocity = new Vector3();
    this.gameName = gameName;
    this.gameState.foundDifference = [];
    this.renderLoop();
  }
  private async blink(): Promise<void> {
    (this.gameState.cheatDiffData as Set<Mesh>).forEach((value: Mesh) => this.changeVisibility(value));
    this.gameState.isWaitingInThread = true;
    await sleep(this.INVISIBLE_INTERVAL_MS);
    this.gameState.isWaitingInThread = false;
    (this.gameState.cheatDiffData as Set<Mesh>).forEach((value: Mesh) => this.changeVisibility(value));
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
        (this.gameState.cheatDiffData as Set<Object3D>).forEach((objectValue: Object3D) => {
          if (SceneRendererService.compareToThreeVector3(jsonValue.position, objectValue.position)) {
            (this.gameState.cheatDiffData as Set<Object3D>).delete(objectValue);
          }
        });
      });
    }
  }
  private async loadCheatData(callBackFunction: () => Promise<IJson3DObject[]>): Promise<void> {
    this.gameState.cheatDiffData = new Set<Object3D>();
    (await callBackFunction()).forEach((jsonValue: IJson3DObject) => {
      this.scene.children.concat(this.modifiedScene.children).forEach((objectValue: Object3D) => {
        if (SceneRendererService.compareToThreeVector3(jsonValue.position, objectValue.position) &&
          (objectValue instanceof Mesh || objectValue instanceof Scene)) {
          (this.gameState.cheatDiffData as Set<Object3D>).add(objectValue);
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
      const direction: Vector2 = new Vector2(x, y);
      const rayCast: Raycaster = new Raycaster();
      rayCast.setFromCamera(direction, this.camera);
      const intersectOri: Intersection[] = rayCast.intersectObjects(this.scene.children, true);
      const intersectMod: Intersection[] = rayCast.intersectObjects(this.modifiedScene.children, true);
      if (intersectOri.length === 0 && intersectMod.length === 0) {
        playRandomSound(NO_DIFFERENCE_SOUNDS);

        return this.differenceValidationAtPoint(undefined);
      }
      const object: Intersection = intersectOri.length === 0 && intersectMod.length !== 0 ? intersectMod[0] : intersectOri[0];

      return this.differenceValidationAtPoint(this.get3DObject(object));
  }
  private get3DObject(obj: Intersection): Object3D {
    if ((obj.object.parent as Object3D).type === SCENE_TYPE) {
      return obj.object;
    } else {
      return this.getRecursiveParent(obj.object);
    }
  }
  private getRecursiveParent(obj: Object3D): Object3D {
    if ((obj.parent as Object3D).type !== SCENE_TYPE) {
      return this.getRecursiveParent(obj.parent as Object3D);
    }

    return (obj.parent as Object3D);
  }
  private async differenceValidationAtPoint(object: Object3D | undefined): Promise<IJson3DObject> {
    const {x, y, z} = object !== undefined ? object.position : getOrigin3D();
    const queryParams: I3DDiffValidatorControllerRequest = {
      gameName: this.gameName, centerX: x, centerY: y, centerZ: z,
    };

    return Axios.get<IJson3DObject>(SERVER_BASE_URL + DIFF_VALIDATOR_3D_BASE, {params: queryParams})
      .then(async (value: AxiosResponse<IJson3DObject>) => {
        if (this.gameState.foundDifference.length !== 0 || this.gameState.foundDifference !== undefined) {
          this.checkIfAlreadyFound(value.data);
        }
        this.notifyClickToWebsocket(true);
        this.updateRoutine(value.data, object as Object3D);
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
      if (deepCompare(obj.position, object.position)) {
        playRandomSound(NO_DIFFERENCE_SOUNDS);
        throw new AlreadyFoundDifferenceError();
      }
    }
  }
  private updateRoutine(jsonObj: IJson3DObject, obj: Object3D): void {
    this.gameState.foundDifference.push(jsonObj);
    this.renderUpdateService.updateDifference(obj, this.scene, this.modifiedScene);
    this.differenceCountSubject.next(this.gameState.foundDifference.length);
    playRandomSound(FOUND_DIFFERENCE_SOUNDS);
  }
  private changeVisibility(value: Mesh | Scene): void {
    if (value instanceof Mesh) {
      Array.isArray(value.material) ? value.material.forEach((material) => {material.visible = !material.visible; } ) :
        value.material.visible = !value.material.visible;
    } else {
      value.children.forEach((valueChild: Object3D) => {
        this.changeVisibility(valueChild as Scene);
      });
    }
  }
}
