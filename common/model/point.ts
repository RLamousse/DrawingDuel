export interface IPoint {
    x: number;
    y: number;
}

export const ORIGIN: IPoint = {
    x: 0,
    y: 0,
};

export const tansformOrigin: (point: IPoint, height: number) => IPoint = (point: IPoint, height: number) => ({
    x: point.x,
    y: height - point.y,
} as IPoint);
