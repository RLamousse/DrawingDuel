import * as fs from "fs";
import {Bitmap} from "../../../../common/image/Bitmap/bitmap";
import {
    COLOR_DEPTH_24BPP_BYTES,
    getBytesPerRowForWidth,
    getHeaderForDimension,
    getTotalBytesForDimension
} from "../../../../common/image/Bitmap/bitmap-utils";

export class BitmapWriter {
    public static getBitmapBytes(bitmap: Bitmap): Buffer {
        const bitmapHeaderBuffer = getHeaderForDimension(bitmap.width, bitmap.height);
        const bitmapPixelDataBuffer = Buffer.alloc(getTotalBytesForDimension(bitmap.width, bitmap.height), 0x0);
        const bytesPerRow = getBytesPerRowForWidth(bitmap.width);

        for (let i = 0; i < bitmap.pixels.length; i++) {
            for (let j = 0; j < bitmap.pixels[i].length; j++) {
                bitmapPixelDataBuffer.writeUIntLE(
                    bitmap.pixels[i][j],
                    i * bytesPerRow + j * COLOR_DEPTH_24BPP_BYTES,
                    COLOR_DEPTH_24BPP_BYTES
                )
            }
        }

        return Buffer.concat([bitmapHeaderBuffer, bitmapPixelDataBuffer], bitmapHeaderBuffer.length + bitmapPixelDataBuffer.length);
    }
    public static write(pathPrefix: string, bitmap: Bitmap) {
        const path: string = pathPrefix + bitmap.fileName + (!bitmap.fileName.endsWith(".bmp")) ? ".bmp" : "";
        fs.writeFile(path, this.getBitmapBytes(bitmap), (err) => {
            new Error(err.message);
        });
    }
}
