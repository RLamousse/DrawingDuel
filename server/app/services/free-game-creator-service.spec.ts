// tslint:disable:typedef
import { expect } from "chai";
import { ModificationType, ObjectGeometry } from "../../../common/free-game-json-interface/FreeGameCreatorInterface/free-game-enum";
import * as IObject from "../../../common/free-game-json-interface/JSONInterface/IScenesJSON";
import { container } from "../inversify.config";
import types from "../types";
import { FreeGameCreatorService } from "./free-game-creator.service";

const MASK: number = 0xFFFFFF;
const mockedBaseObject: IObject.IJson3DObject = {
    type: ObjectGeometry.cube,
    position: [0, 0, 0],
    rotation: [0, 0, 0],
    color: Math.random() * MASK,
};

const mockedObject3DCreator = {
    createCube: () => {
        mockedBaseObject.type = ObjectGeometry.cube;

        return { mockedBaseObject };
    },
    createSphere: () => {
        mockedBaseObject.type = ObjectGeometry.sphere;

        return { mockedBaseObject };
    },
    createCone: () => {
        mockedBaseObject.type = ObjectGeometry.cone;

        return { mockedBaseObject };
    },
    createCylinder: () => {
        mockedBaseObject.type = ObjectGeometry.cylinder;

        return { mockedBaseObject };
    },
    createPyramid: () => {
        mockedBaseObject.type = ObjectGeometry.pyramid;

        return { mockedBaseObject };
    },
};

describe("FreeGameCreatorService", () => {
    let freeGameCreatorService: FreeGameCreatorService;
    beforeEach(() => {
        container.rebind(types.Object3DCreatorService).toConstantValue(mockedObject3DCreator);
    });

    // Test generateIScenes
    it("should only create default object (color = 0) and have 100 objects", () => {
        const obj: ObjectGeometry[] = [];
        const modTypes: ModificationType[] = [];
        const objNumber: number = 100;
        freeGameCreatorService = new FreeGameCreatorService(objNumber, obj, modTypes);
        freeGameCreatorService.generateIScenes();
        expect(freeGameCreatorService.objects.length).to.eql(objNumber);
        for (const i of freeGameCreatorService.objects) {
            expect(i.color).to.eql(0);
        }
    });

    it("should only create spheres or cone geometry, whith 20 elements", () => {
        const obj: ObjectGeometry[] = [ObjectGeometry.cone, ObjectGeometry.sphere];
        const modTypes: ModificationType[] = [];
        const objNumber: number = 20;
        freeGameCreatorService = new FreeGameCreatorService(objNumber, obj, modTypes);
        freeGameCreatorService.generateIScenes();
        expect(freeGameCreatorService.objects.length).to.eql(objNumber);
        for (const i of freeGameCreatorService.objects) {
            expect(
                i.type === ObjectGeometry.cone || i.type === ObjectGeometry.sphere,
            ).to.eql(true);
        }
    });
    it("should only create cube,cylinder or pyramid geometry, whith 200 elements", () => {
        const obj: ObjectGeometry[] = [ObjectGeometry.cube, ObjectGeometry.cylinder, ObjectGeometry.pyramid];
        const modTypes: ModificationType[] = [];
        const objNumber: number = 200;
        freeGameCreatorService = new FreeGameCreatorService(objNumber, obj, modTypes);
        freeGameCreatorService.generateIScenes();
        expect(freeGameCreatorService.objects.length).to.eql(objNumber);
        for (const i of freeGameCreatorService.objects) {
            expect(
                i.type === ObjectGeometry.cube ||
                i.type === ObjectGeometry.cylinder ||
                i.type === ObjectGeometry.pyramid,
            ).to.eql(true);
        }
    });
    // Test handleCollision
    it("should only have objects with a distance grater than 43", () => {
        const obj: ObjectGeometry[] = [ObjectGeometry.cube, ObjectGeometry.cylinder, ObjectGeometry.pyramid];
        const modTypes: ModificationType[] = [];
        const objNumber: number = 100;
        const MAX_DIST: number = 43;
        const POWER: number = 2;
        freeGameCreatorService = new FreeGameCreatorService(objNumber, obj, modTypes);
        freeGameCreatorService.generateIScenes();
        expect(freeGameCreatorService.objects.length).to.eql(objNumber);
        let distance: number;
        enum coordinate { X, Y, Z }
        for (const i of freeGameCreatorService.objects) {
            for (const j of freeGameCreatorService.objects) {
                if (i !== j) {
                    distance = Math.sqrt(
                        (Math.pow((i.position[coordinate.X] - j.position[coordinate.X]), POWER)) +
                        (Math.pow((i.position[coordinate.Y] - j.position[coordinate.Y]), POWER)) +
                        (Math.pow((i.position[coordinate.Z] - j.position[coordinate.Z]), POWER)),
                    );
                    expect(distance).to.be.greaterThan(MAX_DIST);
                }
            }
        }
    });

    // Test randomDifference
    it("should remove 7 objects from original table", () => {
        const obj: ObjectGeometry[] = [ObjectGeometry.cube, ObjectGeometry.cylinder, ObjectGeometry.pyramid];
        const modTypes: ModificationType[] = [ModificationType.remove];
        const objNumber: number = 30;
        const DIFF: number = 7;
        freeGameCreatorService = new FreeGameCreatorService(objNumber, obj, modTypes);
        freeGameCreatorService.generateIScenes();
        expect(freeGameCreatorService.objects.length).to.eql(objNumber);
        expect(freeGameCreatorService.modifiedObjects.length).to.eql(objNumber - DIFF);
    });

    it("should add 7 objects from original table", () => {
        const obj: ObjectGeometry[] = [ObjectGeometry.cube, ObjectGeometry.cylinder, ObjectGeometry.pyramid];
        const modTypes: ModificationType[] = [ModificationType.add];
        const objNumber: number = 30;
        const DIFF: number = 7;
        freeGameCreatorService = new FreeGameCreatorService(objNumber, obj, modTypes);
        freeGameCreatorService.generateIScenes();
        expect(freeGameCreatorService.objects.length).to.eql(objNumber);
        expect(freeGameCreatorService.modifiedObjects.length).to.eql(objNumber + DIFF);
    });

    it("should have 7 objects that don't have their original color", () => {
        const obj: ObjectGeometry[] = [ObjectGeometry.cube, ObjectGeometry.cylinder, ObjectGeometry.pyramid];
        const modTypes: ModificationType[] = [ModificationType.changeColor];
        const objNumber: number = 30;
        const DIFF: number = 7;
        freeGameCreatorService = new FreeGameCreatorService(objNumber, obj, modTypes);
        freeGameCreatorService.generateIScenes();
        expect(freeGameCreatorService.objects.length).to.eql(freeGameCreatorService.modifiedObjects.length);
        let colDiffCounter: number = 0;
        for (let i: number = 0; i < objNumber; ++i) {
            if (freeGameCreatorService.objects[i].color !== freeGameCreatorService.modifiedObjects[i].color) {
                colDiffCounter++;
            }
        }
        expect(colDiffCounter).to.eql(DIFF);
    });
});
