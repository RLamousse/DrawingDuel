import {Injectable} from "@angular/core";
import {
  sRGBEncoding,
  AmbientLight,
  BoxGeometry,
  DirectionalLight,
  DoubleSide,
  GLTF,
  Mesh,
  MeshBasicMaterial,
  MeshPhongMaterial,
  Object3D,
  Scene,
  Texture,
  TextureLoader
} from "three";
import GLTFLoader from "three-gltf-loader";
import {
  ObjectGeometry, ObjectTexture,
  Themes
} from "../../../../../common/free-game-json-interface/FreeGameCreatorInterface/free-game-enum";
import {
  ICone, ICube,
  ICylinder,
  IJson3DObject,
  IPyramid,
  IScenesJSON,
  ISphere
} from "../../../../../common/free-game-json-interface/JSONInterface/IScenesJSON";
import {IScene} from "../../scene-interface";
import {Form3DService} from "../3DFormService/3-dform.service";

export const SKY_BOX_NAME: string = "skyBox";

@Injectable()
export class FreeGameCreatorService {

  private scene: Scene;
  private modifiedScene: Scene;
  private formService: Form3DService;

  private objects: Mesh[];
  private modifiedObjects: Mesh[];

  public constructor() {
    this.formService = new Form3DService();
    this.objects = [];
    this.modifiedObjects = [];
  }

  public createScenes(primitiveScenes: IScenesJSON): IScene {
    this.scene = new Scene();
    this.modifiedScene = new Scene();
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
    const originalLighting: DirectionalLight = new DirectionalLight(WHITELIGHT, 1);
    const modifiedLighting: DirectionalLight = new DirectionalLight(WHITELIGHT, 1);
    originalLighting.position.set(0, 1, 1);
    modifiedLighting.position.set(0, 1, 1);
    this.scene.add(originalLighting);
    this.modifiedScene.add(modifiedLighting);

    const AMBIENT_LIGHT_POS: number = 300;
    const originalAmbiantLight: AmbientLight = new AmbientLight(HOTLIGHT);
    originalAmbiantLight.position.set(AMBIENT_LIGHT_POS, AMBIENT_LIGHT_POS, AMBIENT_LIGHT_POS);
    const modifiedAmbiantLight: AmbientLight = new AmbientLight(HOTLIGHT);
    modifiedAmbiantLight.position.set(AMBIENT_LIGHT_POS, AMBIENT_LIGHT_POS, AMBIENT_LIGHT_POS);
    this.scene.add(originalAmbiantLight);
    this.modifiedScene.add(modifiedAmbiantLight);
  }

  private generateThematicScenes(primitiveScenes: IScenesJSON): void {
    for (const i of primitiveScenes.originalObjects) {
      this.generateThematicObject(i, true);
    }
    for (const j of primitiveScenes.modifiedObjects) {
      this.generateThematicObject(j, false);
    }
    this.setSkyBoxThematic();
  }

  private generateThematicObject(object: IJson3DObject, isOriginalObject: boolean): void {
    const loader: GLTFLoader = new GLTFLoader();
    loader.load(this.buildObjectPath(ObjectGeometry[object.type]), (gltf: GLTF) => {
      if (object.texture) {
        this.traverseChildren(gltf.scene.children[0], object.texture);
      }
      this.formService.setUpThematicParameters(object, gltf);
      (isOriginalObject) ? this.scene.add(gltf.scene) : this.modifiedScene.add(gltf.scene);
    });
  }

  private traverseChildren(object: Object3D, type: ObjectTexture): void {
    for (const obj of object.children) {
      if (obj.type === "Mesh") {
        this.setTexture(obj, type);
      } else if (obj !== undefined) {
        this.traverseChildren(obj, type);
      }
    }
  }

  private setTexture(object: Object3D, type: ObjectTexture): void {
    const textureLoader: TextureLoader = new TextureLoader();
    const texture: Texture = textureLoader.load(this.buildTexturePath(ObjectTexture[type]));

    texture.encoding = sRGBEncoding;
    texture.flipY = false;

    (object as Mesh).material = new MeshPhongMaterial({
      map: texture,
    });
  }

  private setSkyBoxThematic (): void {
    const textureLoader: TextureLoader = new TextureLoader();
    const DIMENSION: number = 2000;
    const geometry: BoxGeometry = new BoxGeometry(DIMENSION, DIMENSION, DIMENSION);
    const materials: MeshBasicMaterial[] = [];
    const SKY_BOX_TEXT: string[] = [
      "assets/images/lightblue/right.png",
      "assets/images/lightblue/left.png",
      "assets/images/lightblue/top.png",
      "assets/images/lightblue/bot.png",
      "assets/images/lightblue/front.png",
      "assets/images/lightblue/back.png",
    ];
    for (let index: number = 0; index < geometry.faces.length; index++) {
      materials.push(new MeshBasicMaterial({
        map: textureLoader.load(SKY_BOX_TEXT[index]),
        side: DoubleSide,
      }));
    }
    const skyBox: Mesh = new Mesh(geometry, materials);
    skyBox.name = SKY_BOX_NAME;
    this.scene.add(skyBox.clone());
    this.modifiedScene.add(skyBox.clone());
  }

  private setSkyBoxGeometric(): void {
    const DIMENSION: number = 2000;
    const geometry: BoxGeometry = new BoxGeometry(DIMENSION, DIMENSION, DIMENSION);
    const material: MeshBasicMaterial = new MeshBasicMaterial({side: DoubleSide});
    material.visible = false;
    const skyBox: Mesh = new Mesh(geometry, material);
    skyBox.name = SKY_BOX_NAME;
    this.scene.add(skyBox.clone());
    this.modifiedScene.add(skyBox.clone());
  }

  private buildTexturePath(name: string): string {
    return ("assets/Models/textures/" + name + ".jpg");
  }

  private buildObjectPath(name: string): string {
    return ("assets/Models/space/" + name + "/scene.gltf");
  }

  private generateOriginalScene(primitiveScenes: IScenesJSON): void {
    let object: Mesh;
    for (const i of primitiveScenes.originalObjects) {
      object = this.generate3DObject(i);
      this.scene.add(object);
      this.objects.push(object);
    }
    this.setSkyBoxGeometric();
  }

  private generateModifiedScene(primitiveScenes: IScenesJSON): void {
    let object: Mesh;
    for (const i of primitiveScenes.modifiedObjects) {
      object = this.generate3DObject(i);
      this.modifiedScene.add(object);
      this.modifiedObjects.push(object);
    }
  }

  private generate3DObject(obj: IJson3DObject): Mesh {
    let createdObject: Mesh;
    switch (obj.type) {
      case ObjectGeometry.sphere: {
        createdObject = this.formService.createSphere(obj as ISphere);
        break;
      }
      case ObjectGeometry.cube: {
        createdObject = this.formService.createCube(obj as ICube);
        break;
      }
      case ObjectGeometry.cone: {
        createdObject = this.formService.createCone(obj as ICone);
        break;
      }
      case ObjectGeometry.cylinder: {
        createdObject = this.formService.createCylinder(obj as ICylinder);
        break;
      }
      case ObjectGeometry.pyramid: {
        createdObject = this.formService.createPyramid(obj as IPyramid);
        break;
      }
      default: {
        createdObject = new Mesh();
      }
    }

    return createdObject;
  }
}
