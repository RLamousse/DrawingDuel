import {Injectable} from "@angular/core";
import * as THREE from "three";
import GLTFLoader from "three-gltf-loader";
import {
  ObjectGeometry, ObjectTexture,
  Themes
} from "../../../../../common/free-game-json-interface/FreeGameCreatorInterface/free-game-enum";
import * as IObject from "../../../../../common/free-game-json-interface/JSONInterface/IScenesJSON";
import {IScene} from "../../scene-interface";
import {Form3DService} from "../3DFormService/3-dform.service";

@Injectable()
export class FreeGameCreatorService {

  private scene: THREE.Scene;
  private modifiedScene: THREE.Scene;
  private formService: Form3DService;

  public constructor() {
    this.formService = new Form3DService();
  }

  public createScenes(primitiveScenes: IObject.IScenesJSON): IScene {
    this.scene = new THREE.Scene();
    this.modifiedScene = new THREE.Scene();
    this.setLighting();
    if (primitiveScenes.originalObjects[0].gameType === Themes.Geometry) {
      this.generateOriginalScene(primitiveScenes);
      this.generateModifiedScene(primitiveScenes);
    } else if (primitiveScenes.originalObjects[0].gameType === Themes.Space) {
      this.generateThematicScenes(primitiveScenes);
    }

    return {scene: this.scene, modifiedScene: this.modifiedScene};
  }

  private setLighting(): void {
    const WHITELIGHT: number = 0xFFFFFF;
    const HOTLIGHT: number = 0xF0F0F0;
    const originalLighting: THREE.DirectionalLight = new THREE.DirectionalLight(WHITELIGHT, 1);
    const modifiedLighting: THREE.DirectionalLight = new THREE.DirectionalLight(WHITELIGHT, 1);
    originalLighting.position.set(0, 1, 1);
    modifiedLighting.position.set(0, 1, 1);
    this.scene.add(originalLighting);
    this.modifiedScene.add(modifiedLighting);

    const originalAmbiantLight: THREE.AmbientLight = new THREE.AmbientLight(HOTLIGHT);
    const modifiedAmbiantLight: THREE.AmbientLight = new THREE.AmbientLight(HOTLIGHT);
    this.scene.add(originalAmbiantLight);
    this.modifiedScene.add(modifiedAmbiantLight);
  }

  private generateThematicScenes(primitiveScenes: IObject.IScenesJSON): void {
    for (const i of primitiveScenes.originalObjects) {
      this.generateThematicObject(i, true);
    }
    for (const j of primitiveScenes.modifiedObjects) {
      this.generateThematicObject(j, false);
    }
  }

  private generateThematicObject(object: IObject.IJson3DObject, isOriginalObject: boolean): void {
    const loader: GLTFLoader = new GLTFLoader();
    loader.load(this.buildObjectPath(ObjectGeometry[object.type]), (gltf: THREE.GLTF) => {
      if (object.texture) {
        this.traverseChildren(gltf.scene.children[0], object.texture);
      }
      this.formService.setUpThematicParameters(object, gltf);
      (isOriginalObject) ? this.scene.add(gltf.scene) : this.modifiedScene.add(gltf.scene);
    });
  }

  private traverseChildren(object: THREE.Object3D, type: ObjectTexture): void {
    for (const obj of object.children) {
      if (obj.type === "Mesh") {
        this.setTexture(obj, type);
      } else if (obj !== undefined) {
        this.traverseChildren(obj, type);
      }
    }
  }

  private setTexture(object: THREE.Object3D, type: ObjectTexture): void {
    const textureLoader: THREE.TextureLoader = new THREE.TextureLoader();
    const texture: THREE.Texture = textureLoader.load(this.buildTexturePath(ObjectTexture[type]));

    texture.encoding = THREE.sRGBEncoding;
    texture.flipY = false;

    (object as THREE.Mesh).material = new THREE.MeshPhongMaterial({
      map: texture,
    });
  }

  private buildTexturePath(name: string): string {
    return ("assets/Models/textures/" + name + ".jpg");
  }

  private buildObjectPath(name: string): string {
    return ("assets/Models/space/" + name + "/scene.gltf");
  }

  private generateOriginalScene(primitiveScenes: IObject.IScenesJSON): void {
    let object: THREE.Mesh;
    for (const i of primitiveScenes.originalObjects) {
      object = this.generate3DObject(i);
      this.scene.add(object);
    }
  }

  private generateModifiedScene(primitiveScenes: IObject.IScenesJSON): void {
    let object: THREE.Mesh;
    for (const i of primitiveScenes.modifiedObjects) {
      object = this.generate3DObject(i);
      this.modifiedScene.add(object);
    }
  }

  private generate3DObject(obj: IObject.IJson3DObject): THREE.Mesh {
    let createdObject: THREE.Mesh;
    switch (obj.type) {
      case ObjectGeometry.sphere: {
        createdObject = this.formService.createSphere(obj as IObject.ISphere);
        break;
      }
      case ObjectGeometry.cube: {
        createdObject = this.formService.createCube(obj as IObject.ICube);
        break;
      }
      case ObjectGeometry.cone: {
        createdObject = this.formService.createCone(obj as IObject.ICone);
        break;
      }
      case ObjectGeometry.cylinder: {
        createdObject = this.formService.createCylinder(obj as IObject.ICylinder);
        break;
      }
      case ObjectGeometry.pyramid: {
        createdObject = this.formService.createPyramid(obj as IObject.IPyramid);
        break;
      }
      default: {
        createdObject = new THREE.Mesh();
      }
    }

    return createdObject;
  }

  // private generateThematicObject(object: thematicObject): void {
  //   const loader: GLTFLoader = new GLTFLoader();
  //   loader.load(object.name, (gltf: THREE.GLTF) => {
  //     gltf.scene.scale.set(object.scale, object.scale, object.scale);
  //     // gltf.scene.rotateY(10);
  //     this.scene.add(gltf.scene);
  //   });
  // }
}
