import {expect} from "chai";
import * as fs from "fs";
import {Bitmap} from "../../../common/image/Bitmap";
import {BitmapDiffService} from "./bitmap-diff.service";

const bitmapDiffService: BitmapDiffService = new BitmapDiffService();
const smallSolidWhiteBitmap: Bitmap = new Bitmap("white10x10.bmp", fs.readFileSync("test/test_bitmaps/white10x10.bmp"));
const smallSolidBlackBitmap: Bitmap = new Bitmap("black10x10.bmp", fs.readFileSync("test/test_bitmaps/black10x10.bmp"));
const largeSolidWhiteBitmap: Bitmap = new Bitmap("white640x480.bmp", fs.readFileSync("test/test_bitmaps/white640x480.bmp"));

describe("A service generating the difference between two bitmaps", () => {
    it("should throw if the two images are not of the same dimensions", () => {
        expect(() => bitmapDiffService.getDiff(smallSolidWhiteBitmap, largeSolidWhiteBitmap)).to.throw();
    });
    it("should return a white image if the same image is passed as parameters", () => {
        const diff: Bitmap = bitmapDiffService.getDiff(smallSolidWhiteBitmap, smallSolidWhiteBitmap);
        expect(diff.pixels).to.be.equal(smallSolidWhiteBitmap.pixels);
    });
    it("should return a black image if the two images are completly different", () => {
        const diff: Bitmap = bitmapDiffService.getDiff(smallSolidWhiteBitmap, smallSolidBlackBitmap);
        expect(diff.pixels).to.be.equal(smallSolidBlackBitmap.pixels);
    });
    it("should return a valid diff for two related images (pikachu)", () => {
        const expectedDiff: Bitmap = new Bitmap("pika.diff.bmp", fs.readFileSync("test/test_bitmaps/pika.diff.bmp"));
        const original: Bitmap = new Bitmap("pika.o.bmp", fs.readFileSync("test/test_bitmaps/pika.o.bmp"));
        const modified: Bitmap = new Bitmap("pika.m.bmp", fs.readFileSync("test/test_bitmaps/pika.m.bmp"));
        const actualDiff: Bitmap = bitmapDiffService.getDiff(original, modified);

        expect(actualDiff.pixels).to.be.equal(expectedDiff.pixels);
    });
});
