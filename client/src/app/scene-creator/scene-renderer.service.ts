import {Injectable} from "@angular/core";
import {Intersection, Mesh, Object3D, PerspectiveCamera, Raycaster, Scene, Vector2, Vector3, WebGLRenderer} from "three";
import {ComponentNotLoadedError} from "../../../../common/errors/component.errors";
import {NoDifferenceAtPointError} from "../../../../common/errors/services.errors";
import {IJson3DObject} from "../../../../common/free-game-json-interface/JSONInterface/IScenesJSON";
import {IFreeGameState} from "../../../../common/model/game/game-state";
import {IPoint} from "../../../../common/model/point";
import {IFreeGameInteractionResponse} from "../../../../common/model/rooms/interaction";
import {sleep, X_FACTOR} from "../../../../common/util/util";
import {playRandomSound, FOUND_DIFFERENCE_SOUNDS, NO_DIFFERENCE_SOUNDS, STAR_THEME_SOUND} from "../simple-game/game-sounds";
import {compareToThreeVector3, getObjectFromScenes} from "../util/client-utils";
import {SKY_BOX_NAME} from "./FreeGameCreator/free-game-creator.service";
import {ObjectCollisionService} from "./objectCollisionService/object-collision.service";
import {RenderUpdateService} from "./render-update.service";
import {changeVisibility, get3DObject} from "./renderer-utils";
import {SceneDiffValidatorService} from "./scene-diff-validator.service";
import {UNListService} from "../username.service";

interface IFreeGameRendererState extends IFreeGameState {
  isCheatModeActive: boolean;
  isWaitingInThread: boolean;
  cheatDiffData?: Set<Object3D>;
  blinkThread?: NodeJS.Timeout;
}

@Injectable({providedIn: "root"})
export class SceneRendererService {
  public constructor(private renderUpdateService: RenderUpdateService,
                     private sceneDiffValidator: SceneDiffValidatorService,
                     private objectCollisionService: ObjectCollisionService) {
    this.gameState = {isCheatModeActive: false, isWaitingInThread: false, foundObjects: []};
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

  private time: number;
  private prevTime: number;
  private velocity: Vector3;
  private originalContainer: HTMLDivElement;
  private modifiedContainer: HTMLDivElement;
  private scene: Scene;
  private modifiedScene: Scene;
  private camera: PerspectiveCamera;
  private rendererOri: WebGLRenderer;
  private rendererMod: WebGLRenderer;
  private gameState: IFreeGameRendererState;
  private validationPromise: Promise<number>;

  // ╔═════════╗
  // ║ 3D INIT ║
  // ╚═════════╝

  public init(oriCont: HTMLDivElement, modCont: HTMLDivElement): void {
    this.originalContainer = oriCont;
    this.modifiedContainer = modCont;
    this.initCamera();
    this.initRenderer();
    this.validationPromise = this.getValidationPromise();
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
    const renderer: WebGLRenderer = new WebGLRenderer({preserveDrawingBuffer: true});
    renderer.setClearColor(this.backGroundColor);
    renderer.setPixelRatio(devicePixelRatio);
    renderer.setSize(container.clientWidth, container.clientHeight);

    return renderer;
  }

  public loadScenes(original: Scene, modified: Scene): void {
    if (this.originalContainer === undefined || this.modifiedContainer === undefined) {
      throw (new ComponentNotLoadedError());
    }
    this.scene = original;
    this.modifiedScene = modified;
    this.time = 0;
    this.prevTime = performance.now();
    this.velocity = new Vector3();
    this.gameState.foundObjects = [];
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
      await this.updateCheatDiffData(...this.gameState.foundObjects);
      this.gameState.blinkThread = setInterval(async () => this.blink(),
                                               this.BLINK_INTERVAL_MS);
    } else {
      await this.deactivateCheatMode();
    }
  }

  private async updateCheatDiffData(...newData: IJson3DObject[]): Promise<void> {
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
    const rendererElem: HTMLCanvasElement = position.x < this.rendererMod.domElement.offsetLeft
      ? this.rendererOri.domElement
      : this.rendererMod.domElement;

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

    this.validationPromise = this.getValidationPromise();

    if (intersectOri.length === 0 && intersectMod.length === 0) {
      playRandomSound(NO_DIFFERENCE_SOUNDS);
      this.sceneDiffValidator.notifyIdentificationError(new NoDifferenceAtPointError());

      return this.validationPromise;
    }
    const object: Object3D = get3DObject(intersectOri.length === 0 && intersectMod.length !== 0 ? intersectMod[0] : intersectOri[0]);
    this.sceneDiffValidator.validateDiffObject(object.position);

    return this.validationPromise;
  }

  private async getValidationPromise(): Promise<number> {
    return new Promise<number>((resolve, reject) => {
      this.sceneDiffValidator.registerDifferenceSuccessCallback(
        async (interactionResponse: IFreeGameInteractionResponse) => {
          resolve(await this.handleValidDifference(interactionResponse));
        },
      );
      this.sceneDiffValidator.registerDifferenceErrorCallback((error: Error) => {
        playRandomSound(NO_DIFFERENCE_SOUNDS);
        reject(error);
      });
    });
  }

  private async handleValidDifference(interactionResponse: IFreeGameInteractionResponse): Promise<number> {
    const diffObject: IJson3DObject = interactionResponse.object;
    this.gameState.foundObjects.push(diffObject);

    const sceneObjectToUpdate: Object3D = getObjectFromScenes(diffObject, this.scene, this.modifiedScene);
    this.renderUpdateService.updateDifference(sceneObjectToUpdate, this.scene, this.modifiedScene);

    await this.updateCheatDiffData(diffObject);
    if (interactionResponse.initiatedBy === UNListService.username) {
      playRandomSound(FOUND_DIFFERENCE_SOUNDS);
    }

    return this.gameState.foundObjects.length;
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
      this.camera, this.scene.children, this.modifiedScene.children, this.velocity,
    );
    this.renderUpdateService.updateCamera(this.camera, delta, this.velocity);
    this.prevTime = this.time;
    requestAnimationFrame(() => this.renderLoop());
  }
}
