import {Bitmap} from "./bitmap";
import * as BitmapUtils from "./bitmap-utils"
import {getBytesPerRowForWidth} from "./bitmap-utils";

export class BitmapFactory {
    public static createBitmap(fileName: string, imageData: Buffer|number[][]) : Bitmap {
        return (imageData instanceof Buffer) ? BitmapFactory.createFromBuffer(fileName, imageData) : BitmapFactory.createFromArray(fileName, imageData);
    }

    private static createFromArray(fileName: string, pixels: number[][]): Bitmap {
        return new Bitmap(fileName, pixels[0].length, pixels.length, pixels);
    }

    private static createFromBuffer(fileName: string, imageData: Buffer): Bitmap {
        const rawBitmapDataOffset = imageData.readUIntLE(BitmapUtils.RAW_BITMAP_OFFSET_FLAG_OFFSET, BitmapUtils.RAW_BITMAP_OFFSET_FLAG_LENGTH);
        const width = imageData.readUIntLE(BitmapUtils.WIDTH_FLAG_OFFSET, BitmapUtils.WIDTH_FLAG_LENGTH);
        const height = imageData.readUIntLE(BitmapUtils.HEIGHT_FLAG_OFFSET, BitmapUtils.HEIGHT_FLAG_LENGTH);
        const colorDepth = imageData.readUIntLE(BitmapUtils.COLOR_DEPTH_FLAG_OFFSET, BitmapUtils.COLOR_DEPTH_FLAG_LENGTH) / 8;
        const bitsPerRow = getBytesPerRowForWidth(width); // Addresses are a multiple of 4

        const pixels: number[][] = [];
        for (let i = 0; i < height; i++) {
            pixels[i] = [];
            for (let j = 0; j < width; j++) {
                pixels[i][j] = imageData.readUIntLE(
                    rawBitmapDataOffset + (i * bitsPerRow) + (j * colorDepth),
                    colorDepth
                );
            }
        }

        return new Bitmap(fileName, width, height, pixels);
    }
}
