import { injectable } from "inversify";
import "reflect-metadata";

@injectable()
export class DifferenceEvaluatorService {

    public getNDifferences(diffImage: string): number {
        // TODO get BMP file format from the two philipes
        // pseudocode: 
        const pixels: number[][] = [[1, 0, 1, 0, 1],
                                    [1, 1, 1, 1, 1],
                                    [0, 0, 0, 0, 0],
                                    [1, 0, 1, 0, 1],
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
                    let upValue: number = 0;
                    let leftValue: number = 0;
                    if (i > 0 && arrayOfLabels[i - 1][j] !== 0) {
                        upValue = arrayOfLabels[i - 1][j];
                    }
                    if (j > 0 && arrayOfLabels[i][j - 1] !== 0) {
                        leftValue = arrayOfLabels[i][j - 1];
                    }

                    if (!upValue && !leftValue) {
                        maxCurrentLabel++;
                        arrayOfLabels[i][j] = maxCurrentLabel;
                    } else if (!leftValue) {
                        arrayOfLabels[i][j] = upValue;
                    } else if (!upValue || leftValue === upValue) {
                        arrayOfLabels[i][j] = leftValue;
                    } else {
                        //make this into a function
                        if (typeof translateTable[Math.min(upValue, leftValue)] === "undefined") {
                            translateTable[Math.min(upValue, leftValue)] = [Math.max(upValue, leftValue)];
                        } else if (translateTable[Math.min(upValue, leftValue)].indexOf(Math.max(upValue, leftValue) !== -1)) {
                            translateTable[Math.min(upValue, leftValue)].push(Math.max(upValue, leftValue));
                        }
                        arrayOfLabels[i][j] = Math.min(upValue, leftValue);
                    }
                }
            }
        }


        console.dir(translateTable);


        for (let i: number = 0; i < arrayOfLabels.length; i++) {

            let line: string = "";
            for(let j: number = 0; j < arrayOfLabels[0].length; j++) {
                if (arrayOfLabels[i][j] != 0){
                    for (let key in translateTable){
                        if (translateTable[key].indexOf(arrayOfLabels[i][j]) !== -1) {
                            arrayOfLabels[i][j] = +key;
                            break;
                        }
                    }
                }

                line += arrayOfLabels[i][j] + ", ";
            }

            console.dir(line);
        }

        let totalDifferences: number = maxCurrentLabel;
        for (let key in translateTable){
            totalDifferences -= translateTable[key].length;
        }

        return totalDifferences;
    }
}
