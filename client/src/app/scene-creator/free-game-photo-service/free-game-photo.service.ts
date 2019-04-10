import {Injectable} from "@angular/core";
import {PerspectiveCamera, Scene, WebGLRenderer} from "three";
import {sleep} from "../../../../../common/util/util";

@Injectable({
  providedIn: "root",
})
export class FreeGamePhotoService {
  private readonly fieldOfView: number = 90;
  private readonly nearClippingPane: number = 1;
  private readonly farClippingPane: number = 1000;
  private readonly backGroundColor: number = 0x0B7B90;
  private readonly renderSize: number = 100;
  private readonly cameraZ: number = 200;
  private readonly WAIT_TIME: number = 1500;

  public async takePhoto(scene: Scene): Promise<string> {
    const divElem: HTMLDivElement = (document.createElement("div")) as HTMLDivElement;
    const camera: PerspectiveCamera = new PerspectiveCamera(
      this.fieldOfView,
      1,
      this.nearClippingPane,
      this.farClippingPane,
    );
    camera.position.set(0, 0, this.cameraZ);

    const renderer: WebGLRenderer = new WebGLRenderer({preserveDrawingBuffer: true});
    renderer.setClearColor(this.backGroundColor);
    renderer.setPixelRatio(devicePixelRatio);
    renderer.setSize(this.renderSize, this.renderSize);
    divElem.appendChild(renderer.domElement);
    renderer.render(scene, camera);
    await sleep(this.WAIT_TIME);
    renderer.render(scene, camera);

    return (divElem.children[0] as HTMLCanvasElement).toDataURL();
  }
}
