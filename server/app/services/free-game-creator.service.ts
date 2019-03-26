import {inject, injectable} from "inversify";
import {
    Coordinate,
    ModificationType,
    ObjectGeometry,
    ObjectTexture,
    spaceObjects,
    Themes
} from "../../../common/free-game-json-interface/FreeGameCreatorInterface/free-game-enum";
import * as IObject from "../../../common/free-game-json-interface/JSONInterface/IScenesJSON";
import Types from "../types";
import {Object3DCreatorService} from "./object3D-creator.service";

@injectable()
export class FreeGameCreatorService {

    public constructor(@inject(Types.Object3DCreatorService) private object3DCreatorService: Object3DCreatorService) {}

    private readonly MAX_TYPE_OBJECTS: number = 4;
    private readonly MIN_DIST: number = 130;
    private readonly MAX_GAME_X: number = 300;
    private readonly MAX_GAME_Y: number = 300;
    private readonly MAX_GAME_Z: number = 300;

    private getRandomValue(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    private handleCollision(object: IObject.IJson3DObject,
                            list: IObject.IJson3DObject[]): IObject.IJson3DObject {
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

    private isColliding (currObject: IObject.IJson3DObject, object: IObject.IJson3DObject, distanceMin: number = this.MIN_DIST): boolean {
        const power: number = 2;
        const distance: number = Math.sqrt(
            (Math.pow((currObject.position[Coordinate.X] - object.position[Coordinate.X]), power)) +
            (Math.pow((currObject.position[Coordinate.Y] - object.position[Coordinate.Y]), power)) +
            (Math.pow((currObject.position[Coordinate.Z] - object.position[Coordinate.Z]), power)),
        );

        return (distance < distanceMin);
    }

    private generate3DObject(): IObject.IJson3DObject {
        let randomObject: number;
        let createdObject: IObject.IJson3DObject;
        randomObject = this.getRandomValue(0, this.MAX_TYPE_OBJECTS);
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
                createdObject = { position: [], rotation: [], color: 0, type: ObjectGeometry.cube, gameType: Themes.Geometry, scale: 1 };
            }
        }

        return createdObject;
    }

    public generateIScenes(obj3DToCreate: number, modificationTypes: ModificationType[], sceneType: Themes): IObject.IScenesJSON {
        const objects: IObject.IJson3DObject[] = [];
        if (sceneType === Themes.Space) {
            objects.push(this.renderEarth());
        }
        for (let i: number = 0; i < obj3DToCreate; ++i) {
            let object: IObject.IJson3DObject;
            (sceneType === Themes.Geometry) ?
                object = this.generate3DObject() : object = this.object3DCreatorService.createThematicObject();
            object.position = this.generateRandomPosition();
            // if (object.type === ObjectGeometry.comet || object.type === ObjectGeometry.asteroid) {
            //     object.position[Coordinate.Y] = 0;
            // }
            object = this.handleCollision(object, objects);

            this.setAstronautCloseFromEarth(object, objects);
            // const type: ObjectGeometry = object.type;
            // const position: number[] = object.position;
            objects.push(object);
            // if (this.isPossibleSpaceSquad(i, obj3DToCreate, type)) {
            //     objects.push(this.generateIntelligentObject(position));
            //     i++;
            // }
        }
        const modifiedObjects: IObject.IJson3DObject[] = JSON.parse(JSON.stringify(objects));
        this.generateDifferences(modificationTypes, modifiedObjects);

        return {originalObjects: objects, modifiedObjects: modifiedObjects};
    }

    // private isPossibleSpaceSquad(index: number, obj3DToCreate: number, objectType: ObjectGeometry): boolean {
    //     return ((index + 1) < obj3DToCreate && objectType === ObjectGeometry.shuttle);
    // }

    private generateDifferences(modificationTypes: ModificationType[], modifiedObjects: IObject.IJson3DObject[]): void {
        const MOD_COUNT: number = 7;
        const INDEXES: Set<number> = new Set();
        while (INDEXES.size !== MOD_COUNT) {
            INDEXES.add(this.getRandomValue(1, modifiedObjects.length - 1));
        }
        this.randomDifference(INDEXES, modificationTypes, modifiedObjects);
    }

    private randomDifference(table: Set<number>, modificationTypes: ModificationType[], modifiedObjects: IObject.IJson3DObject[]): void {
        const MAX_MOD_TYPE: number = modificationTypes.length - 1;
        const ARRAY_INDEXES: number[] = Array.from(table).sort((n1: number, n2: number) => n1 - n2).reverse();
        let randomModifications: number;
        for (const index of ARRAY_INDEXES) {
            randomModifications = this.getRandomValue(0, MAX_MOD_TYPE);
            switch (modificationTypes[randomModifications]) {
                case ModificationType.remove: {
                    modifiedObjects.splice(index, 1);
                    break;
                }
                case ModificationType.add: {
                    let object: IObject.IJson3DObject;
                    (modifiedObjects[0].gameType === Themes.Geometry) ?
                        object = this.generate3DObject() :
                        object = this.object3DCreatorService.createThematicObject();
                    object = this.handleCollision(object, modifiedObjects);
                    modifiedObjects.push(object);
                    break;
                }
                case ModificationType.changeColor: {
                    const MASK: number = 0xFFFFFF;
                    const TEXTURE_SIZE: number = 4;
                    (modifiedObjects[0].gameType === Themes.Geometry) ?
                        modifiedObjects[index].color = (Math.random() * MASK) :
                        modifiedObjects[index].texture = ObjectTexture[ObjectTexture[this.getRandomValue(0, TEXTURE_SIZE)]];
                    break;
                }
                default: {
                    break;
                }
            }
        }
    }

    private generateRandomPosition(): number[] {

        return [
            this.getRandomValue(-this.MAX_GAME_X, this.MAX_GAME_X),
            this.getRandomValue(-this.MAX_GAME_Y, this.MAX_GAME_Y),
            this.getRandomValue(-this.MAX_GAME_Z, this.MAX_GAME_Z),
        ];
    }

    // private generateIntelligentObject(position: number[]): IObject.IJson3DObject {
    //     const margin: number = 2000;
    //     const newObj: IObject.IJson3DObject = this.object3DCreatorService.createThematicObject(ObjectGeometry.astronaut);
    //     newObj.position = position;
    //     newObj.position[Coordinate.X] -= margin;
    //     newObj.position[Coordinate.Y] += margin;
    //
    //     return newObj;
    // }
    private renderEarth(): IObject.IJson3DObject {
        const earth: IObject.IJson3DObject = this.object3DCreatorService.createThematicObject(ObjectGeometry.earth);
        earth.scale = spaceObjects[spaceObjects.length - 1].scale;
        earth.position = [0, 0, 0];

        return earth;
    }

    private setAstronautCloseFromEarth(object: IObject.IJson3DObject, objects: IObject.IJson3DObject[]): void {
        const CLOSE_FROM_EARTH: number = 50;
        const FURTHER_FROM_EARTH: number = 70;
        const MIN_DIST: number = 10;
        if (object.type === ObjectGeometry.astronaut) {
            let collision: boolean = true;
            while (collision) {
                object.position[Coordinate.X] = this.randomNegative() * this.getRandomValue(CLOSE_FROM_EARTH, FURTHER_FROM_EARTH);
                object.position[Coordinate.Y] = this.randomNegative() * this.getRandomValue(CLOSE_FROM_EARTH, FURTHER_FROM_EARTH);
                object.position[Coordinate.Z] = this.randomNegative() * this.getRandomValue(CLOSE_FROM_EARTH, FURTHER_FROM_EARTH);
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

        return (this.getRandomValue(0, 1) > 0) ?
            1 :
            NEGATIF;
    }
}
