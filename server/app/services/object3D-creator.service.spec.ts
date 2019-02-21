import * as JsonScene from "../../../common/free-game-json-interface/JSONInterface/IScenesJSON";
import { ObjectGeometry } from "../../../common/free-game-json-interface/FreeGameCreatorInterface/free-game-enum";
import { expect } from "chai";
import { Object3DCreatorService } from "./object3D-creator.service";

describe("Object3DCreatorService", () => {
    let service: Object3DCreatorService;
    const SEGMENTS: number = 32;
    beforeEach(() => {
        service = new Object3DCreatorService();
    });

    // Test createCube
    it("should return an ICube object with the right type of geometry, defined attributes", () => {
        const cube: JsonScene.ICube = service.createCube();
        expect(cube.type).to.eql(ObjectGeometry.cube);
        expect(cube.color).to.not.be.undefined;
        expect(cube.sideLenght).to.not.be.undefined;
        expect(cube.position).to.not.be.empty;
        expect(cube.rotation).to.not.be.empty;
    });
    // Test createSphere
    it("should return an ISphere object with the right type of geometry, defined attributes", () => {
        const sphere: JsonScene.ISphere = service.createSphere();
        expect(sphere.type).to.eql(ObjectGeometry.sphere);
        expect(sphere.color).to.not.be.undefined;
        expect(sphere.radius).to.not.be.undefined;
        expect(sphere.widthSegments).to.eql(SEGMENTS);
        expect(sphere.heightSegments).to.eql(SEGMENTS);
        expect(sphere.position).to.not.be.empty;
        expect(sphere.rotation).to.not.be.empty;
    });
    // Test createCone
    it("should return an ICone object with the right type of geometry, defined attributes", () => {
        const cone: JsonScene.ICone = service.createCone();
        expect(cone.type).to.eql(ObjectGeometry.cone);
        expect(cone.color).to.not.be.undefined;
        expect(cone.radius).to.not.be.undefined;
        expect(cone.height).to.not.be.undefined;
        expect(cone.radialSegment).to.eql(SEGMENTS);
        expect(cone.position).to.not.be.empty;
        expect(cone.rotation).to.not.be.empty;
    });
    // Test createCylinder
    it("should return an ICylinder object with the right type of geometry, defined attributes", () => {
        const cyl: JsonScene.ICylinder = service.createCylinder();
        expect(cyl.type).to.eql(ObjectGeometry.cylinder);
        expect(cyl.color).to.not.be.undefined;
        expect(cyl.topRadius).to.not.be.undefined;
        expect(cyl.botRadius).to.not.be.undefined;
        expect(cyl.height).to.not.be.undefined;
        expect(cyl.radiusSegment).to.eql(SEGMENTS);
        expect(cyl.position).to.not.be.empty;
        expect(cyl.rotation).to.not.be.empty;
    });
    // Test createPyramid
    it("should return an IPyramid object with the right type of geometry, defined attributes", () => {
        const pyr: JsonScene.IPyramid = service.createPyramid();
        expect(pyr.type).to.eql(ObjectGeometry.pyramid);
        expect(pyr.color).to.not.be.undefined;
        expect(pyr.topRadius).to.eql(0);
        expect(pyr.botRadius).to.not.be.undefined;
        expect(pyr.height).to.not.be.undefined;
        expect(pyr.radiusSegment).to.eql(3);
        expect(pyr.heightSegment).to.eql(1);
        expect(pyr.position).to.not.be.empty;
        expect(pyr.rotation).to.not.be.empty;
    });
});