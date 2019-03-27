export enum ModificationType { remove, add, changeColor }

export enum ObjectGeometry {sphere, cube, cone, cylinder, pyramid, comet, asteroid, astronaut,
                            dog, rocket, fighter, shuttle, UFO, buzz, earth}

export enum ObjectTexture {blue, fur, rainbow, skulls, spongebob}

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
    {type: ObjectGeometry.comet, scale: 1.1, probability: 0.2, maxRotation: Math.PI * 2},
    {type: ObjectGeometry.asteroid, scale: 12, probability: 0.2, maxRotation: Math.PI * 2},
    {type: ObjectGeometry.astronaut, scale: 4, probability: 0.15, maxRotation: Math.PI / 4},
    {type: ObjectGeometry.dog, scale: 6, probability: 0.05, maxRotation: Math.PI / 4},
    {type: ObjectGeometry.rocket, scale: 8, probability: 0.10, maxRotation: Math.PI / 4},
    {type: ObjectGeometry.fighter, scale: 0.25, probability: 0.10, maxRotation: Math.PI * 2},
    {type: ObjectGeometry.shuttle, scale: 1, probability: 0.10, maxRotation: Math.PI / 4},
    {type: ObjectGeometry.UFO, scale: 0.3, probability: 0.05, maxRotation: Math.PI / 4},
    {type: ObjectGeometry.buzz, scale: 0.3, probability: 0.04, maxRotation: Math.PI / 4},
    {type: ObjectGeometry.earth, scale: 12, probability: 0, maxRotation: Math.PI * 2},
];

export enum Coordinate { X, Y, Z }

export enum Themes {
    Geometry = "geometry",
    Space = "space",
}

