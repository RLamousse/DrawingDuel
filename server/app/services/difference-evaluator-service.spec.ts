import { expect } from "chai";
import * as fs from "fs";
import {BitmapFactory} from "../images/bitmap/bitmap-factory";
import {
    ARGUMENT_ERROR_MESSAGE,
    DifferenceEvaluatorService,
    EMPTY_ARRAY_ERROR_MESSAGE
} from "./difference-evaluator.service";

const DIFFERENCE_EVALUATOR_SERVICE: DifferenceEvaluatorService = new DifferenceEvaluatorService();
const TEST_FILES: string[] = ["0-zones-test.bmp", "1-zone_test.bmp", "6-zones-test.bmp",
                              "7-zones-test.bmp", "8-zones-test.bmp", "16-zones-test.bmp"];

const TEST_FILE_ARRAYS: number[][][] = [];

describe("A service that counts non-white connected pixels in a bmp", () => {

    before(() => {
        for (const FILE of TEST_FILES) {
            TEST_FILE_ARRAYS.push(BitmapFactory.createBitmap(FILE, fs.readFileSync("./test/test_difference_evaluator/" + FILE)).pixels);
        }
    });

    it("Should calculate 0 zones", () => {
        expect(DIFFERENCE_EVALUATOR_SERVICE.getNDifferences(TEST_FILE_ARRAYS[0]))
            .to.equal(0);
    });

    it("Should calculate 1 zone", () => {
        expect(DIFFERENCE_EVALUATOR_SERVICE.getNDifferences(TEST_FILE_ARRAYS[1]))
            .to.equal(1);
    });

    it("Should calculate 6 zones", () => {
        expect(DIFFERENCE_EVALUATOR_SERVICE.getNDifferences(TEST_FILE_ARRAYS[2]))
            .to.equal(6);
    });

    it("Should calculate 7 zones", () => {
        expect(DIFFERENCE_EVALUATOR_SERVICE.getNDifferences(TEST_FILE_ARRAYS[3]))
            .to.equal(7);
    });

    it("Should calculate 8 zones", () => {
        expect(DIFFERENCE_EVALUATOR_SERVICE.getNDifferences(TEST_FILE_ARRAYS[4]))
            .to.equal(8);
    });

    it("Should calculate 16 zone from an extremely random drawing", () => {
        expect(DIFFERENCE_EVALUATOR_SERVICE.getNDifferences(TEST_FILE_ARRAYS[5]))
            .to.equal(16);
    });

    it("Should throw a format error if the input is not an array(string)", () => {
        // @ts-ignore
        expect(() => DIFFERENCE_EVALUATOR_SERVICE.getNDifferences("abs"))
            .to.throw(ARGUMENT_ERROR_MESSAGE);
    });

    it("Should throw a format error if the input is not an array(undefined)", () => {
        // @ts-ignore
        expect(() => DIFFERENCE_EVALUATOR_SERVICE.getNDifferences(null))
            .to.throw(ARGUMENT_ERROR_MESSAGE);
    });

    it("Should throw a format error if the input is not an array of numbers(strings)", () => {
        // @ts-ignore
        expect(() => DIFFERENCE_EVALUATOR_SERVICE.getNDifferences([[""]]))
            .to.throw(ARGUMENT_ERROR_MESSAGE);
    });

    it("Should throw a format error if the input is not an array of numbers(undefined)", () => {
        // @ts-ignore
        expect(() => DIFFERENCE_EVALUATOR_SERVICE.getNDifferences([[null]]))
            .to.throw(ARGUMENT_ERROR_MESSAGE);
    });

    it("Should throw an empty array error if the input is an empty array", () => {
        expect(() => DIFFERENCE_EVALUATOR_SERVICE.getNDifferences([]))
            .to.throw(EMPTY_ARRAY_ERROR_MESSAGE);
    });

    it("Should throw an empty array error if the input is an array of empty arrays", () => {
        expect(() => DIFFERENCE_EVALUATOR_SERVICE.getNDifferences([[]]))
            .to.throw(EMPTY_ARRAY_ERROR_MESSAGE);
    });
});
