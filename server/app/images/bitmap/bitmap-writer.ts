import * as fs from "fs";
import {injectable} from "inversify";
import "reflect-metadata";
import {Bitmap} from "../../../../common/image/Bitmap/bitmap";
import {
    getBytesPerRowForWidth,
    getHeaderForDimension,
    getTotalBytesForDimension,
    COLOR_DEPTH_24BPP_BYTES
} from "../../../../common/image/Bitmap/bitmap-utils";

@injectable()
export class BitmapWriter {
    public getBitmapBytes(bitmap: Bitmap): Buffer {
        const bitmapHeaderBuffer: Buffer = Buffer.from(getHeaderForDimension(bitmap.dimension));
        const bitmapPixelDataBuffer: Buffer = Buffer.alloc(getTotalBytesForDimension(bitmap.dimension), 0x0);
        const bytesPerRow: number = getBytesPerRowForWidth(bitmap.width);

        for (let i: number = 0; i < bitmap.pixels.length; i++) {
            for (let j: number = 0; j < bitmap.pixels[i].length; j++) {
                bitmapPixelDataBuffer.writeUIntLE(
                    bitmap.pixels[i][j],
                    i * bytesPerRow + j * COLOR_DEPTH_24BPP_BYTES,
                    COLOR_DEPTH_24BPP_BYTES,
                );
            }
        }

        return Buffer.concat([bitmapHeaderBuffer, bitmapPixelDataBuffer], bitmapHeaderBuffer.length + bitmapPixelDataBuffer.length);
    }
    public write(bitmap: Bitmap, pathPrefix: string = "./"): string {
        const path: string = `${pathPrefix}${pathPrefix.endsWith("/") ? "" : "/"}${bitmap.fileName}`;
        fs.writeFileSync(path, this.getBitmapBytes(bitmap));

        return path;
    }
}
