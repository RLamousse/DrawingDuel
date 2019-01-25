import {injectable} from "inversify";
import "reflect-metadata";
import {Bitmap} from "../../../common/image/Bitmap";
import Mask from '../../../common/image/Mask'

@injectable()
export class BitmapDiffService {

    public getDiff(sourceImage: Bitmap, modifiedImage: Bitmap) {

        let success: Boolean = true;
        let diffMap: number[][] = [[]];

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

    private applyMask(image: number[][], x_index: number, y_index: number, mask?: Mask) {
        if (!mask) {
            mask = {
                width: 7,
                height: 7,
                // TODO: On change ça de place, c'est plus ou moins clean
                maskLayout: [
                    [0xFFFFFF, 0xFFFFFF, 0x000000, 0x000000, 0x000000, 0xFFFFFF, 0xFFFFFF],
                    [0xFFFFFF, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0xFFFFFF],
                    [0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000],
                    [0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000],
                    [0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000],
                    [0xFFFFFF, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0xFFFFFF],
                    [0xFFFFFF, 0xFFFFFF, 0x000000, 0x000000, 0x000000, 0xFFFFFF, 0xFFFFFF],
                ]
            }
        }
        let maskXRadius: number = Math.floor(mask.width / 2);
        let maskYRadius: number = Math.floor(mask.height / 2);
        let maskXStartIndex: number = 0;
        let maskYStartIndex: number = 0;
        let maskXEndIndex: number = mask.width - 1;
        let maskYEndIndex: number = mask.height - 1;

        if (x_index < maskXRadius) {
            maskXStartIndex = maskXRadius - x_index;
        }
        if (x_index + maskXRadius >= image[0].length) {
            maskXEndIndex = maskXEndIndex - ((x_index + maskXRadius) - (image[0].length - 1));
        }
        if (y_index < maskYRadius) {
            maskYStartIndex = maskYRadius - y_index;
        }
        if (y_index + maskYRadius >= image.length) {
            maskYEndIndex = maskYEndIndex - ((y_index + maskYRadius) - (image.length - 1));
        }
        // Start vertically higher than the target and end with the end of the image while inside the mask radius
        for (let i = (y_index - (maskYRadius - maskYStartIndex)); i < image.length && i <= y_index + maskYRadius; i++) {
            let xCopyStart: number = (x_index - (maskXRadius - maskXStartIndex));
            let xCopyEnd: number = x_index + maskXRadius >= image.length ? image[i].length : y_index + maskXRadius;
            image[i].splice(xCopyStart, xCopyEnd - xCopyStart, ...mask[i]);
        }
    }

}
