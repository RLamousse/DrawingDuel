import {expect} from "chai";
import * as fs from "fs";
import {Bitmap} from "../../../../common/image/Bitmap/bitmap";
import {BitmapFactory} from "../../../../common/image/Bitmap/bitmap-factory";
import {BitmapWriter} from "./bitmap-writer";

describe("A util class to write bitmaps to disk", () => {
    it("should return a valid buffer for a given pixel array", () => {
        const originalBuffer: Buffer = fs.readFileSync("test/test_bitmaps/white10x10.bmp");
        const originalBitmap: Bitmap = BitmapFactory.createBitmap("test-white10x10.bmp", originalBuffer);
        const bitmapWriterBytes: Buffer = BitmapWriter.getBitmapBytes(originalBitmap);
        expect(Buffer.compare(originalBuffer, bitmapWriterBytes)).to.equal(0);
    });
});
