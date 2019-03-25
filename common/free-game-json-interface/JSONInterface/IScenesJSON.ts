﻿import {ObjectGeometry, Themes} from "../FreeGameCreatorInterface/free-game-enum";

export interface IScenesJSON{
    originalObjects: IJson3DObject[],
    modifiedObjects: IJson3DObject[],
}

export interface IJson3DObject {
    position: number[],
    rotation: number[],
    color: number,
    texture?: string,
    type: ObjectGeometry,
    scale: number
    gameType: Themes,
}

export interface ISphere extends IJson3DObject {
    radius: number,
    widthSegments: number,
    heightSegments: number,
}

export interface ICube extends IJson3DObject {
    sideLenght: number,
}

export interface ICone extends IJson3DObject {
    radius: number,
    height: number,
    radialSegment: number,
}

export interface IPyramid extends IJson3DObject {
    topRadius: number,
    botRadius: number,
    height: number,
    radiusSegment: number,
    heightSegment: number,
}

export interface ICylinder extends IJson3DObject {
    topRadius: number,
    botRadius: number,
    height: number,
    radiusSegment: number,
}


