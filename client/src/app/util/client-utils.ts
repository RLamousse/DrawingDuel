import {Vector3} from "three";
import {IVector3} from "../../../../common/model/point";
import {deepCompare} from "../../../../common/util/util";

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
