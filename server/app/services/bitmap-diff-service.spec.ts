import {expect} from "chai";
import * as fs from "fs";
import {Bitmap} from "../../../common/image/bitmap/bitmap";
import {BitmapFactory} from "../images/bitmap/bitmap-factory";
import {BitmapWriter} from "../images/bitmap/bitmap-writer";
import {BitmapDiffService} from "./bitmap-diff.service";

const bitmapWriter: BitmapWriter = new BitmapWriter();
const bitmapDiffService: BitmapDiffService = new BitmapDiffService();
const smallSolidWhiteBitmap: Bitmap = BitmapFactory.createBitmap("white10x10.bmp", fs.readFileSync("test/test_bitmaps/white10x10.bmp"));
const smallSolidBlackBitmap: Bitmap = BitmapFactory.createBitmap("black10x10.bmp", fs.readFileSync("test/test_bitmaps/black10x10.bmp"));
const largeSolidWhiteBitmap: Bitmap = BitmapFactory.createBitmap("white640x480.bmp", fs.readFileSync("test/test_bitmaps/white640x480.bmp"));

describe("A service generating the difference between two bitmaps", () => {
    it("should throw if the two images are not of the same dimensions", () => {
        expect(() => bitmapDiffService.getDiff("test-diff.bmp", smallSolidWhiteBitmap, largeSolidWhiteBitmap)).to.throw();
    });
    it("should return a white image if the same image is passed as parameters", () => {
        const diff: Bitmap = bitmapDiffService.getDiff("test-diff1.bmp", smallSolidWhiteBitmap, smallSolidWhiteBitmap);
        expect(diff.pixels).to.eql(smallSolidWhiteBitmap.pixels);
    });
    it("should return a black image if the two images are completely different", () => {
        const diff: Bitmap = bitmapDiffService.getDiff("test-diff2.bmp", smallSolidWhiteBitmap, smallSolidBlackBitmap);
        expect(diff.pixels).to.eql(smallSolidBlackBitmap.pixels);
    });
    it("should draw the difference mask", () => {
        const expectedDiff: Bitmap = BitmapFactory.createBitmap(
            "centerMask10x10.bmp",
            fs.readFileSync("test/test_bitmaps/centerMask10x10.bmp"));
        const modified: Bitmap = BitmapFactory.createBitmap(
            "centerBlack10x10.bmp",
            fs.readFileSync("test/test_bitmaps/centerBlack10x10.bmp"));
        const actualDiff: Bitmap = bitmapDiffService.getDiff("test-diff3.bmp", smallSolidWhiteBitmap, modified);

        expect(actualDiff.pixels).to.eql(expectedDiff.pixels);
    });
    it("should return a valid diff for two related images (navy seal)", () => {
        const expectedDiff: Bitmap = BitmapFactory.createBitmap("seal.diff.bmp", fs.readFileSync("test/test_bitmaps/seal.diff.bmp"));
        const modified: Bitmap = BitmapFactory.createBitmap("seal.m.bmp", fs.readFileSync("test/test_bitmaps/seal.m.bmp"));
        const actualDiff: Bitmap = bitmapDiffService.getDiff("test-diff4.bmp", largeSolidWhiteBitmap, modified);

        expect(Buffer.compare(bitmapWriter.getBitmapBytes(actualDiff), bitmapWriter.getBitmapBytes(expectedDiff))).to.equal(0);
    });
    it("should return a valid diff for two related images (pikachu)", () => {
        const expectedDiff: Bitmap = BitmapFactory.createBitmap("pika.diff.bmp", fs.readFileSync("test/test_bitmaps/pika.diff.bmp"));
        const original: Bitmap = BitmapFactory.createBitmap("pika.o.bmp", fs.readFileSync("test/test_bitmaps/pika.o.bmp"));
        const modified: Bitmap = BitmapFactory.createBitmap("pika.m.bmp", fs.readFileSync("test/test_bitmaps/pika.m.bmp"));
        const actualDiff: Bitmap = bitmapDiffService.getDiff("test-diff5.bmp", original, modified);

        expect(Buffer.compare(bitmapWriter.getBitmapBytes(actualDiff), bitmapWriter.getBitmapBytes(expectedDiff))).to.equal(0);
    });
});
