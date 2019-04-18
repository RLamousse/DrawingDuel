import {Injectable} from "@angular/core";
import Axios, {AxiosResponse} from "axios";
import * as Httpstatus from "http-status-codes";
import {Observable, Subject} from "rxjs";
import {Intersection, Mesh, Object3D, PerspectiveCamera, Raycaster, Scene, Vector2, Vector3, WebGLRenderer} from "three";
import {ChatMessage, ChatMessagePosition, ChatMessageType, WebsocketMessage} from "../../../../common/communication/messages/message";
import {I3DDiffValidatorControllerRequest} from "../../../../common/communication/requests/diff-validator-controller.request";
import {DIFF_VALIDATOR_3D_BASE, SERVER_BASE_URL} from "../../../../common/communication/routes";
import {SocketEvent} from "../../../../common/communication/socket-events";
import {ComponentNotLoadedError, FreeViewGamesRenderingError} from "../../../../common/errors/component.errors";
import {AbstractServiceError, AlreadyFoundDifferenceError, NoDifferenceAtPointError} from "../../../../common/errors/services.errors";
import {IJson3DObject} from "../../../../common/free-game-json-interface/JSONInterface/IScenesJSON";
import {OnlineType} from "../../../../common/model/game/game";
import {IPoint} from "../../../../common/model/point";
import {deepCompare, sleep, X_FACTOR} from "../../../../common/util/util";
import {playRandomSound, FOUND_DIFFERENCE_SOUNDS, NO_DIFFERENCE_SOUNDS, STAR_THEME_SOUND} from "../simple-game/game-sounds";
import {SocketService} from "../socket.service";
import {UNListService} from "../username.service";
import {compareToThreeVector3} from "../util/client-utils";
import {SKY_BOX_NAME} from "./FreeGameCreator/free-game-creator.service";
import {ObjectCollisionService} from "./objectCollisionService/object-collision.service";
import {RenderUpdateService} from "./render-update.service";
import {changeVisibility, get3DObject} from "./renderer-utils";

interface IFreeGameState {
  isCheatModeActive: boolean;
  isWaitingInThread: boolean;
  foundDifference: IJson3DObject[];
  cheatDiffData?: Set<Object3D>;
  blinkThread?: NodeJS.Timeout;
}

@Injectable({providedIn: "root"})
export class SceneRendererService {
  public constructor(private renderUpdateService: RenderUpdateService,
                     private socket: SocketService,
                     private objectCollisionService: ObjectCollisionService) {
    this.gameState = {isCheatModeActive: false, isWaitingInThread: false, foundDifference: []};
  }

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
  private readonly FPS: number = 30;

  private time: number;
  private prevTime: number;
  private velocity: Vector3;
  private originalContainer: HTMLDivElement;
  private modifiedContainer: HTMLDivElement;
  private scene: Scene;
  private modifiedScene: Scene;
  private gameName: string;
  private gameState: IFreeGameState;
  private camera: PerspectiveCamera;
  private rendererOri: WebGLRenderer;
  private rendererMod: WebGLRenderer;
  private differenceCountSubject: Subject<number> = new Subject();

  public get foundDifferenceCount(): Observable<number> {
    return this.differenceCountSubject;
  }

  // ╔═════════╗
  // ║ 3D INIT ║
  // ╚═════════╝

  public init(oriCont: HTMLDivElement, modCont: HTMLDivElement): void {
    this.originalContainer = oriCont;
    this.modifiedContainer = modCont;
    this.initCamera();
    this.initRenderer();
  }

  private initCamera(): void {
    this.camera = new PerspectiveCamera(
      this.fieldOfView,
      this.originalContainer.clientWidth / this.originalContainer.clientHeight,
      this.nearClippingPane,
      this.farClippingPane,
    );
    this.camera.position.x = this.cameraX;
    this.camera.position.y = this.cameraY;
    this.camera.position.z = this.cameraZ;
  }

  private initRenderer(): void {
    this.rendererOri = this.createRenderer(this.originalContainer);
    this.originalContainer.appendChild(this.rendererOri.domElement);
    this.rendererMod = this.createRenderer(this.modifiedContainer);
    this.modifiedContainer.appendChild(this.rendererMod.domElement);
  }

  private createRenderer(container: HTMLDivElement): WebGLRenderer {
    const renderer: WebGLRenderer = new WebGLRenderer({
      precision: "lowp",
      premultipliedAlpha: false,
    });
    renderer.setClearColor(this.backGroundColor);
    renderer.setPixelRatio(devicePixelRatio);
    renderer.setSize(container.clientWidth, container.clientHeight);

    return renderer;
  }

  public loadScenes(original: Scene, modified: Scene, gameName: string): void {
    if (this.originalContainer === undefined || this.modifiedContainer === undefined) {
      throw new ComponentNotLoadedError();
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

  // ╔════════════╗
  // ║ CHEAT MODE ║
  // ╚════════════╝

  private async blink(): Promise<void> {
    (this.gameState.cheatDiffData as Set<Mesh>).forEach((value: Mesh) => changeVisibility(value));
    this.gameState.isWaitingInThread = true;
    await sleep(this.INVISIBLE_INTERVAL_MS);
    this.gameState.isWaitingInThread = false;
    (this.gameState.cheatDiffData as Set<Mesh>).forEach((value: Mesh) => changeVisibility(value));
  }

  public async modifyCheatState(loadCheatData: () => Promise<IJson3DObject[]>): Promise<void> {
    this.gameState.isCheatModeActive = !this.gameState.isCheatModeActive;
    if (this.gameState.isCheatModeActive) {
      STAR_THEME_SOUND.play();
      await this.loadCheatData(loadCheatData);
      await this.updateCheatDiffData(this.gameState.foundDifference);
      this.gameState.blinkThread = setInterval(async () => this.blink(),
                                               this.BLINK_INTERVAL_MS);
    } else {
      await this.deactivateCheatMode();
    }
  }

  private async updateCheatDiffData(newData: IJson3DObject[]): Promise<void> {
    await this.threadFinish();
    if (this.gameState.isCheatModeActive) {

      newData.forEach((jsonValue: IJson3DObject) => {
        (this.gameState.cheatDiffData as Set<Object3D>).forEach((objectValue: Object3D) => {
          if (compareToThreeVector3(jsonValue.position, objectValue.position)) {
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
        if (compareToThreeVector3(jsonValue.position, objectValue.position) &&
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

  // ╔══════════════════╗
  // ║ CLICK VALIDATION ║
  // ╚══════════════════╝

  public async objDiffValidation(position: IPoint): Promise<number> {
    const rendererElem: HTMLCanvasElement = position.x < this.rendererMod.domElement.offsetLeft ?
      this.rendererOri.domElement :
      this.rendererMod.domElement;

    const POS_FACT: number = 2;
    const x: number = ((position.x - rendererElem.offsetLeft) / rendererElem.offsetWidth) * POS_FACT - 1;
    const y: number = -((position.y - rendererElem.offsetTop) / rendererElem.offsetHeight) * POS_FACT + 1;
    const direction: Vector2 = new Vector2(x, y);
    const rayCast: Raycaster = new Raycaster();
    rayCast.setFromCamera(direction, this.camera);
    const intersectOri: Intersection[] = rayCast.intersectObjects(this.scene.children, true)
      .filter((intersection: Intersection) => intersection.object.name !== SKY_BOX_NAME);
    const intersectMod: Intersection[] = rayCast.intersectObjects(this.modifiedScene.children, true)
      .filter((intersection: Intersection) => intersection.object.name !== SKY_BOX_NAME);
    if (intersectOri.length === 0 && intersectMod.length === 0) {
      this.handleNoDifferenceFound();
    }
    const object: Intersection = intersectOri.length === 0 && intersectMod.length !== 0 ? intersectMod[0] : intersectOri[0];

    await this.differenceValidationAtPoint(get3DObject(object));

    return this.gameState.foundDifference.length;
  }

  private async differenceValidationAtPoint(object: Object3D): Promise<void> {
    const {x, y, z} = object.position;
    const queryParams: I3DDiffValidatorControllerRequest = {
      gameName: this.gameName, centerX: x, centerY: y, centerZ: z,
    };

    return Axios.get<IJson3DObject>(SERVER_BASE_URL + DIFF_VALIDATOR_3D_BASE, {params: queryParams})
      .then(async (value: AxiosResponse<IJson3DObject>) => {
        this.assertAlreadyFound(value.data);
        this.notifyClickToWebsocket(true);
        this.updateModifiedObject(value.data, object as Object3D);
        await this.updateCheatDiffData([value.data as IJson3DObject]);
      })
      // tslint:disable-next-line:no-any Generic error response
      .catch((reason: any) => {
        if (reason.response && reason.response.status === Httpstatus.NOT_FOUND) {
          this.handleNoDifferenceFound();
        }
        throw new AbstractServiceError(reason.message);
      });
  }

  private notifyClickToWebsocket(good: boolean): void {
    const message: WebsocketMessage<ChatMessage> = {
      title: SocketEvent.CHAT,
      body: {
        gameName: "", playerCount: OnlineType.SOLO,
        playerName: UNListService.username, position: ChatMessagePosition.NA,
        timestamp: new Date(), type: good ? ChatMessageType.DIFF_FOUND : ChatMessageType.DIFF_ERROR,
      },
    };
    this.socket.send(SocketEvent.CHAT, message);
  }

  private assertAlreadyFound(object: IJson3DObject): void {
    for (const obj of this.gameState.foundDifference) {
      if (deepCompare(obj.position, object.position)) {
        playRandomSound(NO_DIFFERENCE_SOUNDS);
        throw new AlreadyFoundDifferenceError();
      }
    }
  }

  private updateModifiedObject(jsonObj: IJson3DObject, obj: Object3D): void {
    this.gameState.foundDifference.push(jsonObj);
    this.renderUpdateService.updateDifference(obj, this.scene, this.modifiedScene);
    this.differenceCountSubject.next(this.gameState.foundDifference.length);
    playRandomSound(FOUND_DIFFERENCE_SOUNDS);
  }

  private handleNoDifferenceFound(): void {
    playRandomSound(NO_DIFFERENCE_SOUNDS);
    this.notifyClickToWebsocket(false);
    throw new NoDifferenceAtPointError();
  }

  // ╔════════╗
  // ║ RENDER ║
  // ╚════════╝

  private renderLoop(): void {
    this.rendererOri.render(this.scene, this.camera);
    this.rendererMod.render(this.modifiedScene, this.camera);
    this.time = performance.now();
    const delta: number = (this.time - this.prevTime) / this.timeFactor;
    this.renderUpdateService.updateVelocity(this.velocity, delta);
    this.velocity = this.objectCollisionService.raycastCollision(
      this.camera, this.scene.children, this.modifiedScene.children, this.velocity);
    this.renderUpdateService.updateCamera(this.camera, delta, this.velocity);
    this.prevTime = this.time;
    sleep(1 / this.FPS).then(() => this.renderLoop())
      .catch(() => {
        throw new FreeViewGamesRenderingError();
      });
  }
}
