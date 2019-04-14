import {Intersection, Mesh, Object3D, Scene} from "three";

export const SCENE_TYPE: string = "Scene";

export const get3DObject:
  (obj: Intersection) => Object3D =
  (obj: Intersection): Object3D => {
    if ((obj.object.parent as Object3D).type === SCENE_TYPE) {
      return obj.object;
    } else {
      return getRecursiveParent(obj.object);
    }
  };

export const getRecursiveParent:
  (obj: Object3D) => Object3D =
  (obj: Object3D): Object3D => {
    if ((obj.parent as Object3D).type !== SCENE_TYPE) {
      return getRecursiveParent(obj.parent as Object3D);
    }

    return (obj.parent as Object3D);
  };

export const changeVisibility:
  (value: (Mesh | Scene)) => void =
  (value: Mesh | Scene): void => {
    if (value instanceof Mesh) {
      Array.isArray(value.material) ? value.material.forEach((material) => {
          material.visible = !material.visible;
        }) :
        value.material.visible = !value.material.visible;
    } else {
      value.children.forEach((valueChild: Object3D) => {
        changeVisibility(valueChild as Scene);
      });
    }
  };
