import {Injectable} from "@angular/core";
import Axios, {AxiosResponse} from "axios";
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
    this.putThumbnail = this.putThumbnail.bind(this);
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
  private readonly renderSize: number = 500;
  private readonly cameraZ: number = 200;
  private readonly WAIT_TIME: number = 3000;
  private readonly THUMBNAIL_QUALITY: number = 0.5;

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
    await this.putThumbnail(thumbnailData, gameName);
  }

  private async getFreeGameScene(name: string): Promise<Scene> {
    return new Promise<Scene>((resolve, reject) => {
      Axios.get<IFreeGame>(SERVER_BASE_URL + GAME_MANAGER_FREE + encodeURIComponent(name)).then((game) => {
        const scenes: IScene = this.creatorService.createScenes(game.data.scenes);
        resolve (scenes.scene);
      }).catch((error: Error) => { reject(error); });
    });
  }

  private async putThumbnail(data: string, gameName: string): Promise<IFreeGame> {
    return Axios.put<IFreeGame>(SERVER_BASE_URL + GAME_MANAGER_FREE + encodeURIComponent(gameName), {thumbnail: data})
      .then((response: AxiosResponse<IFreeGame>) => {
        return response.data;
      })
      // tslint:disable-next-line:no-any Since Axios defines reason as `any`
      .catch((reason: any) => {
        throw reason;
      });
  }
}
