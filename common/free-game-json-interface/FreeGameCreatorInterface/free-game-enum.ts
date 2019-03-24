export enum ModificationType { remove, add, changeColor }

export enum ObjectGeometry { UFO, astronaut, ISS, rocket, apollo, satellite, asteroid, comet, earth, sun,
                            sphere, cube, cone, cylinder, pyramid }

export interface thematicObject {
    type: ObjectGeometry,
    scale: number,
}

export const spaceObjects: thematicObject[] = [
    {type: ObjectGeometry.UFO, scale: 0.3},
    {type: ObjectGeometry.astronaut, scale: 3},
    {type: ObjectGeometry.ISS, scale: 0.3},
    {type: ObjectGeometry.rocket, scale: 10},
    {type: ObjectGeometry.apollo, scale: 0.3},
    {type: ObjectGeometry.satellite, scale: 7},
    {type: ObjectGeometry.asteroid, scale: 2},
    {type: ObjectGeometry.comet, scale: 1},
    {type: ObjectGeometry.earth, scale: 3},
    {type: ObjectGeometry.sun, scale: 3},
];

export enum Coordinate { X, Y, Z }

export enum Themes {
    Geometry = "geometry",
    Space = "space",
    Sanic = "sanic-got-to-go-fast"
}

