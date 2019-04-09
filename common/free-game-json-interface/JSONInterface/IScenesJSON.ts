import {IPoint3D, IVector3, NULL_VECTOR3, ORIGIN_3D} from "../../model/point";
import {ObjectGeometry, ObjectTexture, Themes} from "../FreeGameCreatorInterface/free-game-enum";

export interface IScenesJSON{
    originalObjects: IJson3DObject[],
    modifiedObjects: IJson3DObject[],
}

export interface IScenesDB extends IScenesJSON{
    differentObjects: IJson3DObject[],
}

export interface IJson3DObject {
    position: IPoint3D,
    rotation: IVector3,
    color: number,
    texture?: ObjectTexture,
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
    sideLength: number,
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

export const DEFAULT_OBJECT: IJson3DObject = {
    position: ORIGIN_3D,
    rotation: NULL_VECTOR3,
    color: 0,
    type: ObjectGeometry.cube,
    gameType: Themes.Geometry,
    scale: 1,
};


