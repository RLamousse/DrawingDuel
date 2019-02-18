// tslint:disable:no-magic-numbers
import { expect } from "chai";
import * as fs from "fs";
import {BitmapFactory} from "../images/bitmap/bitmap-factory";
import {
    ARGUMENT_ERROR_MESSAGE,
    DifferenceEvaluatorService,
    EMPTY_ARRAY_ERROR_MESSAGE
} from "./difference-evaluator.service";
import THREE = require("three");

const DIFFERENCE_EVALUATOR_SERVICE: DifferenceEvaluatorService = new DifferenceEvaluatorService();
const TEST_FILES: string[] = ["0-zones-test.bmp", "1-zone_test.bmp", "6-zones-test.bmp",
                              "7-zones-test.bmp", "8-zones-test.bmp", "16-zones-test.bmp"];

const TEST_FILE_ARRAYS: number[][][] = [];

describe("Difference evaluator service", () => {

    describe("Simple game difference evaluator", () => {
        before(() => {
            for (const FILE of TEST_FILES) {
                TEST_FILE_ARRAYS.push(BitmapFactory.createBitmap(FILE, fs.readFileSync("./test/test_difference_evaluator/" + FILE)).pixels);
            }
        });

        it("Should calculate 0 zones", () => {
            expect(DIFFERENCE_EVALUATOR_SERVICE.getSimpleNDifferences(TEST_FILE_ARRAYS[0]).length)
                .to.equal(0);
        });

        it("Should calculate 1 zone", () => {
            expect(DIFFERENCE_EVALUATOR_SERVICE.getSimpleNDifferences(TEST_FILE_ARRAYS[1]).length)
                .to.equal(1);
        });

        it("Should calculate 6 zones", () => {
            expect(DIFFERENCE_EVALUATOR_SERVICE.getSimpleNDifferences(TEST_FILE_ARRAYS[2]).length)
                .to.equal(6);
        });

        it("Should calculate 7 zones", () => {
            expect(DIFFERENCE_EVALUATOR_SERVICE.getSimpleNDifferences(TEST_FILE_ARRAYS[3]).length)
                .to.equal(7);
        });

        it("Should calculate 8 zones", () => {
            expect(DIFFERENCE_EVALUATOR_SERVICE.getSimpleNDifferences(TEST_FILE_ARRAYS[4]).length)
                .to.equal(8);
        });

        it("Should calculate 16 zone from an extremely random drawing", () => {
            expect(DIFFERENCE_EVALUATOR_SERVICE.getSimpleNDifferences(TEST_FILE_ARRAYS[5]).length)
                .to.equal(16);
        });

        it("Should throw a format error if the input is not an array(string)", () => {
            // @ts-ignore
            expect(() => DIFFERENCE_EVALUATOR_SERVICE.getSimpleNDifferences("abs"))
                .to.throw(ARGUMENT_ERROR_MESSAGE);
        });

        it("Should throw a format error if the input is not an array(undefined)", () => {
            // @ts-ignore
            expect(() => DIFFERENCE_EVALUATOR_SERVICE.getSimpleNDifferences(null))
                .to.throw(ARGUMENT_ERROR_MESSAGE);
        });

        it("Should throw a format error if the input is not an array of numbers(strings)", () => {
            // @ts-ignore
            expect(() => DIFFERENCE_EVALUATOR_SERVICE.getSimpleNDifferences([[""]]))
                .to.throw(ARGUMENT_ERROR_MESSAGE);
        });

        it("Should throw a format error if the input is not an array of numbers(undefined)", () => {
            // @ts-ignore
            expect(() => DIFFERENCE_EVALUATOR_SERVICE.getSimpleNDifferences([[null]]))
                .to.throw(ARGUMENT_ERROR_MESSAGE);
        });

        it("Should throw an empty array error if the input is an empty array", () => {
            expect(() => DIFFERENCE_EVALUATOR_SERVICE.getSimpleNDifferences([]))
                .to.throw(EMPTY_ARRAY_ERROR_MESSAGE);
        });

        it("Should throw an empty array error if the input is an array of empty arrays", () => {
            expect(() => DIFFERENCE_EVALUATOR_SERVICE.getSimpleNDifferences([[]]))
                .to.throw(EMPTY_ARRAY_ERROR_MESSAGE);
        });
    });

    describe("Free game difference evaluator", () => {

        const TEST_GEOMETRY = new THREE.BoxBufferGeometry( 1, 1, 1 );

        it("Should throw an argument error if the inputs are not arrays", () => {
            // @ts-ignore
            expect(() => DIFFERENCE_EVALUATOR_SERVICE.getFreeNDifferences(null, null))
                .to.throw(ARGUMENT_ERROR_MESSAGE);
        });

        it("Should throw an argument error if one of the inputs is not an array(left)", () => {
            // @ts-ignore
            expect(() => DIFFERENCE_EVALUATOR_SERVICE.getFreeNDifferences(null, []))
                .to.throw(ARGUMENT_ERROR_MESSAGE);
        });

        it("Should throw an argument error if one of the inputs is not an array(right)", () => {
            // @ts-ignore
            expect(() => DIFFERENCE_EVALUATOR_SERVICE.getFreeNDifferences([], null))
                .to.throw(ARGUMENT_ERROR_MESSAGE);
        });

        it("Should throw an argument error if the input arrays contain other elements than Object3D", () => {
            // @ts-ignore
            expect(() => DIFFERENCE_EVALUATOR_SERVICE.getFreeNDifferences(["a", "b", "c"], [1, 2, 3]))
                .to.throw(ARGUMENT_ERROR_MESSAGE);
        });

        it("Should throw an argument error if one of the input arrays contains other elements than Object3D(left)", () => {
            // @ts-ignore
            expect(() => DIFFERENCE_EVALUATOR_SERVICE.getFreeNDifferences(["a", "b", "c", 1, 2, 3], []))
                .to.throw(ARGUMENT_ERROR_MESSAGE);
        });

        it("Should throw an argument error if one of the input arrays contains other elements than Object3D(right)", () => {
            // @ts-ignore
            expect(() => DIFFERENCE_EVALUATOR_SERVICE.getFreeNDifferences([], ["a", "b", "c", 1, 2, 3]))
                .to.throw(ARGUMENT_ERROR_MESSAGE);
        });

        it("Should calculate 0 differences with two empty arrays", () => {
            expect(DIFFERENCE_EVALUATOR_SERVICE.getFreeNDifferences([], []))
                .to.equal(0);
        });

        it("Should calculate 0 differences with two arrays with the same instance of an object", () => {
            const testObj: THREE.Mesh = new THREE.Mesh();
            expect(DIFFERENCE_EVALUATOR_SERVICE.getFreeNDifferences([testObj], [testObj]))
                .to.equal(0);
        });

        it("Should calculate 0 differences with two arrays with thow distinct objects with identical attributes", () => {
            const material1: THREE.Material = new THREE.MeshPhongMaterial( { color: 0xD02120 } );
            const material2: THREE.Material = new THREE.MeshPhongMaterial( { color: 0xD02120 } );
            const testObj1: THREE.Mesh = new THREE.Mesh(TEST_GEOMETRY, material1);
            const testObj2: THREE.Mesh = new THREE.Mesh(TEST_GEOMETRY, material2);
            expect(DIFFERENCE_EVALUATOR_SERVICE.getFreeNDifferences([testObj1], [testObj2]))
                .to.equal(0);
        });

        it("Should calculate 1 difference if two objects at the same position have dfferent color", () => {
            const material1: THREE.Material = new THREE.MeshPhongMaterial( { color: 0xD02120 } );
            const material2: THREE.Material = new THREE.MeshPhongMaterial( { color: 0xD02121 } );
            const testObj1: THREE.Mesh = new THREE.Mesh(TEST_GEOMETRY, material1);
            const testObj2: THREE.Mesh = new THREE.Mesh(TEST_GEOMETRY, material2);
            expect(DIFFERENCE_EVALUATOR_SERVICE.getFreeNDifferences([testObj1], [testObj2]))
                .to.equal(1);
        });

        it("Should calculate 1 difference when two objects at the same position have different type of materials(Material[] and Material)", () => {
            const material1: THREE.Material[] = [new THREE.MeshPhongMaterial()];
            const material2: THREE.Material = new THREE.MeshPhongMaterial();
            const testObj1: THREE.Mesh = new THREE.Mesh(TEST_GEOMETRY, material1);
            const testObj2: THREE.Mesh = new THREE.Mesh(TEST_GEOMETRY, material2);
            expect(DIFFERENCE_EVALUATOR_SERVICE.getFreeNDifferences([testObj1], [testObj2]))
                .to.equal(1);
        });

        it("Should calculate 1 difference when two objects at the same position have different type of materials(Material and Material[])", () => {
            const material1: THREE.Material = new THREE.MeshPhongMaterial();
            const material2: THREE.Material[] = [new THREE.MeshPhongMaterial()];
            const testObj1: THREE.Mesh = new THREE.Mesh(TEST_GEOMETRY, material1);
            const testObj2: THREE.Mesh = new THREE.Mesh(TEST_GEOMETRY, material2);
            expect(DIFFERENCE_EVALUATOR_SERVICE.getFreeNDifferences([testObj1], [testObj2]))
                .to.equal(1);
        });

        it("Should calculate 1 difference when two objects at the same position have different number of materials", () => {
            const material1: THREE.Material[] = [new THREE.MeshPhongMaterial(), new THREE.MeshPhongMaterial()];
            const material2: THREE.Material[] = [new THREE.MeshPhongMaterial()];
            const testObj1: THREE.Mesh = new THREE.Mesh(TEST_GEOMETRY, material1);
            const testObj2: THREE.Mesh = new THREE.Mesh(TEST_GEOMETRY, material2);
            expect(DIFFERENCE_EVALUATOR_SERVICE.getFreeNDifferences([testObj1], [testObj2]))
                .to.equal(1);
        });

        it("Should calculate 0 differences when two objects at the same position have the same colors in an array", () => {
            const material1: THREE.Material[] = [new THREE.MeshPhongMaterial({ color: 0xD02120 })];
            const material2: THREE.Material[] = [new THREE.MeshPhongMaterial({ color: 0xD02120 })];
            const testObj1: THREE.Mesh = new THREE.Mesh(TEST_GEOMETRY, material1);
            const testObj2: THREE.Mesh = new THREE.Mesh(TEST_GEOMETRY, material2);
            expect(DIFFERENCE_EVALUATOR_SERVICE.getFreeNDifferences([testObj1], [testObj2]))
                .to.equal(0);
        });

        it("Should calculate 1 difference when two objects at the same position have the different colors in an array", () => {
            const material1: THREE.Material[] = [new THREE.MeshPhongMaterial({ color: 0xD02120 })];
            const material2: THREE.Material[] = [new THREE.MeshPhongMaterial({ color: 0xD02121 })];
            const testObj1: THREE.Mesh = new THREE.Mesh(TEST_GEOMETRY, material1);
            const testObj2: THREE.Mesh = new THREE.Mesh(TEST_GEOMETRY, material2);
            expect(DIFFERENCE_EVALUATOR_SERVICE.getFreeNDifferences([testObj1], [testObj2]))
                .to.equal(1);
        });

        it("Should calculate 1 difference when two objects at the same position have the different colors in an array", () => {
            const material1: THREE.Material[] = [new THREE.MeshPhongMaterial({ color: 0xD02120 })];
            const material2: THREE.Material[] = [new THREE.MeshPhongMaterial({ color: 0xD02121 })];
            const testObj1: THREE.Mesh = new THREE.Mesh(TEST_GEOMETRY, material1);
            const testObj2: THREE.Mesh = new THREE.Mesh(TEST_GEOMETRY, material2);
            expect(DIFFERENCE_EVALUATOR_SERVICE.getFreeNDifferences([testObj1], [testObj2]))
                .to.equal(1);
        });

        it("Should calculate 1 difference when an object is only present in the original scene", () => {
            const material: THREE.Material = new THREE.MeshPhongMaterial( { color: 0xD02120 } );
            const testObj: THREE.Mesh = new THREE.Mesh(TEST_GEOMETRY, material);
            expect(DIFFERENCE_EVALUATOR_SERVICE.getFreeNDifferences([testObj], []))
                .to.equal(1);
        });

        it("Should calculate 1 difference when an object is only present in the modified scene", () => {
            const material: THREE.Material = new THREE.MeshPhongMaterial( { color: 0xD02120 } );
            const testObj: THREE.Mesh = new THREE.Mesh(TEST_GEOMETRY, material);
            expect(DIFFERENCE_EVALUATOR_SERVICE.getFreeNDifferences([], [testObj]))
                .to.equal(1);
        });

        it("Should calculate 2 differences when two objects have different positions", () => {
            const material: THREE.Material = new THREE.MeshPhongMaterial({ color: 0xD02120 });
            const testObj1: THREE.Mesh = new THREE.Mesh(TEST_GEOMETRY, material);
            const testObj2: THREE.Mesh = new THREE.Mesh(TEST_GEOMETRY, material);
            testObj2.translateX(1);
            expect(DIFFERENCE_EVALUATOR_SERVICE.getFreeNDifferences([testObj1], [testObj2]))
                .to.equal(2);
        });

        it("Should calculate 2 differences when two objects have different positions and other identical objects", () => {
            const material: THREE.Material = new THREE.MeshPhongMaterial({ color: 0xD02120 });
            const testObj1: THREE.Mesh = new THREE.Mesh(TEST_GEOMETRY, material);
            const testObj2: THREE.Mesh = new THREE.Mesh(TEST_GEOMETRY, material);
            const testObj3: THREE.Mesh = new THREE.Mesh(TEST_GEOMETRY, material);
            testObj2.translateX(1);
            testObj3.translateX(2);
            expect(DIFFERENCE_EVALUATOR_SERVICE.getFreeNDifferences([testObj1, testObj2], [testObj1, testObj3]))
                .to.equal(2);
        });

        it("Should calculate 5 differences with a complex scene", () => {
            const material1: THREE.Material = new THREE.MeshPhongMaterial({ color: 0xD02120 });
            const material2: THREE.Material = new THREE.MeshPhongMaterial({ color: 0xD02121 });
            const testObj1: THREE.Mesh = new THREE.Mesh(TEST_GEOMETRY, material1);
            const testObj2: THREE.Mesh = new THREE.Mesh(TEST_GEOMETRY, material1);
            const testObj3: THREE.Mesh = new THREE.Mesh(TEST_GEOMETRY, material1);
            const testObj4: THREE.Mesh = new THREE.Mesh(TEST_GEOMETRY, material1);
            const testObj5: THREE.Mesh = new THREE.Mesh(TEST_GEOMETRY, material2);
            const testObj6: THREE.Mesh = new THREE.Mesh(TEST_GEOMETRY, [material1, material1]);
            const testObj7: THREE.Mesh = new THREE.Mesh(TEST_GEOMETRY, [material1, material2]);
            const testObj8: THREE.Mesh = new THREE.Mesh(TEST_GEOMETRY, material1);
            const testObj9: THREE.Mesh = new THREE.Mesh(TEST_GEOMETRY, material1);
            const testObj10: THREE.Mesh = new THREE.Mesh(TEST_GEOMETRY, material1);
            testObj2.translateX(1);
            testObj3.translateX(1);
            testObj4.translateX(2);
            testObj5.translateX(2);
            testObj6.translateX(3);
            testObj7.translateX(3);
            testObj8.translateX(4);
            testObj9.translateX(5);
            expect(DIFFERENCE_EVALUATOR_SERVICE.getFreeNDifferences([testObj1, testObj4, testObj2, testObj6, testObj8],
                                                                   [testObj3, testObj7, testObj9, testObj5, testObj1, testObj10]))
                .to.equal(5);
        });
    });
});
