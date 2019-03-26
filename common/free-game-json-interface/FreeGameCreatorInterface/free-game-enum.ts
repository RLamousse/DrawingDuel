export enum ModificationType { remove, add, changeColor }

export enum ObjectGeometry {sphere, cube, cone, cylinder, pyramid, comet, asteroid, astronaut,
                            dog, rocket, fighter, shuttle, UFO, earth, buzz}

export interface IThematicObject {
    type: ObjectGeometry,
    scale: number,
    probability: number,
    maxRotation: number,
}

export interface IIndexObj {
    type: ObjectGeometry,
    index: number,
}

export const spaceObjects: IThematicObject[] = [
    {type: ObjectGeometry.comet, scale: 2.3, probability: 0.19, maxRotation: Math.PI * 2},
    {type: ObjectGeometry.asteroid, scale: 25, probability: 0.2, maxRotation: Math.PI * 2},
    {type: ObjectGeometry.astronaut, scale: 7, probability: 0.15, maxRotation: Math.PI / 4},
    {type: ObjectGeometry.dog, scale: 12, probability: 0.05, maxRotation: Math.PI / 4},
    {type: ObjectGeometry.rocket, scale: 17, probability: 0.10, maxRotation: Math.PI / 4},
    {type: ObjectGeometry.fighter, scale: 0.5, probability: 0.10, maxRotation: Math.PI * 2},
    {type: ObjectGeometry.shuttle, scale: 2, probability: 0.10, maxRotation: Math.PI / 4},
    {type: ObjectGeometry.UFO, scale: 0.6, probability: 0.04, maxRotation: Math.PI / 4},
    {type: ObjectGeometry.earth, scale: 10, probability: 0.03, maxRotation: Math.PI * 2},
    {type: ObjectGeometry.buzz, scale: 0.6, probability: 0.03, maxRotation: Math.PI / 4},
];

export enum Coordinate { X, Y, Z }

export enum Themes {
    Geometry = "geometry",
    Space = "space",
    Sanic = "sanic-got-to-go-fast"
}

