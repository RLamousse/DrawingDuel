import { Injectable } from "@angular/core";
import * as THREE from "three";
import * as IObject from "../../../../../common/free-game-json-interface/JSONInterface/IScenesJSON";
import {IPoint3D, IVector3} from "../../../../../common/model/point";
@Injectable()
export class Form3DService {

  private static toThreeVector3(vec: IVector3): THREE.Vector3 {
    const {x, y, z}: IPoint3D = vec;

    return new THREE.Vector3(x, y, z);
  }

  private static setUpParameters(mesh: THREE.Mesh, obj: IObject.IJson3DObject): void {
    mesh.position.copy(Form3DService.toThreeVector3(obj.position));
    mesh.rotateX(obj.rotation.x);
    mesh.rotateY(obj.rotation.y);
    mesh.rotateZ(obj.rotation.z);
  }

  public createCube(obj: IObject.ICube): THREE.Mesh {
    const geometry: THREE.BoxGeometry = new THREE.BoxGeometry(obj.sideLength, obj.sideLength, obj.sideLength);
    const material: THREE.MeshPhongMaterial = new THREE.MeshPhongMaterial({ color: obj.color });
    const cube: THREE.Mesh = new THREE.Mesh(geometry, material);
    Form3DService.setUpParameters(cube, obj);

    return cube;
  }

  public createSphere(obj: IObject.ISphere): THREE.Mesh {
    const geometry: THREE.SphereGeometry = new THREE.SphereGeometry(obj.radius, obj.widthSegments, obj.heightSegments);
    const material: THREE.MeshPhongMaterial = new THREE.MeshPhongMaterial({ color: obj.color });
    const sphere: THREE.Mesh = new THREE.Mesh(geometry, material);
    Form3DService.setUpParameters(sphere, obj);

    return sphere;
  }

  public createCone(obj: IObject.ICone): THREE.Mesh {
    const geometry: THREE.ConeGeometry = new THREE.ConeGeometry(obj.radius, obj.height, obj.radialSegment);
    const material: THREE.MeshPhongMaterial = new THREE.MeshPhongMaterial({ color: obj.color });
    const cone: THREE.Mesh = new THREE.Mesh(geometry, material);
    Form3DService.setUpParameters(cone, obj);

    return cone;
  }

  public createCylinder(obj: IObject.ICylinder): THREE.Mesh {
    const geometry: THREE.CylinderGeometry = new THREE.CylinderGeometry(
      obj.topRadius,
      obj.botRadius,
      obj.height,
      obj.radiusSegment,
    );
    const material: THREE.MeshPhongMaterial = new THREE.MeshPhongMaterial({ color: obj.color });
    const cylinder: THREE.Mesh = new THREE.Mesh(geometry, material);
    Form3DService.setUpParameters(cylinder, obj);

    return cylinder;
  }

  public createPyramid(obj: IObject.IPyramid): THREE.Mesh {
    const geometry: THREE.CylinderGeometry = new THREE.CylinderGeometry(
      obj.topRadius,
      obj.botRadius,
      obj.height,
      obj.radiusSegment,
      obj.heightSegment,
    );
    const material: THREE.MeshPhongMaterial = new THREE.MeshPhongMaterial({ color: obj.color });
    const pyramid: THREE.Mesh = new THREE.Mesh(geometry, material);
    Form3DService.setUpParameters(pyramid, obj);

    return pyramid;
  }

  public setUpThematicParameters(object: IObject.IJson3DObject, gltf: THREE.GLTF): void {
    const scaleFactor: number = object.scale;
    gltf.scene.scale.set(scaleFactor, scaleFactor, scaleFactor);
    gltf.scene.rotateX(object.rotation.x);
    gltf.scene.rotateY(object.rotation.y);
    gltf.scene.rotateZ(object.rotation.z);
    gltf.scene.position.copy(Form3DService.toThreeVector3(object.position));
  }
}
