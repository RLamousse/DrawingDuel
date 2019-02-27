// tslint:disable:no-magic-numbers
import { expect } from "chai";
import * as fs from "fs";
import {EmptyArrayError, IllegalArgumentError} from "../../../common/errors/services.errors";
import {BitmapFactory} from "../images/bitmap/bitmap-factory";
import {DifferenceEvaluatorService} from "./difference-evaluator.service";

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
            // we need to put the wrong format of input to get an error
            // @ts-ignore
            expect(() => DIFFERENCE_EVALUATOR_SERVICE.getSimpleNDifferences("abs"))
                .to.throw(IllegalArgumentError.ARGUMENT_ERROR_MESSAGE);
        });

        it("Should throw a format error if the input is not an array(undefined)", () => {
            // we need to put the wrong format of input to get an error
            // @ts-ignore
            expect(() => DIFFERENCE_EVALUATOR_SERVICE.getSimpleNDifferences(null))
                .to.throw(IllegalArgumentError.ARGUMENT_ERROR_MESSAGE);
        });

        it("Should throw a format error if the input is not an array of numbers(strings)", () => {
            // we need to put the wrong format of input to get an error
            // @ts-ignore
            expect(() => DIFFERENCE_EVALUATOR_SERVICE.getSimpleNDifferences([[""]]))
                .to.throw(IllegalArgumentError.ARGUMENT_ERROR_MESSAGE);
        });

        it("Should throw a format error if the input is not an array of numbers(undefined)", () => {
            // we need to put the wrong format of input to get an error
            // @ts-ignore
            expect(() => DIFFERENCE_EVALUATOR_SERVICE.getSimpleNDifferences([[null]]))
                .to.throw(IllegalArgumentError.ARGUMENT_ERROR_MESSAGE);
        });

        it("Should throw an empty array error if the input is an empty array", () => {
            expect(() => DIFFERENCE_EVALUATOR_SERVICE.getSimpleNDifferences([]))
                .to.throw(EmptyArrayError.EMPTY_ARRAY_ERROR_MESSAGE);
        });

        it("Should throw an empty array error if the input is an array of empty arrays", () => {
            expect(() => DIFFERENCE_EVALUATOR_SERVICE.getSimpleNDifferences([[]]))
                .to.throw(EmptyArrayError.EMPTY_ARRAY_ERROR_MESSAGE);
        });
    });
});
