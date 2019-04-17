import {injectable} from "inversify";
import {
    spaceObjects,
    IIndexObj,
    ObjectGeometry,
    Themes
} from "../../../common/free-game-json-interface/FreeGameCreatorInterface/free-game-enum";
import * as JsonScene from "../../../common/free-game-json-interface/JSONInterface/IScenesJSON";
import {getOrigin3D, IVector3} from "../../../common/model/point";
import {getRandomValue} from "../../../common/util/util";

@injectable()
export class Object3DCreatorService {
    private readonly BASE_SIZE: number = 20;
    private readonly MAX_SIZE_FACTOR: number = 150;
    private readonly MIN_SIZE_FACTOR: number = 50;
    private readonly SEGMENTS: number = 32;
    private readonly RADIUS_FACTOR: number = 2;
    private readonly COLOR_MASK: number = 0xFFFFFF;
    private readonly FACTOR2: number = 2;
    private readonly PERCENT_FACTOR: number = 100;
    private readonly FULL_ROTATION: number = this.FACTOR2 * Math.PI;

    private sizeGenerator(baseSize: number): number {
        return getRandomValue(this.MIN_SIZE_FACTOR, this.MAX_SIZE_FACTOR) / this.PERCENT_FACTOR * baseSize;
    }

    public createCube(): JsonScene.ICube {

        return {
            type: ObjectGeometry.cube,
            position: getOrigin3D(),
            rotation: this.logicRandomRotation(this.FULL_ROTATION),
            color: Math.random() * this.COLOR_MASK,
            sideLength: this.sizeGenerator(this.BASE_SIZE),
            scale: 1,
            gameType: Themes.Geometry,
        };
    }

    public createSphere(): JsonScene.ISphere {
        const sphereSize: number = this.sizeGenerator(this.BASE_SIZE) / this.RADIUS_FACTOR;

        return {
            type: ObjectGeometry.sphere,
            position: getOrigin3D(),
            rotation: this.logicRandomRotation(this.FULL_ROTATION),
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
            position: getOrigin3D(),
            rotation: this.logicRandomRotation(this.FULL_ROTATION),
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
            position: getOrigin3D(),
            rotation: this.logicRandomRotation(this.FULL_ROTATION),
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
            position: getOrigin3D(),
            rotation: this.logicRandomRotation(this.FULL_ROTATION),
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

    public createThematicObject(objectType?: ObjectGeometry): JsonScene.IJson3DObject {
        let randomObj: IIndexObj = this.randomTypeByProba();
        const OFFSET: number = 5;
        (objectType) ?
            randomObj = {type: objectType, index: objectType - OFFSET} :
            randomObj = this.randomTypeByProba();

        return {
            type: randomObj.type,
            scale: this.sizeGenerator(spaceObjects[randomObj.index].scale),
            position: getOrigin3D(),
            rotation: this.logicRandomRotation(spaceObjects[randomObj.index].maxRotation),
            gameType: Themes.Space,
            color: this.COLOR_MASK,
        };
    }

    private getRandomValue(min: number, max: number): number {
        return (Math.random() * (max - min) + min);
    }

    private logicRandomRotation(maxRotation: number): IVector3 {
        return {
            x: this.getRandomValue(-maxRotation, maxRotation),
            y: this.getRandomValue(0, this.FULL_ROTATION),
            z: this.getRandomValue(-maxRotation, maxRotation),
        };
    }

    private randomTypeByProba(): IIndexObj {
        const index: number =  Math.random();
        const spaceObjectSize: number = 8;
        let floor: number = 0;
        let objectIndex: IIndexObj = {type: ObjectGeometry.comet, index: 0};

        for (let i: number = 0; i <= spaceObjectSize; i++) {
            if (index >= floor && index <= floor + spaceObjects[i].probability) {
                objectIndex = {
                    type: spaceObjects[i].type,
                    index: i,
                };
                break;
            }
            floor += spaceObjects[i].probability;
        }

        return objectIndex;
    }

}
