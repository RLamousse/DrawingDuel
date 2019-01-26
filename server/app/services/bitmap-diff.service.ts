import {injectable} from "inversify";
import "reflect-metadata";
import {Bitmap} from "../../../common/image/Bitmap/bitmap";
import {BitmapFactory} from "../images/bitmap/bitmap-factory";
import {DIFFERENCE_MASK, DIFFERENT_PIXEL_COLOR, Mask, SAME_PIXEL_COLOR} from "../../../common/image/mask";

@injectable()
export class BitmapDiffService {

    public getDiff(diffFileName: string, sourceImage: Bitmap, modifiedImage: Bitmap): Bitmap {
        if (sourceImage.width !== modifiedImage.width || sourceImage.height !== modifiedImage.height) {
            throw new Error("Cannot generate the difference if the images does not have the same dimensions");
        }

        const diffMap: number[][] = new Array(sourceImage.height)
            .fill(SAME_PIXEL_COLOR)
            .map(() => new Array(sourceImage.width).fill(SAME_PIXEL_COLOR));

        for (let i = 0; i < sourceImage.pixels.length; i++) {
            for (let j = 0; j < sourceImage.pixels[i].length; j++) {
                const source = sourceImage.pixels[i][j];
                const modif  = modifiedImage.pixels[i][j];
                if (source !== modif) {
                    this.drawMask(diffMap, j, i, DIFFERENCE_MASK);
                }
            }
        }

        return BitmapFactory.createBitmap(diffFileName, diffMap);
    }

    private drawMask(image: number[][], xIndex: number, yIndex: number, mask: Mask) {
        const maskXRadius: number = Math.floor(mask.width / 2);
        const maskYRadius: number = Math.floor(mask.height / 2);
        let maskXStartIndex: number = 0;
        let maskYStartIndex: number = 0;
        let maskXEndIndex: number = mask.width - 1;
        let maskYEndIndex: number = mask.height - 1;

        if (xIndex < maskXRadius) {
            maskXStartIndex = maskXRadius - xIndex;
        }
        if (xIndex + maskXRadius >= image[0].length) {
            maskXEndIndex = maskXEndIndex - ((xIndex + maskXRadius) - (image[0].length - 1));
        }
        if (yIndex < maskYRadius) {
            maskYStartIndex = maskYRadius - yIndex;
        }
        if (yIndex + maskYRadius >= image.length) {
            maskYEndIndex = maskYEndIndex - ((yIndex + maskYRadius) - (image.length - 1));
        }

        for (let maskRowIndex: number = maskYStartIndex; maskRowIndex <= maskYEndIndex; maskRowIndex++) {
            for (let maskColumnIndex: number = maskXStartIndex; maskColumnIndex <= maskXEndIndex; maskColumnIndex++) {
                const xCoord: number = xIndex - maskXRadius + maskColumnIndex;
                const yCoord: number = yIndex - maskYRadius + maskRowIndex;
                if (mask.maskLayout[maskRowIndex][maskColumnIndex]) {
                    image[yCoord][xCoord] = DIFFERENT_PIXEL_COLOR;
                }
            }
        }
    }

}
