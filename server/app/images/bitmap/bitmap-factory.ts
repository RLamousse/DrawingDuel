import {Bitmap} from "../../../../common/image/Bitmap/bitmap";
import {
    getBytesPerRowForWidth,
    BITS_PER_BYTE,
    BMP_ID_FIELD,
    BMP_ID_FIELD_LENGTH,
    BMP_ID_FIELD_OFFSET,
    COLOR_DEPTH_24BPP_BYTES,
    COLOR_DEPTH_FLAG_LENGTH,
    COLOR_DEPTH_FLAG_OFFSET,
    HEIGHT_FLAG_LENGTH,
    HEIGHT_FLAG_OFFSET,
    RAW_BITMAP_OFFSET_FLAG_LENGTH,
    RAW_BITMAP_OFFSET_FLAG_OFFSET,
    WIDTH_FLAG_LENGTH,
    WIDTH_FLAG_OFFSET,
    FILE_SIZE_FLAG_OFFSET, FILE_SIZE_FLAG_LENGTH,
} from "../../../../common/image/Bitmap/bitmap-utils";
import {SAME_PIXEL_COLOR} from "../../../../common/image/mask";
import {create2dArray} from "../../../../common/util/util";

export class BitmapFactory {
    public static createBitmap(fileName: string, imageData: Buffer|number[][]): Bitmap {
        return (imageData instanceof Buffer)
            ? BitmapFactory.createFromBuffer(fileName, imageData)
            : BitmapFactory.createFromArray(fileName, imageData);
    }

    private static createFromArray(fileName: string, pixels: number[][]): Bitmap {
        return new Bitmap(fileName, pixels[0].length, pixels.length, pixels);
    }

    private static createFromBuffer(fileName: string, imageData: Buffer): Bitmap {
        if (imageData.readUIntLE(BMP_ID_FIELD_OFFSET, BMP_ID_FIELD_LENGTH) !== BMP_ID_FIELD) {
            throw new Error("Buffer is not a bitmap");
        }

        const colorDepth: number = imageData.readUIntLE(
            COLOR_DEPTH_FLAG_OFFSET,
            COLOR_DEPTH_FLAG_LENGTH,
        ) / BITS_PER_BYTE;

        if (colorDepth !== COLOR_DEPTH_24BPP_BYTES) {
            throw new Error("Buffer is not from a 24bpp bitmap");
        }

        if (imageData.readUIntLE(FILE_SIZE_FLAG_OFFSET, FILE_SIZE_FLAG_LENGTH) !== imageData.length) {
            throw new Error("Buffer is not complete");
        }

        const width: number = imageData.readUIntLE(WIDTH_FLAG_OFFSET, WIDTH_FLAG_LENGTH);
        const height: number = imageData.readUIntLE(HEIGHT_FLAG_OFFSET, HEIGHT_FLAG_LENGTH);
        const rawBitmapDataOffset: number = imageData.readUIntLE(
            RAW_BITMAP_OFFSET_FLAG_OFFSET,
            RAW_BITMAP_OFFSET_FLAG_LENGTH,
        );
        const bitsPerRow: number = getBytesPerRowForWidth(width); // Addresses are a multiple of 4
        const pixels: number[][] = this.loadPixels(height, width, imageData, rawBitmapDataOffset, bitsPerRow, colorDepth);

        return new Bitmap(fileName, width, height, pixels);
    }

    private static loadPixels(
        height: number,
        width: number,
        imageData: Buffer,
        rawBitmapDataOffset: number,
        bitsPerRow: number,
        colorDepth: number): number[][] {

        const pixels: number[][] = create2dArray(10, 10, SAME_PIXEL_COLOR);
        for (let i: number = 0; i < height; i++) {
            pixels[i] = [];
            for (let j: number = 0; j < width; j++) {
                pixels[i][j] = imageData.readUIntLE(
                    rawBitmapDataOffset + (i * bitsPerRow) + (j * colorDepth),
                    colorDepth,
                );
            }
        }

        return pixels;
    }
}
