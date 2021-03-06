import {inject, injectable} from "inversify";
import {
    spaceObjects,
    ModificationType,
    ObjectGeometry,
    ObjectTexture,
    Themes
} from "../../../common/free-game-json-interface/FreeGameCreatorInterface/free-game-enum";
import {DEFAULT_OBJECT, IJson3DObject, IScenesDB} from "../../../common/free-game-json-interface/JSONInterface/IScenesJSON";
import {getOrigin3D, IPoint3D} from "../../../common/model/point";
import {getRandomValue} from "../../../common/util/util";
import Types from "../types";
import {Object3DCreatorService} from "./object3D-creator.service";

@injectable()
export class FreeGameCreatorService {

    public constructor(@inject(Types.Object3DCreatorService) private object3DCreatorService: Object3DCreatorService) {}

    private readonly MAX_TYPE_OBJECTS: number = 4;
    private readonly MIN_DIST: number = 130;
    private readonly MAX_GAME_X: number = 450;
    private readonly MAX_GAME_Y: number = 450;
    private readonly MAX_GAME_Z: number = 450;

    private handleCollision(object: IJson3DObject,
                            list: IJson3DObject[]): IJson3DObject {
        let collision: boolean = true;
        if (list.length !== 0) {
            while (collision) {
                for (const i of list) {
                    collision = this.isColliding(i, object);
                    if (collision) {
                        object.position = this.generateRandomPosition();
                        break;
                    }
                }
            }
        }

        return object;
    }

    private isColliding(currObject: IJson3DObject, object: IJson3DObject, distanceMin: number = this.MIN_DIST): boolean {
        const power: number = 2;
        const distance: number = Math.sqrt(
            (Math.pow((currObject.position.x - object.position.x), power)) +
            (Math.pow((currObject.position.y - object.position.y), power)) +
            (Math.pow((currObject.position.z - object.position.z), power)),
        );

        return (distance < distanceMin);
    }

    private generate3DObject(): IJson3DObject {
        let randomObject: number;
        let createdObject: IJson3DObject;
        randomObject = getRandomValue(0, this.MAX_TYPE_OBJECTS);
        switch (randomObject) {
            case ObjectGeometry.sphere: {
                createdObject = this.object3DCreatorService.createSphere();
                break; }
            case ObjectGeometry.cube: {
                createdObject = this.object3DCreatorService.createCube();
                break; }
            case ObjectGeometry.cone: {
                createdObject = this.object3DCreatorService.createCone();
                break; }
            case ObjectGeometry.cylinder: {
                createdObject = this.object3DCreatorService.createCylinder();
                break; }
            case ObjectGeometry.pyramid: {
                createdObject = this.object3DCreatorService.createPyramid();
                break; }
            default: {
                createdObject = DEFAULT_OBJECT;
            }
        }

        return createdObject;
    }

    public generateIScenes(obj3DToCreate: number, modificationTypes: ModificationType[], sceneType: Themes): IScenesDB {
        const objects: IJson3DObject[] = [];
        if (sceneType === Themes.Space) {
            objects.push(this.renderEarth());
        }
        for (let i: number = 0; i < obj3DToCreate; ++i) {
            let object: IJson3DObject;
            object = sceneType === Themes.Geometry ? this.generate3DObject() : this.object3DCreatorService.createThematicObject();
            object.position = this.generateRandomPosition();
            object = this.handleCollision(object, objects);
            this.setAstronautCloseFromEarth(object, objects);
            objects.push(object);
        }
        const modifiedObjects: IJson3DObject[] = JSON.parse(JSON.stringify(objects));
        const differentObjects: IJson3DObject[] = this.generateDifferences(modificationTypes, modifiedObjects);

        return {originalObjects: objects, modifiedObjects: modifiedObjects, differentObjects: differentObjects};
    }

    private generateDifferences(modificationTypes: ModificationType[], modifiedObjects: IJson3DObject[]): IJson3DObject[] {
        const MOD_COUNT: number = 7;
        const INDEXES: Set<number> = new Set();
        while (INDEXES.size !== MOD_COUNT) {
            INDEXES.add(getRandomValue(1, modifiedObjects.length - 1));
        }

        return this.randomDifference(INDEXES, modificationTypes, modifiedObjects);
    }

    private randomDifference(
        table: Set<number>,
        modificationTypes: ModificationType[],
        modifiedObjects: IJson3DObject[]): IJson3DObject[] {

        const MAX_MOD_TYPE: number = modificationTypes.length - 1;
        const ARRAY_INDEXES: number[] = Array.from(table).sort((n1: number, n2: number) => n1 - n2).reverse();
        const modObjects: IJson3DObject[] = [];
        let randomModifications: number;

        for (const index of ARRAY_INDEXES) {
            randomModifications = getRandomValue(0, MAX_MOD_TYPE);
            switch (modificationTypes[randomModifications]) {
                case ModificationType.remove:
                    modObjects.push(JSON.parse(JSON.stringify(modifiedObjects[index])));
                    modifiedObjects.splice(index, 1);
                    break;
                case ModificationType.add:
                    this.addObject(modifiedObjects, modObjects);
                    break;
                case ModificationType.changeColor:
                    this.changeColor(modifiedObjects, index);
                    modObjects.push(JSON.parse(JSON.stringify(modifiedObjects[index])));
                    break;
                default:
                    break;
            }
        }

        return modObjects;
    }

    private addObject(modifiedObjects: IJson3DObject[], modObjects: IJson3DObject[]): void {
        let object: IJson3DObject;
        (modifiedObjects[0].gameType === Themes.Geometry) ?
            object = this.generate3DObject() :
            object = this.object3DCreatorService.createThematicObject();
        object = this.handleCollision(object, modifiedObjects);
        modifiedObjects.push(object);
        modObjects.push(JSON.parse(JSON.stringify(object)));
    }

    private changeColor(modifiedObjects: IJson3DObject[], index: number): void {
        const MASK: number = 0xFFFFFF;
        const TEXTURE_SIZE: number = 4;
        (modifiedObjects[0].gameType === Themes.Geometry) ?
            modifiedObjects[index].color = (Math.random() * MASK) :
            modifiedObjects[index].texture = ObjectTexture[ObjectTexture[getRandomValue(0, TEXTURE_SIZE)]];
    }

    private generateRandomPosition(): IPoint3D {
        return {
            x: getRandomValue(-this.MAX_GAME_X, this.MAX_GAME_X),
            y: getRandomValue(-this.MAX_GAME_Y, this.MAX_GAME_Y),
            z: getRandomValue(-this.MAX_GAME_Z, this.MAX_GAME_Z),
        };
    }

    private renderEarth(): IJson3DObject {
        const earth: IJson3DObject = this.object3DCreatorService.createThematicObject(ObjectGeometry.earth);
        earth.scale = spaceObjects[spaceObjects.length - 1].scale;
        earth.position = getOrigin3D();

        return earth;
    }

    private setAstronautCloseFromEarth(object: IJson3DObject, objects: IJson3DObject[]): void {
        const CLOSE_FROM_EARTH: number = 50;
        const FURTHER_FROM_EARTH: number = 70;
        const MIN_DIST: number = 10;
        const ASTRONAUT_INDEX: number = 2;
        if (object.type === ObjectGeometry.astronaut) {
            let collision: boolean = true;
            object.scale = spaceObjects[ASTRONAUT_INDEX].scale;
            while (collision) {
                object.position.x = this.randomNegative() * getRandomValue(CLOSE_FROM_EARTH, FURTHER_FROM_EARTH);
                object.position.y = this.randomNegative() * getRandomValue(CLOSE_FROM_EARTH, FURTHER_FROM_EARTH);
                object.position.z = this.randomNegative() * getRandomValue(CLOSE_FROM_EARTH, FURTHER_FROM_EARTH);
                for (const indexObj of objects) {
                    collision = this.isColliding(object, indexObj, MIN_DIST);
                    if (collision) {
                        break;
                    }
                }
            }
        }
    }

    private randomNegative(): number {
        const NEGATIF: number = -1;

        return (getRandomValue(0, 1) > 0) ?
            1 :
            NEGATIF;
    }
}
