import {Injectable} from "@angular/core";
import * as THREE from "three";
import {ComponentNotLoadedError} from "../../../../common/errors/component.errors";
require("three-first-person-controls")(THREE);

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
  private readonly backGroundColor: number = 0x001A33;//0x0B7B90;

  private readonly cameraX: number = 0;
  private readonly cameraY: number = 0;
  private readonly cameraZ: number = 350;

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
    // this.generateSkyBox();
  }

  // private generateSkyBox (): void {
  //   let geometry: THREE.BoxGeometry = new THREE.BoxGeometry(400, 400, 400);
  //   var materialArray = [];
  //   const textureLoader: THREE.TextureLoader = new THREE.TextureLoader();
  //   materialArray.push(new THREE.SpriteMaterial( { map: textureLoader.load( "https://stemkoski.github.io/Three.js/images/dawnmountain-xpos.png"), side: THREE.DoubleSide}));
  //   materialArray.push(new THREE.SpriteMaterial( { map: textureLoader.load( "https://stemkoski.github.io/Three.js/images/dawnmountain-xneg.png"), side: THREE.DoubleSide }));
  //   materialArray.push(new THREE.SpriteMaterial( { map: textureLoader.load( "https://stemkoski.github.io/Three.js/images/dawnmountain-ypos.png"), side: THREE.DoubleSide }));
  //   materialArray.push(new THREE.SpriteMaterial( { map: textureLoader.load( "https://stemkoski.github.io/Three.js/images/dawnmountain-yneg.png"), side: THREE.DoubleSide }));
  //   materialArray.push(new THREE.SpriteMaterial( { map: textureLoader.load( "https://stemkoski.github.io/Three.js/images/dawnmountain-zpos.png"), side: THREE.DoubleSide }));
  //   materialArray.push(new THREE.SpriteMaterial( { map: textureLoader.load( "https://stemkoski.github.io/Three.js/images/dawnmountain-zneg.png"), side: THREE.DoubleSide }));
  //
  //   let cubeMaterial: THREE.MeshFaceMaterial = new THREE.MeshFaceMaterial(materialArray);
  //   let cube: THREE.Mesh = new THREE.Mesh(geometry, cubeMaterial);
  //   this.scene.add(cube);
  //   this.modifiedScene.add(cube);
  //
  //   // for (let i: number = 0; i < 6; i++) {
  //   //   materialArray[i].side = THREE.BackSide;
  //   // }
  //   // let skyboxMaterial: THREE.MeshFaceMaterial = new THREE.MeshFaceMaterial( materialArray );
  //   // let skyboxGeom: THREE.BoxGeometry = new THREE.BoxGeometry( 5, 5, 5, 1, 1, 1 );
  //   // let skybox = new THREE.Mesh( skyboxGeom, skyboxMaterial );
  //   // this.scene.add(skybox);
  // }

  public loadScenes(original: THREE.Scene, modified: THREE.Scene): void {
    if (this.originalContainer === undefined || this.modifiedContainer === undefined) {
      throw (new ComponentNotLoadedError());
    }
    this.scene = original;
    this.modifiedScene = modified;
    // this.generateSkyBox();
    this.renderLoop();
  }
}
