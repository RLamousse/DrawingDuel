import {injectable} from "inversify";
import "reflect-metadata";
import {Bitmap} from "../../../common/image/Bitmap";

@injectable()
export class BitmapDiffService {

    public getDiff(sourceImage: Bitmap, modifiedImage: Bitmap) {

        let success: Boolean = true;
        let diffMap: Number[][] = [[]];

        if (sourceImage.width !== modifiedImage.width || sourceImage.height !== modifiedImage.height) {
            throw new Error("Cannot generate the difference if the images does not have the same dimensions");
        }

        for (let i = 0; i < sourceImage.pixels.length; i++) {
            for (let j = 0; j < sourceImage[i].length; j++) {
                const source = sourceImage[i][j];
                const modif  = modifiedImage[i][j];
                diffMap[i][j] = source === modif ? 0xFFFFFF : 0;
                this.applyMask(diffMap, i, j);
            }
        }

        return success;
    }

    private applyMask(image: Number[][], x_index: Number, y_index: Number, mask?: Number[][]) {
        if (!mask) {
            mask = [
                [0, 0, 1, 1, 1, 0, 0],
                [0, 1, 1, 1, 1, 1, 0],
                [1, 1, 1, 1, 1, 1, 1],
                [1, 1, 1, 1, 1, 1, 1],
                [1, 1, 1, 1, 1, 1, 1],
                [0, 1, 1, 1, 1, 1, 0],
                [0, 0, 1, 1, 1, 0, 0],
            ]
        }
        

    }

}
