export interface IPoint {
    x: number;
    y: number;
}

export interface IPoint3D extends IPoint {
    z: number
}

export type IVector3 = IPoint3D;

export const getOrigin:
    () => IPoint =
    () => {
        return {x: 0, y: 0};
    };

export const getOrigin3D:
    () => IPoint3D =
    () => {
        return {x: 0, y: 0, z: 0};
    };

export const inverseY:
    (point: IPoint, height: number) => IPoint =
    (point: IPoint, height: number) => {
        return {
            x: point.x,
            y: height - point.y,
        } as IPoint;
    };

export const distance:
    (x: IPoint3D, y: IPoint3D) => number =
    (x: IPoint3D, y: IPoint3D) => {
        return Math.sqrt(
            Math.pow(x.x - y.x, 2) +
            Math.pow(x.y - y.y, 2) +
            Math.pow(x.z - y.z, 2),
        );
    };
