// tslint:disable:typedef
import {expect} from "chai";
import {
    ModificationType,
    ObjectGeometry,
    Themes
} from "../../../common/free-game-json-interface/FreeGameCreatorInterface/free-game-enum";
import {IJson3DObject, IScenesJSON} from "../../../common/free-game-json-interface/JSONInterface/IScenesJSON";
import {distance, getOrigin3D} from "../../../common/model/point";
import {container} from "../inversify.config";
import types from "../types";
import {FreeGameCreatorService} from "./free-game-creator.service";
import {Object3DCreatorService} from "./object3D-creator.service";

const MASK: number = 0xFFFFFF;
const mockedBaseObject: IJson3DObject = {
    type: ObjectGeometry.cube,
    position: getOrigin3D(),
    rotation: getOrigin3D(),
    color: Math.random() * MASK,
    scale: 1,
    gameType: Themes.Geometry,
};

const mockedAstroObject: IJson3DObject = {
    type: ObjectGeometry.astronaut,
    position: getOrigin3D(),
    rotation: getOrigin3D(),
    color: Math.random() * MASK,
    scale: 1,
    gameType: Themes.Space,
};

const mockedAstroObject2: IJson3DObject = {
    type: ObjectGeometry.astronaut,
    position: getOrigin3D(),
    rotation: getOrigin3D(),
    color: Math.random() * MASK,
    scale: 1,
    gameType: Themes.Space,
};

const objects: IJson3DObject[] = [];

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
    const freeGameCreatorService: FreeGameCreatorService = new FreeGameCreatorService(new Object3DCreatorService());
    beforeEach(() => {
        container.rebind(types.Object3DCreatorService).toConstantValue(mockedObject3DCreator);
    });

    // Test generateIScenes
    it("should create 10 3d elements", () => {
        const modTypes: ModificationType[] = [];
        const objNumber: number = 10;
        expect(freeGameCreatorService.generateIScenes(objNumber, modTypes, Themes.Geometry).originalObjects.length).to.eql(objNumber);
    });

    // Test handleCollision
    it("should only have objects with a distance greater than 43", () => {
        const modTypes: ModificationType[] = [];
        const objNumber: number = 10;
        const MAX_DIST: number = 43;
        const response: IScenesJSON = freeGameCreatorService.generateIScenes(objNumber, modTypes, Themes.Geometry);
        expect(response.originalObjects.length).to.eql(objNumber);
        for (const i of response.originalObjects) {
            for (const j of response.originalObjects) {
                if (i !== j) {
                    expect(distance(i.position, j.position)).to.be.greaterThan(MAX_DIST);
                }
            }
        }
    });

    // Test randomDifference
    it("should remove 7 objects from original objects table", () => {
        const modTypes: ModificationType[] = [ModificationType.remove];
        const objNumber: number = 30;
        const DIFF: number = 7;
        const response: IScenesJSON = freeGameCreatorService.generateIScenes(objNumber, modTypes, Themes.Geometry);
        expect(response.originalObjects.length).to.eql(objNumber);
        expect(response.modifiedObjects.length).to.eql(objNumber - DIFF);
    });

    it("should add 7 objects from original objects table", () => {
        const modTypes: ModificationType[] = [ModificationType.add];
        const objNumber: number = 30;
        const DIFF: number = 7;
        const response: IScenesJSON = freeGameCreatorService.generateIScenes(objNumber, modTypes, Themes.Geometry);
        expect(response.originalObjects.length).to.eql(objNumber);
        expect(response.modifiedObjects.length).to.eql(objNumber + DIFF);
    });

    it("should have 7 objects that don't have their original color", () => {
        const modTypes: ModificationType[] = [ModificationType.changeColor];
        const objNumber: number = 30;
        const DIFF: number = 7;
        const response: IScenesJSON = freeGameCreatorService.generateIScenes(objNumber, modTypes, Themes.Geometry);
        expect(response.originalObjects.length).to.eql(response.modifiedObjects.length);
        let colDiffCounter: number = 0;
        for (let i: number = 0; i < objNumber; ++i) {
            if (response.originalObjects[i].color !== response.modifiedObjects[i].color) {
                colDiffCounter++;
            }
        }
        expect(colDiffCounter).to.eql(DIFF);
    });

    // test render earth
    it("should return a valid earth 3D object", () => {
        const earth: IJson3DObject = freeGameCreatorService["renderEarth"]();

        expect(earth.position).to.be.eql(getOrigin3D());
        expect(earth.type).to.be.eql(ObjectGeometry.earth);
    });

    // test setAstronautCloseFromEarth
    it("should go through the collision and set a new position and scale", () => {
        const object: IJson3DObject = mockedAstroObject;
        objects.push(mockedAstroObject2);
        freeGameCreatorService["setAstronautCloseFromEarth"](object, objects);
        const TEST: number = 4;
        expect(object.scale).to.be.eql(TEST);
        const FURTHER_FROM_EARTH: number = 71;
        expect(Math.abs(object.position.x)).to.be.lessThan(FURTHER_FROM_EARTH);
        expect(Math.abs(object.position.y)).to.be.lessThan(FURTHER_FROM_EARTH);
        expect(Math.abs(object.position.z)).to.be.lessThan(FURTHER_FROM_EARTH);
    });

    // test randomNegative
    it("should return 1 or -1", () => {

        return expect(Math.abs(freeGameCreatorService["randomNegative"]()))
            .to.be.eql(1);
    });
});
