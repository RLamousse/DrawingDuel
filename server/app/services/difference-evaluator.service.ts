import { injectable } from "inversify";
import "reflect-metadata";

@injectable()
export class DifferenceEvaluatorService {

    public getNDifferences(diffImage: string): number {
        // TODO get BMP file format from the two philipes
        // pseudocode: 
        const pixels: number[][] = [[1, 0, 0],
                                    [1, 1, 1],
                                    [0, 0, 0]];
        for (const pixel of pixels) {
            console.dir(pixel);
        }
    }
}
