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
    cube.position = new THREE.Vector3(obj.position[Coordinate.X], obj.position[Coordinate.Y], obj.position[Coordinate.Z]);
    cube.rotateX(obj.rotation[Coordinate.X]);
    cube.rotateY(obj.rotation[Coordinate.Y]);
    cube.rotateZ(obj.rotation[Coordinate.Z]);

    return cube;
  }

  public createSphere(obj: IObject.ISphere): THREE.Mesh {
    const geometry: THREE.SphereGeometry = new THREE.SphereGeometry(obj.radius, obj.widthSegments, obj.heightSegments);
    const material: THREE.MeshPhongMaterial = new THREE.MeshPhongMaterial({ color: obj.color });
    const sphere: THREE.Mesh = new THREE.Mesh(geometry, material);
    sphere.position = new THREE.Vector3(obj.position[Coordinate.X], obj.position[Coordinate.Y], obj.position[Coordinate.Z]);
    sphere.rotateX(obj.rotation[Coordinate.X]);
    sphere.rotateY(obj.rotation[Coordinate.Y]);
    sphere.rotateZ(obj.rotation[Coordinate.Z]);

    return sphere;
  }

  public createCone(obj: IObject.ICone): THREE.Mesh {
    const geometry: THREE.ConeGeometry = new THREE.ConeGeometry(obj.radius, obj.height, obj.radialSegment);
    const material: THREE.MeshPhongMaterial = new THREE.MeshPhongMaterial({ color: obj.color });
    const cone: THREE.Mesh = new THREE.Mesh(geometry, material);
    cone.position = new THREE.Vector3(obj.position[Coordinate.X], obj.position[Coordinate.Y], obj.position[Coordinate.Z]);
    cone.rotateX(obj.rotation[Coordinate.X]);
    cone.rotateY(obj.rotation[Coordinate.Y]);
    cone.rotateZ(obj.rotation[Coordinate.Z]);

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
    cylinder.position = new THREE.Vector3(obj.position[Coordinate.X], obj.position[Coordinate.Y], obj.position[Coordinate.Z]);
    cylinder.rotateX(obj.rotation[Coordinate.X]);
    cylinder.rotateY(obj.rotation[Coordinate.Y]);
    cylinder.rotateZ(obj.rotation[Coordinate.Z]);

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
    pyramid.position = new THREE.Vector3(obj.position[Coordinate.X], obj.position[Coordinate.Y], obj.position[Coordinate.Z]);
    pyramid.rotateX(obj.rotation[Coordinate.X]);
    pyramid.rotateY(obj.rotation[Coordinate.Y]);
    pyramid.rotateZ(obj.rotation[Coordinate.Z]);

    return pyramid;
  }
}
