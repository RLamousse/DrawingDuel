import { Injectable } from "@angular/core";
import * as THREE from "three";
import { ObjectGeometry } from "../../../../../common/free-game-json-interface/FreeGameCreatorInterface/free-game-enum";
import * as IObject from "../../../../../common/free-game-json-interface/JSONInterface/IScenesJSON";
import { Form3DService } from "../3DFormService/3-dform.service";

@Injectable()
export class FreeGameCreatorService {

  public scene: THREE.Scene;
  public modifiedScene: THREE.Scene;

  private formService: Form3DService;

  private objects: THREE.Mesh[];
  private modifiedObjects: THREE.Mesh[];
  private primitiveScenes: IObject.IScenesJSON;

  public constructor(primScenes: IObject.IScenesJSON) {
    this.formService = new Form3DService();
    this.primitiveScenes = primScenes;
    this.objects = [];
    this.modifiedObjects = [];
  }

  public createScenes(): void {

    this.scene = new THREE.Scene();
    this.modifiedScene = new THREE.Scene();
    this.setLighting();
    this.generateOriginalScene();
    this.generateModifiedScene();
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

  private generateOriginalScene(): void {
    let object: THREE.Mesh;
    for (const i of this.primitiveScenes.originalObjects) {
      object = this.generate3DObject(i);
      this.scene.add(object);
      this.objects.push(object);
    }
  }

  private generateModifiedScene(): void {
    let object: THREE.Mesh;
    for (const i of this.primitiveScenes.modifiedObjects) {
      object = this.generate3DObject(i);
      this.modifiedScene.add(object);
      this.modifiedObjects.push(object);
    }
  }

  private generate3DObject(obj: IObject.IJson3DObject): THREE.Mesh {
    let createdObject: THREE.Mesh;
    switch (obj.type) {
      case ObjectGeometry.sphere: {
        createdObject = this.formService.createSphere(obj as IObject.ISphere);
        break; }
      case ObjectGeometry.cube: {
        createdObject = this.formService.createCube(obj as IObject.ICube);
        break; }
      case ObjectGeometry.cone: {
        createdObject = this.formService.createCone(obj as IObject.ICone);
        break; }
      case ObjectGeometry.cylinder: {
        createdObject = this.formService.createCylinder(obj as IObject.ICylinder);
        break; }
      case ObjectGeometry.pyramid: {
        createdObject = this.formService.createPyramid(obj as IObject.IPyramid);
        break; }
      default: {
        createdObject = new THREE.Mesh(); }
    }

    return createdObject;
  }
}
