export enum ModificationType { remove, add, changeColor }

export enum ObjectGeometry { UFO, astronaut, asteroid, rocket, dog, fighter, shuttle, comet, earth, buzz,
                            sphere, cube, cone, cylinder, pyramid }

export interface thematicObject {
    type: ObjectGeometry,
    scale: number,
}

export const spaceObjects: thematicObject[] = [
    {type: ObjectGeometry.UFO, scale: 0.2},
    {type: ObjectGeometry.astronaut, scale: 7},
    {type: ObjectGeometry.asteroid, scale: 20},
    {type: ObjectGeometry.rocket, scale: 17},
    {type: ObjectGeometry.dog, scale: 7},
    {type: ObjectGeometry.fighter, scale: 0.3},
    {type: ObjectGeometry.shuttle, scale: 1},
    {type: ObjectGeometry.comet, scale: 3},
    {type: ObjectGeometry.earth, scale: 10},
    {type: ObjectGeometry.buzz, scale: 0.6},
];

export enum Coordinate { X, Y, Z }

export enum Themes {
    Geometry = "geometry",
    Space = "space",
    Sanic = "sanic-got-to-go-fast"
}

