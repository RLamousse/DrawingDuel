import {Injectable} from "@angular/core";
import Axios from "axios";
import {PerspectiveCamera, Scene, WebGLRenderer} from "three";
import {GAME_MANAGER_FREE, SERVER_BASE_URL} from "../../../../../common/communication/routes";
import {IFreeGame} from "../../../../../common/model/game/free-game";
import {sleep} from "../../../../../common/util/util";
import {IScene} from "../../scene-interface";
import {FreeGameCreatorService} from "../FreeGameCreator/free-game-creator.service";

@Injectable({providedIn: "root"})
export class FreeGamePhotoService {

  private divElem: HTMLDivElement;
  private renderer: WebGLRenderer;
  private readonly camera: PerspectiveCamera;

  public constructor(private creatorService: FreeGameCreatorService) {
    this.takePhoto = this.takePhoto.bind(this);
    FreeGamePhotoService.putThumbnail = FreeGamePhotoService.putThumbnail.bind(this);
    this.divElem = (document.createElement("div")) as HTMLDivElement;
    this.renderer = new WebGLRenderer({preserveDrawingBuffer: true});
    this.camera = new PerspectiveCamera(
      this.fieldOfView,
      1,
      this.nearClippingPane,
      this.farClippingPane,
    );
    this.divElem.appendChild(this.renderer.domElement);
  }
  private readonly fieldOfView: number = 90;
  private readonly nearClippingPane: number = 1;
  private readonly farClippingPane: number = 1000;
  private readonly backGroundColor: number = 0x001A33;
  private readonly renderSize: number = 1000;
  private readonly cameraZ: number = 200;
  private readonly WAIT_TIME: number = 1000;
  private readonly THUMBNAIL_QUALITY: number = 0.5;

  private static putThumbnail(data: string, gameName: string): void {
    Axios.put<IFreeGame>(SERVER_BASE_URL + GAME_MANAGER_FREE + encodeURIComponent(gameName), {thumbnail: data})
      .catch((err: Error) => {
        throw err;
    });
  }

  public async takePhoto(gameName: string): Promise<void> {
    this.camera.position.set(0, 0, this.cameraZ);
    this.renderer.setClearColor(this.backGroundColor);
    this.renderer.setPixelRatio(devicePixelRatio);
    this.renderer.setSize(this.renderSize, this.renderSize);

    const scene: Scene = await this.getFreeGameScene(gameName);
    this.renderer.render(scene, this.camera);
    await sleep(this.WAIT_TIME);
    this.renderer.render(scene, this.camera);

    const thumbnailData: string = (this.divElem.children[0] as HTMLCanvasElement).toDataURL("image/jpeg", this.THUMBNAIL_QUALITY);
    FreeGamePhotoService.putThumbnail(thumbnailData, gameName);
  }

  private async getFreeGameScene(name: string): Promise<Scene> {
    let scenes: IScene = {
      scene: new Scene(),
      modifiedScene: new Scene(),
    };
    const sceneDB: IFreeGame =
      (await Axios.get<IFreeGame>(SERVER_BASE_URL + GAME_MANAGER_FREE + encodeURIComponent(name))).data;
    scenes = this.creatorService.createScenes(sceneDB.scenes);

    return scenes.scene;
  }
}
