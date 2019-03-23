import {injectable} from "inversify";
import {ObjectGeometry, Themes} from "../../../common/free-game-json-interface/FreeGameCreatorInterface/free-game-enum";
import * as JsonScene from "../../../common/free-game-json-interface/JSONInterface/IScenesJSON";

@injectable()
export class Object3DCreatorService {
    private readonly BASE_SIZE: number = 20;
    private readonly MAX_SIZE_FACTOR: number = 150;
    private readonly MIN_SIZE_FACTOR: number = 50;
    private readonly SEGMENTS: number = 32;
    private readonly RADIUS_FACTOR: number = 2;
    private readonly COLOR_MASK: number = 0xFFFFFF;

    private sizeGenerator(baseSize: number): number {
        const percentFactor: number = 100;

        return (
            Math.floor(Math.random() * (this.MAX_SIZE_FACTOR - this.MIN_SIZE_FACTOR + 1) + this.MIN_SIZE_FACTOR) /
            percentFactor * baseSize
        );
    }

    public createCube(): JsonScene.ICube {

        return {
            type: ObjectGeometry.cube,
            position: [0, 0, 0],
            rotation: [0, 0, 0],
            color: Math.random() * this.COLOR_MASK,
            sideLenght: this.sizeGenerator(this.BASE_SIZE),
            scale: 1,
            gameType: Themes.Geometry,
        };
    }

    public createSphere(): JsonScene.ISphere {
        const sphereSize: number = this.sizeGenerator(this.BASE_SIZE) / this.RADIUS_FACTOR;

        return {
            type: ObjectGeometry.sphere,
            position: [0, 0, 0],
            rotation: [0, 0, 0],
            color: Math.random() * this.COLOR_MASK,
            radius: sphereSize,
            widthSegments: this.SEGMENTS,
            heightSegments: this.SEGMENTS,
            scale: 1,
            gameType: Themes.Geometry,
        };
    }

    public createCone(): JsonScene.ICone {
        const coneSize: number = this.sizeGenerator(this.BASE_SIZE);

        return {
            type: ObjectGeometry.cone,
            position: [0, 0, 0],
            rotation: [0, 0, 0],
            color: Math.random() * this.COLOR_MASK,
            radius: coneSize / this.RADIUS_FACTOR,
            height: coneSize,
            radialSegment: this.SEGMENTS,
            gameType: Themes.Geometry,
            scale: 1,
        };
    }

    public createCylinder(): JsonScene.ICylinder {
        const cylinderSize: number = this.sizeGenerator(this.BASE_SIZE);

        return {
            type: ObjectGeometry.cylinder,
            position: [0, 0, 0],
            rotation: [0, 0, 0],
            color: Math.random() * this.COLOR_MASK,
            topRadius: cylinderSize / this.RADIUS_FACTOR,
            botRadius: cylinderSize / this.RADIUS_FACTOR,
            height: cylinderSize,
            radiusSegment: this.SEGMENTS,
            gameType: Themes.Geometry,
            scale: 1,
        };
    }

    public createPyramid(): JsonScene.IPyramid {
        const PYRAMID_TOP_RAD: number = 0;
        const HEIGHT_SEG: number = 1;
        const BASE_SIDES: number = 3;
        const pyramidSize: number = this.sizeGenerator(this.BASE_SIZE);

        return {
            type: ObjectGeometry.pyramid,
            position: [0, 0, 0],
            rotation: [0, 0, 0],
            color: Math.random() * this.COLOR_MASK,
            topRadius: PYRAMID_TOP_RAD,
            botRadius: pyramidSize / this.RADIUS_FACTOR,
            height: pyramidSize,
            radiusSegment: BASE_SIDES,
            heightSegment: HEIGHT_SEG,
            gameType: Themes.Geometry,
            scale: 1,
        };
    }

    public createThematicObject(): JsonScene.IJson3DObject {
        //const index: number =  Math.random() * (14 - 5) + 5;

        return {
            type: ObjectGeometry.apollo,
            scale: 1,
            position: [0, 0, 0],
            rotation: [0, 0, 0],
            gameType: Themes.Space,
            color: Math.random() * this.COLOR_MASK,
        };
    }
}
