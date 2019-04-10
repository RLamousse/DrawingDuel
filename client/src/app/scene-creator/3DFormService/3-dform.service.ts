import { Injectable } from "@angular/core";
import {BoxGeometry, ConeGeometry, CylinderGeometry, GLTF, Mesh, MeshPhongMaterial, SphereGeometry, Vector3} from "three";
import {
  ICone,
  ICube,
  ICylinder,
  IJson3DObject,
  IPyramid,
  ISphere
} from "../../../../../common/free-game-json-interface/JSONInterface/IScenesJSON";
import {IPoint3D, IVector3} from "../../../../../common/model/point";
@Injectable()
export class Form3DService {

  private static toThreeVector3(vec: IVector3): Vector3 {
    const {x, y, z}: IPoint3D = vec;

    return new Vector3(x, y, z);
  }

  private static setUpParameters(mesh: Mesh, obj: IJson3DObject): void {
    mesh.position.copy(Form3DService.toThreeVector3(obj.position));
    mesh.rotateX(obj.rotation.x);
    mesh.rotateY(obj.rotation.y);
    mesh.rotateZ(obj.rotation.z);
  }

  public createCube(obj: ICube): Mesh {
    const geometry: BoxGeometry = new BoxGeometry(obj.sideLength, obj.sideLength, obj.sideLength);
    const material: MeshPhongMaterial = new MeshPhongMaterial({color: obj.color});
    const cube: Mesh = new Mesh(geometry, material);
    Form3DService.setUpParameters(cube, obj);

    return cube;
  }

  public createSphere(obj: ISphere): Mesh {
    const geometry: SphereGeometry = new SphereGeometry(obj.radius, obj.widthSegments, obj.heightSegments);
    const material: MeshPhongMaterial = new MeshPhongMaterial({color: obj.color});
    const sphere: Mesh = new Mesh(geometry, material);
    Form3DService.setUpParameters(sphere, obj);

    return sphere;
  }

  public createCone(obj: ICone): Mesh {
    const geometry: ConeGeometry = new ConeGeometry(obj.radius, obj.height, obj.radialSegment);
    const material: MeshPhongMaterial = new MeshPhongMaterial({color: obj.color});
    const cone: Mesh = new Mesh(geometry, material);
    Form3DService.setUpParameters(cone, obj);

    return cone;
  }

  public createCylinder(obj: ICylinder): Mesh {
    const geometry: CylinderGeometry = new CylinderGeometry(
      obj.topRadius,
      obj.botRadius,
      obj.height,
      obj.radiusSegment,
    );
    const material: MeshPhongMaterial = new MeshPhongMaterial({color: obj.color});
    const cylinder: Mesh = new Mesh(geometry, material);
    Form3DService.setUpParameters(cylinder, obj);

    return cylinder;
  }

  public createPyramid(obj: IPyramid): Mesh {
    const geometry: CylinderGeometry = new CylinderGeometry(
      obj.topRadius,
      obj.botRadius,
      obj.height,
      obj.radiusSegment,
      obj.heightSegment,
    );
    const material: MeshPhongMaterial = new MeshPhongMaterial({color: obj.color});
    const pyramid: Mesh = new Mesh(geometry, material);
    Form3DService.setUpParameters(pyramid, obj);

    return pyramid;
  }

  public setUpThematicParameters(object: IJson3DObject, gltf: GLTF): void {
    const scaleFactor: number = object.scale;
    gltf.scene.scale.set(scaleFactor, scaleFactor, scaleFactor);
    gltf.scene.rotateX(object.rotation.x);
    gltf.scene.rotateY(object.rotation.y);
    gltf.scene.rotateZ(object.rotation.z);
    gltf.scene.position.copy(Form3DService.toThreeVector3(object.position));
  }
}
