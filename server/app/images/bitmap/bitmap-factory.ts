import {Bitmap} from "../../../../common/image/Bitmap/bitmap";
import {
    getBytesPerRowForWidth,
    BITS_PER_BYTE, COLOR_DEPTH_FLAG_LENGTH, COLOR_DEPTH_FLAG_OFFSET, HEIGHT_FLAG_LENGTH,
    HEIGHT_FLAG_OFFSET, RAW_BITMAP_OFFSET_FLAG_LENGTH, RAW_BITMAP_OFFSET_FLAG_OFFSET,
    WIDTH_FLAG_LENGTH, WIDTH_FLAG_OFFSET
} from "../../../../common/image/Bitmap/bitmap-utils";
import {SAME_PIXEL_COLOR} from "../../../../common/image/mask";

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
        const rawBitmapDataOffset: number = imageData.readUIntLE(
            RAW_BITMAP_OFFSET_FLAG_OFFSET,
            RAW_BITMAP_OFFSET_FLAG_LENGTH,
        );
        const width: number = imageData.readUIntLE(WIDTH_FLAG_OFFSET, WIDTH_FLAG_LENGTH);
        const height: number = imageData.readUIntLE(HEIGHT_FLAG_OFFSET, HEIGHT_FLAG_LENGTH);
        const colorDepth: number = imageData.readUIntLE(
            COLOR_DEPTH_FLAG_OFFSET,
            COLOR_DEPTH_FLAG_LENGTH,
        ) / BITS_PER_BYTE;
        const bitsPerRow: number = getBytesPerRowForWidth(width); // Addresses are a multiple of 4

        const pixels: number[][] = new Array(height)
            .fill(SAME_PIXEL_COLOR)
            .map(() => new Array(width).fill(SAME_PIXEL_COLOR));

        for (let i: number = 0; i < height; i++) {
            pixels[i] = [];
            for (let j: number = 0; j < width; j++) {
                pixels[i][j] = imageData.readUIntLE(
                    rawBitmapDataOffset + (i * bitsPerRow) + (j * colorDepth),
                    colorDepth,
                );
            }
        }

        return new Bitmap(fileName, width, height, pixels);
    }
}
