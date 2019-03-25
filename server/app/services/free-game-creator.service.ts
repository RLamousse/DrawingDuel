import {inject, injectable} from "inversify";
import {
    ModificationType,
    ObjectGeometry,
    Themes
} from "../../../common/free-game-json-interface/FreeGameCreatorInterface/free-game-enum";
import * as IObject from "../../../common/free-game-json-interface/JSONInterface/IScenesJSON";
import Types from "../types";
import {Object3DCreatorService} from "./object3D-creator.service";

@injectable()
export class FreeGameCreatorService {

    public constructor(@inject(Types.Object3DCreatorService) private object3DCreatorService: Object3DCreatorService) {}

    private readonly MAX_TYPE_OBJECTS: number = 4;
    private readonly MIN_DIST: number = 150;
    private readonly MAX_GAME_X: number = 300;
    private readonly MAX_GAME_Y: number = 300;
    private readonly MAX_GAME_Z: number = 300;

    private getRandomValue(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    private handleCollision(
        object: IObject.IJson3DObject, list: IObject.IJson3DObject[]): IObject.IJson3DObject {
        let collision: boolean = true;
        let distance: number;
        const POWER: number = 2;
        enum coordinate { X, Y, Z }
        if (list.length !== 0) {
            while (collision) {
                for (const i of list) {
                    distance = Math.sqrt(
                        (Math.pow((i.position[coordinate.X] - object.position[coordinate.X]), POWER)) +
                        (Math.pow((i.position[coordinate.Y] - object.position[coordinate.Y]), POWER)) +
                        (Math.pow((i.position[coordinate.Z] - object.position[coordinate.Z]), POWER)),
                    );
                    if (distance < this.MIN_DIST) {
                        object.position = [
                            this.getRandomValue(-this.MAX_GAME_X, this.MAX_GAME_X),
                            this.getRandomValue(-this.MAX_GAME_Y, this.MAX_GAME_Y),
                            this.getRandomValue(-this.MAX_GAME_Z, this.MAX_GAME_Z),
                        ];
                        collision = true;
                        break;
                    } else { collision = false; }
                }
            }
        }

        return object;
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
        for (let i: number = 0; i < obj3DToCreate; ++i) {
            let object: IObject.IJson3DObject;
            (sceneType === Themes.Geometry) ?
                object = this.generate3DObject() : object = this.object3DCreatorService.createThematicObject();
            object.position = [
                this.getRandomValue(-this.MAX_GAME_X, this.MAX_GAME_X),
                this.getRandomValue(-this.MAX_GAME_Y, this.MAX_GAME_Y),
                this.getRandomValue(-this.MAX_GAME_Z, this.MAX_GAME_Z),
            ];
            object = this.handleCollision(object, objects);
            objects.push(object);
        }
        const modifiedObjects: IObject.IJson3DObject[] = JSON.parse(JSON.stringify(objects));
        this.generateDifferences(modificationTypes, modifiedObjects);

        return {originalObjects: objects, modifiedObjects: modifiedObjects};
    }

    private generateDifferences(modificationTypes: ModificationType[], modifiedObjects: IObject.IJson3DObject[]): void {
        const MOD_COUNT: number = 7;
        const INDEXES: Set<number> = new Set();
        while (INDEXES.size !== MOD_COUNT) {
            INDEXES.add(this.getRandomValue(0, modifiedObjects.length - 1));
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
                    (modifiedObjects[0].gameType === Themes.Geometry) ?
                        modifiedObjects[index].color = (Math.random() * MASK) :
                        modifiedObjects[index].texture = "common/image/texture.jpg";
                    break;
                }
                default: {
                    break;
                }
            }
        }
    }
}
