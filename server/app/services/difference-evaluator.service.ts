import { injectable } from "inversify";
import "reflect-metadata";

@injectable()
export class DifferenceEvaluatorService {

    public getNDifferences(pixels: number[][]): number {

        const TRANSLATE_TABLE: Map<number, number[]> = new Map<number, number[]>();
        let maxCurrentLabel: number = 0;
        const ARRAY_OF_LABELS: number[][] = new Array<number[]>(pixels.length);

        for (let i: number = 0; i < ARRAY_OF_LABELS.length; i++) {
            ARRAY_OF_LABELS[i] = new Array<number>(pixels[0].length);
        }
        for (const LINE of ARRAY_OF_LABELS) {
            for (const ELEMENT in LINE) {
                if (LINE.hasOwnProperty(ELEMENT)) {
                    LINE[ELEMENT] = 0;
                }
            }
        }
        for (let i: number = 0; i < pixels.length; i++) {
            for (let j: number = 0; j < pixels[0].length; j++) {
                if (pixels[i][j]) {
                    maxCurrentLabel = this.analysePixel(i, j, ARRAY_OF_LABELS, maxCurrentLabel, TRANSLATE_TABLE);
                }
            }
        }

        return this.calculateDifference(maxCurrentLabel, TRANSLATE_TABLE);
    }

    private manageConflict(upValue: number, leftValue: number, translateTable: Map<number, number[]>): void {
        if (typeof translateTable[Math.min(upValue, leftValue)] === "undefined") {
            translateTable[Math.min(upValue, leftValue)] = [Math.max(upValue, leftValue)];
        } else if (translateTable[Math.min(upValue, leftValue)].indexOf(Math.max(upValue, leftValue) >= 0)) {
            translateTable[Math.min(upValue, leftValue)].push(Math.max(upValue, leftValue));
        }
    }

    private analysePixel(xPosition: number, yPosition: number, arrayOfLabels: number[][],
                         maxCurrentLabel: number, translateTable: Map<number, number[]>): number {
        let upValue: number = 0;
        let leftValue: number = 0;
        if (xPosition > 0 && arrayOfLabels[xPosition - 1][yPosition] !== 0) {
            upValue = arrayOfLabels[xPosition - 1][yPosition];
        }
        if (yPosition > 0 && arrayOfLabels[xPosition][yPosition - 1] !== 0) {
            leftValue = arrayOfLabels[xPosition][yPosition - 1];
        }

        if (!upValue && !leftValue) {
            arrayOfLabels[xPosition][yPosition] = ++maxCurrentLabel;
        } else if (!leftValue) {
            arrayOfLabels[xPosition][yPosition] = upValue;
        } else if (!upValue || leftValue === upValue) {
            arrayOfLabels[xPosition][yPosition] = leftValue;
        } else {
            this.manageConflict(upValue, leftValue, translateTable);
            arrayOfLabels[xPosition][yPosition] = Math.min(upValue, leftValue);
        }

        return maxCurrentLabel;
    }

    private calculateDifference(maxCurrentLabel: number, TRANSLATE_TABLE: Map<number, number[]>): number {

        let totalDifferences: number = maxCurrentLabel;
        for (const key in TRANSLATE_TABLE) {
            if (TRANSLATE_TABLE.hasOwnProperty(key)) {
                totalDifferences -= TRANSLATE_TABLE[key].length;
            }
        }

        return totalDifferences;
    }
}
