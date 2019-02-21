import { ModificationType, ObjectGeometry } from "../../../common/free-game-json-interface/FreeGameCreatorInterface/free-game-enum";
import { Object3DCreatorService } from "./object3D-creator.service";
import * as IObject from "../../../common/free-game-json-interface/JSONInterface/IScenesJSON";

export class FreeGameCreatorService {
    private object3DService: Object3DCreatorService;
    private obj3DToCreate: number;
    private objectTypes: ObjectGeometry[];
    private modificationTypes: ModificationType[];
    private objects: IObject.IJson3DObject[];
    private modifiedObjects: IObject.IJson3DObject[];

    private readonly MIN_DIST: number = 43;
    private readonly MAX_GAME_X: number = 300;
    private readonly MAX_GAME_Y: number = 300;
    private readonly MAX_GAME_Z: number = 300;

    public constructor(
        objectToCreate: number,
        objType: ObjectGeometry[],
        modType: ModificationType[],
    ) {
        this.object3DService = new Object3DCreatorService();
        this.obj3DToCreate = objectToCreate;
        this.objectTypes = objType;
        this.modificationTypes = modType;
        this.objects = [];
        this.modifiedObjects = [];
    }

    private getRandomValue(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    private handleCollision(
        object: IObject.IJson3DObject, list: IObject.IJson3DObject[]): IObject.IJson3DObject {
        let collision: boolean = true;
        let distance: number;
        const POWER: number = 2;
        enum coordinate { X, Y, Z };
        if (list.length !== 0) {
            while (collision) {
                for (const i of list) {
                    distance = Math.sqrt(
                        (Math.pow((i.position[coordinate.X] - object.position[coordinate.X]), POWER)) +
                        (Math.pow((i.position[coordinate.Y] - object.position[coordinate.Y]), POWER)) +
                        (Math.pow((i.position[coordinate.Z] - object.position[coordinate.Z]), POWER)) 
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

    public generate3DObject(): IObject.IJson3DObject {
        let randomObject: number;
        let createdObject: IObject.IJson3DObject;
        const maxTypeObject: number = 4;
        randomObject = this.getRandomValue(0, maxTypeObject);
        switch (this.objectTypes[randomObject]) {
            case ObjectGeometry.sphere: {
                createdObject = this.object3DService.createSphere();
                break; }
            case ObjectGeometry.cube: {
                createdObject = this.object3DService.createCube();
                break; }
            case ObjectGeometry.cone: {
                createdObject = this.object3DService.createCone();
                break; }
            case ObjectGeometry.cylinder: {
                createdObject = this.object3DService.createCylinder();
                break; }
            case ObjectGeometry.pyramid: {
                createdObject = this.object3DService.createPyramid();
                break; }
            default: {
                createdObject = { position: [], rotation: [], color: 0, type: ObjectGeometry.cube };
            }
        }
        return createdObject;
    }

    public generateIScenes(): void {

        let object: IObject.IJson3DObject;
        const PI: number = Math.PI;
        const FACTOR2: number = 2;
        const MAXROTATIONANGLE: number = PI * FACTOR2;
        for (let i: number = 0; i < this.obj3DToCreate; ++i) {
            object = this.generate3DObject();
            object.position = [
                this.getRandomValue(-this.MAX_GAME_X, this.MAX_GAME_X),
                this.getRandomValue(-this.MAX_GAME_Y, this.MAX_GAME_Y),
                this.getRandomValue(-this.MAX_GAME_Z, this.MAX_GAME_Z),
            ];
            object.rotation = [
                this.getRandomValue(0, MAXROTATIONANGLE),
                this.getRandomValue(0, MAXROTATIONANGLE),
                this.getRandomValue(0, MAXROTATIONANGLE),
            ];
            object = this.handleCollision(object, this.objects);
            this.objects.push(object);
        }
        this.generateDifferences();
    }

    private generateDifferences(): void {
        // DEEP COPY USING STRINGIFY AND PARSE, !!!!!!!!!!!!!!!
        this.modifiedObjects = JSON.parse(JSON.stringify(this.objects));
        const numberModifications: number = 7;
        const indexes: Set<number> = new Set();
        while (indexes.size !== numberModifications) {
            indexes.add(this.getRandomValue(0, this.modifiedObjects.length - 1));
        }
        this.randomDifference(indexes);
    }

    public randomDifference(table: Set<number>): void {
        const maxModificationType: number = this.modificationTypes.length - 1;
        const arrayIndexes: number[] = Array.from(table).sort().reverse();
        for (const index of arrayIndexes) {
            const randomModification: number = this.getRandomValue(0, maxModificationType);
            switch (this.modificationTypes[randomModification]) {
                case ModificationType.remove: {
                    this.modifiedObjects.splice(index, 1);
                    break;
                }
                case ModificationType.add: {
                    let object: IObject.IJson3DObject = this.generate3DObject();
                    object = this.handleCollision(object, this.modifiedObjects);
                    this.modifiedObjects.push(object);
                    break;
                }
                case ModificationType.changeColor: {
                    const mask: number = 0xFFFFFF;
                    this.modifiedObjects[index].color = (Math.random() * mask);
                    break;
                }
                default: {
                    break;
                }
            }
        }
    }

    public saveScenes(): void {
        // To implement according to JSON (Lets go MILEN!!!!)
    }
}