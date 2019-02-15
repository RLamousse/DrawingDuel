import {injectable} from "inversify";
import "reflect-metadata";
import {create2dArray} from "../../../common/util/util";
import {IPoint} from "../../../common/model/IPoint";

export const ARGUMENT_ERROR_MESSAGE: string = "Error: the argument has the wrong format! Must be a number[][].";
export const EMPTY_ARRAY_ERROR_MESSAGE: string = "Error: the given array is empty!";

export interface SimpleDifferenceData {
    diffsCount: number;
    diffZonesMap: Map<IPoint, number>;
}

@injectable()
export class DifferenceEvaluatorService {

    constructor () {}

    public getNDifferences(pixels: number[][]): SimpleDifferenceData {

        this.validateData(pixels);

        // this algorithm is the two-pass algorithm and a set of connected labelled zones is connected by a disjoint-set data structure
        // the algorithm does not consider edge connections

        // the element PARENT_TABLE[x] contains the parent of x, nodes without parent contain the value of 0
        const PARENT_TABLE: Map<number, number> = new Map<number, number>();
        let maxCurrentLabel: number = 0;
        const ARRAY_OF_LABELS: number[][] = create2dArray(pixels[0].length, pixels.length, 0);

        for (let i: number = 0; i < pixels.length; i++) {
            for (let j: number = 0; j < pixels[0].length; j++) {

                // if pixel is not withe
                if (!pixels[i][j]) {
                    maxCurrentLabel = this.analysePixel(i, j, ARRAY_OF_LABELS, maxCurrentLabel, PARENT_TABLE);
                }

            }
        }

        //TODO generate colored diff image
        return {diffsCount: this.calculateTotalZones(PARENT_TABLE), diffZonesMap: this.generateDiffZonesMap(PARENT_TABLE, ARRAY_OF_LABELS)};
    }

    private validateData(pixels: number[][]): void {
        // local variable needed because pixels cannot be directly passed to isArray function
        const TMP_ARRAY: number[][] = pixels;
        if (!Array.isArray(TMP_ARRAY)) {
            throw new Error(ARGUMENT_ERROR_MESSAGE);
        }
        if (TMP_ARRAY.length === 0) {
            throw new Error(EMPTY_ARRAY_ERROR_MESSAGE);
        }
        if (!Array.isArray(TMP_ARRAY[0])) {
            throw new Error(ARGUMENT_ERROR_MESSAGE);
        }
        if ( TMP_ARRAY[0].length === 0) {
            throw new Error(EMPTY_ARRAY_ERROR_MESSAGE);
        }
        if (typeof TMP_ARRAY[0][0] !== "number") {
            throw new Error(ARGUMENT_ERROR_MESSAGE);
        }
    }

    private analysePixel(xPosition: number, yPosition: number, arrayOfLabels: number[][],
                         maxCurrentLabel: number, parentTable: Map<number, number>): number {
        let abovePixelLabel: number = 0;
        let leftPixelLabel: number = 0;

        // only computes pixels above and left if not at the border of the picture
        if (xPosition > 0 && arrayOfLabels[xPosition - 1][yPosition] !== 0) {
            abovePixelLabel = arrayOfLabels[xPosition - 1][yPosition];
        }
        if (yPosition > 0 && arrayOfLabels[xPosition][yPosition - 1] !== 0) {
            leftPixelLabel = arrayOfLabels[xPosition][yPosition - 1];
        }

        // if the pixel can be newly labelled
        if (!abovePixelLabel && !leftPixelLabel) {
            arrayOfLabels[xPosition][yPosition] = ++maxCurrentLabel;
            parentTable[maxCurrentLabel] = 0;

            // if only the upPixel is labelled
        } else if (!leftPixelLabel) {
            arrayOfLabels[xPosition][yPosition] = abovePixelLabel;

            // if only the left pixel is labelled, or both have the same label
        } else if (!abovePixelLabel || leftPixelLabel === abovePixelLabel) {
            arrayOfLabels[xPosition][yPosition] = leftPixelLabel;

            // if the two pixels are labelled differently
        } else {
            this.updateParentValue(Math.min(abovePixelLabel, leftPixelLabel), Math.max(abovePixelLabel, leftPixelLabel), parentTable);
            arrayOfLabels[xPosition][yPosition] = this.findRoot(leftPixelLabel, parentTable);
        }

        return maxCurrentLabel;
    }

    private updateParentValue(a: number, b: number, parentTable: Map<number, number>): void {
        const ROOT_A: number = this.findRoot(a, parentTable);
        const ROOT_B: number = this.findRoot(b, parentTable);

        // Basically, this links the two sets if they are not already linked
        if (ROOT_A !== ROOT_B) {
            parentTable[Math.max(ROOT_A, ROOT_B)] = Math.min(ROOT_A, ROOT_B);
        }
    }

    // Counts the total of zones in the drawing
    private calculateTotalZones(TRANSLATE_TABLE: Map<number, number>): number {

        let totalZones: number = 0;
        for (const KEY in TRANSLATE_TABLE) {
            // adds a zone to the counter if it has not any parent(equals to 0)
            if (TRANSLATE_TABLE.hasOwnProperty(KEY) && !TRANSLATE_TABLE[KEY]) {
                totalZones++;
            }
        }

        return totalZones;
    }

    private findRoot(value: number, parentTable: Map<number, number>): number {
        if (!parentTable[value]) {
            return value;
        }

        // this assignation makes the average complexity of the find function lower than O(m∙log(n))
        return parentTable[value] = this.findRoot(parentTable[value], parentTable);
    }

    private generateDiffZonesMap(parentTable: Map<number, number>, arrayOfLabels: number[][]): Map<{x: number, y: number}, number> {
        const DIFF_ZONES_MAP: Map<{x: number, y: number}, number> = new Map<{x: number, y: number}, number>();

        for (let i: number = 0; i < arrayOfLabels.length; i++) {
            for (let j: number = 0; j < arrayOfLabels[0].length; j++) {
                if (arrayOfLabels[i][j]) {
                    DIFF_ZONES_MAP.set({x: i, y: j}, parentTable[arrayOfLabels[i][j]]);
                }
            }
        }

        return DIFF_ZONES_MAP;

    }
}
