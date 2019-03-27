import { Injectable } from "@angular/core";
import * as THREE from "three";
import { Coordinate } from "../../../../../common/free-game-json-interface/FreeGameCreatorInterface/free-game-enum";
import * as IObject from "../../../../../common/free-game-json-interface/JSONInterface/IScenesJSON";
@Injectable()
export class Form3DService {

  public createCube(obj: IObject.ICube): THREE.Mesh {
    const geometry: THREE.BoxGeometry = new THREE.BoxGeometry(obj.sideLenght, obj.sideLenght, obj.sideLenght);
    const material: THREE.MeshPhongMaterial = new THREE.MeshPhongMaterial({ color: obj.color });
    const cube: THREE.Mesh = new THREE.Mesh(geometry, material);
    this.setUpParameters(cube, obj);

    return cube;
  }

  public createSphere(obj: IObject.ISphere): THREE.Mesh {
    const geometry: THREE.SphereGeometry = new THREE.SphereGeometry(obj.radius, obj.widthSegments, obj.heightSegments);
    const material: THREE.MeshPhongMaterial = new THREE.MeshPhongMaterial({ color: obj.color });
    const sphere: THREE.Mesh = new THREE.Mesh(geometry, material);
    this.setUpParameters(sphere, obj);

    return sphere;
  }

  public createCone(obj: IObject.ICone): THREE.Mesh {
    const geometry: THREE.ConeGeometry = new THREE.ConeGeometry(obj.radius, obj.height, obj.radialSegment);
    const material: THREE.MeshPhongMaterial = new THREE.MeshPhongMaterial({ color: obj.color });
    const cone: THREE.Mesh = new THREE.Mesh(geometry, material);
    this.setUpParameters(cone, obj);

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
    this.setUpParameters(cylinder, obj);

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
    this.setUpParameters(pyramid, obj);

    return pyramid;
  }

  private setUpParameters(mesh: THREE.Mesh, obj: IObject.IJson3DObject): void {
    mesh.position.set(obj.position[Coordinate.X], obj.position[Coordinate.Y], obj.position[Coordinate.Z]);
    mesh.rotateX(obj.rotation[Coordinate.X]);
    mesh.rotateY(obj.rotation[Coordinate.Y]);
    mesh.rotateZ(obj.rotation[Coordinate.Z]);
  }

  public setUpThematicParameters(object: IObject.IJson3DObject, gltf: THREE.GLTF): void {
    const scaleFactor: number = object.scale;
    gltf.scene.scale.set(scaleFactor, scaleFactor, scaleFactor);
    gltf.scene.rotateX(object.rotation[Coordinate.X]);
    gltf.scene.rotateY(object.rotation[Coordinate.Y]);
    gltf.scene.rotateZ(object.rotation[Coordinate.Z]);
    gltf.scene.position.set(object.position[Coordinate.X], object.position[Coordinate.Y], object.position[Coordinate.Z]);
  }
}
