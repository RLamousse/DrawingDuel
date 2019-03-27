import { expect } from "chai";
import {
    IIndexObj,
    ObjectGeometry
} from "../../../common/free-game-json-interface/FreeGameCreatorInterface/free-game-enum";
import * as JsonScene from "../../../common/free-game-json-interface/JSONInterface/IScenesJSON";
import { Object3DCreatorService } from "./object3D-creator.service";

describe("Object3DCreatorService", () => {
    let service: Object3DCreatorService;
    const SEGMENTS: number = 32;
    const TABLE_LENGHT: number = 3;
    beforeEach(() => {
        service = new Object3DCreatorService();
    });

    // Test createCube
    it("should return an ICube object with the right type of geometry, defined attributes", () => {
        const cube: JsonScene.ICube = service.createCube();
        expect(cube.type).to.eql(ObjectGeometry.cube);
        expect(cube.color).to.not.eql(undefined);
        expect(cube.sideLenght).to.not.eql(undefined);
        expect(cube.position.length).to.eql(TABLE_LENGHT);
        expect(cube.rotation.length).to.eql(TABLE_LENGHT);
    });
    // Test createSphere
    it("should return an ISphere object with the right type of geometry, defined attributes", () => {
        const sphere: JsonScene.ISphere = service.createSphere();
        expect(sphere.type).to.eql(ObjectGeometry.sphere);
        expect(sphere.color).to.not.eql(undefined);
        expect(sphere.radius).to.not.eql(undefined);
        expect(sphere.widthSegments).to.eql(SEGMENTS);
        expect(sphere.heightSegments).to.eql(SEGMENTS);
        expect(sphere.position.length).to.eql(TABLE_LENGHT);
        expect(sphere.rotation.length).to.eql(TABLE_LENGHT);
    });
    // Test createCone
    it("should return an ICone object with the right type of geometry, defined attributes", () => {
        const cone: JsonScene.ICone = service.createCone();
        expect(cone.type).to.eql(ObjectGeometry.cone);
        expect(cone.color).to.not.eql(undefined);
        expect(cone.radius).to.not.eql(undefined);
        expect(cone.height).to.not.eql(undefined);
        expect(cone.radialSegment).to.eql(SEGMENTS);
        expect(cone.position.length).to.eql(TABLE_LENGHT);
        expect(cone.rotation.length).to.eql(TABLE_LENGHT);
    });
    // Test createCylinder
    it("should return an ICylinder object with the right type of geometry, defined attributes", () => {
        const cyl: JsonScene.ICylinder = service.createCylinder();
        expect(cyl.type).to.eql(ObjectGeometry.cylinder);
        expect(cyl.color).to.not.eql(undefined);
        expect(cyl.topRadius).to.not.eql(undefined);
        expect(cyl.botRadius).to.not.eql(undefined);
        expect(cyl.height).to.not.eql(undefined);
        expect(cyl.radiusSegment).to.eql(SEGMENTS);
        expect(cyl.position.length).to.eql(TABLE_LENGHT);
        expect(cyl.rotation.length).to.eql(TABLE_LENGHT);
    });
    // Test createPyramid
    it("should return an IPyramid object with the right type of geometry, defined attributes", () => {
        const pyr: JsonScene.IPyramid = service.createPyramid();
        const RAD_SEG: number = 3;
        expect(pyr.type).to.eql(ObjectGeometry.pyramid);
        expect(pyr.color).to.not.eql(undefined);
        expect(pyr.topRadius).to.eql(0);
        expect(pyr.botRadius).to.not.eql(undefined);
        expect(pyr.height).to.not.eql(undefined);
        expect(pyr.radiusSegment).to.eql(RAD_SEG);
        expect(pyr.heightSegment).to.eql(1);
        expect(pyr.position.length).to.eql(TABLE_LENGHT);
        expect(pyr.rotation.length).to.eql(TABLE_LENGHT);
    });

    // test randomTypeByProba
    it("should return an IIndexObj", () => {
        const indexObj: IIndexObj = service["randomTypeByProba"]();
        expect(typeof indexObj.index).to.not.eql(undefined);
        expect(indexObj).to.not.eql(undefined);
    });

    // test createThematiqueObject
    it("should return an JsonScene.IJson3DObject", () => {
        return expect(service.createThematicObject()).to.not.eql(undefined);
    });
});
