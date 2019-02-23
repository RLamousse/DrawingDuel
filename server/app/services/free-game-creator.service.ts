import { ModificationType, ObjectGeometry } from "../../../common/free-game-json-interface/FreeGameCreatorInterface/free-game-enum";
import * as IObject from "../../../common/free-game-json-interface/JSONInterface/IScenesJSON";
import { Object3DCreatorService } from "./object3D-creator.service";

export class FreeGameCreatorService {
    private readonly MAX_TYPE_OBJECTS: number = 5;
    private object3DService: Object3DCreatorService;
    private obj3DToCreate: number;
    private modificationTypes: ModificationType[];
    public objects: IObject.IJson3DObject[];
    public modifiedObjects: IObject.IJson3DObject[];

    private readonly MIN_DIST: number = 43;
    private readonly MAX_GAME_X: number = 300;
    private readonly MAX_GAME_Y: number = 300;
    private readonly MAX_GAME_Z: number = 300;

    public constructor(
        objectToCreate: number,
        modType: ModificationType[],
    ) {
        this.object3DService = new Object3DCreatorService();
        this.obj3DToCreate = objectToCreate;
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

    public generate3DObject(): IObject.IJson3DObject {
        let randomObject: number;
        let createdObject: IObject.IJson3DObject;
        randomObject = this.getRandomValue(0, this.MAX_TYPE_OBJECTS);
        switch (randomObject) {
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
        this.modifiedObjects = JSON.parse(JSON.stringify(this.objects));
        const MOD_COUNT: number = 7;
        const INDEXES: Set<number> = new Set();
        while (INDEXES.size !== MOD_COUNT) {
            INDEXES.add(this.getRandomValue(0, this.modifiedObjects.length - 1));
        }
        this.randomDifference(INDEXES);
    }

    private randomDifference(table: Set<number>): void {
        const MAX_MOD_TYPE: number = this.modificationTypes.length - 1;
        const ARRAY_INDEXES: number[] = Array.from(table).sort().reverse();
        let randomModifications: number;
        for (const index of ARRAY_INDEXES) {
            randomModifications = this.getRandomValue(0, MAX_MOD_TYPE);
            switch (this.modificationTypes[randomModifications]) {
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
                    const MASK: number = 0xFFFFFF;
                    this.modifiedObjects[index].color = (Math.random() * MASK);
                    break;
                }
                default: {
                    break;
                }
            }
        }
    }
}
