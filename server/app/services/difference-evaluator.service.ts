import { injectable } from "inversify";
import "reflect-metadata";

@injectable()
export class DifferenceEvaluatorService {

    public getNDifferences(diffImage: string): number {
        // TODO get BMP file format from the two philipes
        // pseudocode: 
        const pixels: number[][] = [[1, 0, 1, 0, 1],
                                    [1, 1, 1, 1, 1],
                                    [1, 0, 1, 0, 1],
                                    [0, 1, 0, 1, 0],
                                    [1, 1, 1, 1, 1]];


        let translateTable: Map<number, number[]> = new Map<number, number[]>();
        let maxCurrentLabel: number = 0;
        //move this code in utils, array generator
        let arrayOfLabels: number[][] = new Array<number[]>(pixels.length);

        for (let i: number = 0; i < arrayOfLabels.length; i++) {
            arrayOfLabels[i] = new Array<number>(pixels[0].length);
        }
        for (let i: number = 0; i < arrayOfLabels.length; i++) {
            for(let j: number = 0; j < arrayOfLabels[0].length; j++) {
                arrayOfLabels[i][j] = 0;
            }
        }
        for (let i: number = 0; i < pixels.length; i++) {
            for (let j: number = 0; j < pixels[0].length; j++) {
                if (pixels[i][j]) {
                    maxCurrentLabel = this.analysePixel(i, j, arrayOfLabels, maxCurrentLabel, translateTable);
                }
            }
        }

        let totalDifferences: number = maxCurrentLabel;
        for (let key in translateTable) {
            totalDifferences -= translateTable[key].length;
        }

        return totalDifferences;
    }

    private manageConflict(upValue: number, leftValue: number, translateTable: Map<number, number[]>): void {
        if (typeof translateTable[Math.min(upValue, leftValue)] === "undefined") {
            translateTable[Math.min(upValue, leftValue)] = [Math.max(upValue, leftValue)];
        } else if (translateTable[Math.min(upValue, leftValue)].indexOf(Math.max(upValue, leftValue) !== -1)) {
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
}
