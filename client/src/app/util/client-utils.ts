import {Object3D, Scene, Vector3} from "three";
import {ObjectNotFoundError} from "../../../../common/errors/services.errors";
import {IJson3DObject} from "../../../../common/free-game-json-interface/JSONInterface/IScenesJSON";
import {IVector3} from "../../../../common/model/point";
import {deepCompare} from "../../../../common/util/util";
import {SKY_BOX_NAME} from "../scene-creator/FreeGameCreator/free-game-creator.service";

export const toIVector3:
  (vector: Vector3) => IVector3 =
  (vector: Vector3) => {
    return {x: vector.x, y: vector.y, z: vector.z};
  };

export const compareToThreeVector3:
  (x: IVector3, y: Vector3) => boolean =
  (x: IVector3, y: Vector3) => {
    return deepCompare(x, toIVector3(y));
  };

export const getSceneObject:
  (jsonObj: IJson3DObject, scene: Scene) => Object3D | undefined =
  (jsonObj: IJson3DObject, scene: Scene): Object3D | undefined => {
    return scene.children
      .filter((object: Object3D) => object.name !== SKY_BOX_NAME)
      .find((object: Object3D) => compareToThreeVector3(jsonObj.position, object.position));
  };

export const getObjectFromScenes:
  (jsonObj: IJson3DObject, ...scenes: Scene[]) => Object3D =
  (jsonObj: IJson3DObject, ...scenes: Scene[]): Object3D => {
    for (let scene of scenes) {
      const sceneObjectCandidate: Object3D | undefined = getSceneObject(jsonObj, scene);
      if (sceneObjectCandidate !== undefined) {
        return sceneObjectCandidate;
      }
    }
    throw new ObjectNotFoundError();
  };
