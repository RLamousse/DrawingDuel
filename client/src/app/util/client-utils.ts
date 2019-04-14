import {Vector3} from "three";
import {IVector3} from "../../../../common/model/point";
import {deepCompare} from "../../../../common/util/util";

export const compareToThreeVector3:
  (x: IVector3, y: Vector3) => boolean =
  (x: IVector3, y: Vector3) => {
    return deepCompare(x, {x: y.x, y: y.y, z: y.z} as IVector3);
  };
