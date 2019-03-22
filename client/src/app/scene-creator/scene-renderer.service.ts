import {Injectable} from "@angular/core";
import * as THREE from "three";
import {ComponentNotLoadedError} from "../../../../common/errors/component.errors";
import GLTFLoader from "three-gltf-loader";
import {spaceObjects} from "../../../../common/model/modelThematicTheme";

require("three-first-person-controls")(THREE);

// import * as cucco from '../Models/cucco/scene.gltf';

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
    this.displayObject("assets/Models/space/rocket/scene.gltf");
    this.renderLoop();
  }

  public displayObject(path: string): void {
    const loader: GLTFLoader = new GLTFLoader();
    loader.load(path, (gltf: THREE.GLTF) => {
      const test: number = spaceObjects.rocket;
      gltf.scene.scale.set(test, test, test);
      //gltf.scene.rotateY(10);
      this.scene.add(gltf.scene);
    });
  }
}
