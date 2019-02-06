import * as assert from "assert";
import {expect} from "chai";
import * as fs from "fs";
import * as mockfs from "mock-fs";
import * as os from "os";
import {Bitmap} from "../../../../common/image/bitmap/bitmap";
import {BitmapFactory} from "./bitmap-factory";
import {BitmapWriter} from "./bitmap-writer";

const bitmapWriter: BitmapWriter = new BitmapWriter();
describe("A util class to write bitmaps to disk", () => {
    it("should return a valid buffer for a given 10x10 white bitmap", () => {
        const originalBuffer: Buffer = fs.readFileSync("test/test_bitmaps/white10x10.bmp");
        const originalBitmap: Bitmap = BitmapFactory.createBitmap("test-white10x10.bmp", originalBuffer);
        const bitmapWriterBytes: Buffer = bitmapWriter.getBitmapBytes(originalBitmap);
        expect(Buffer.compare(originalBuffer, bitmapWriterBytes)).to.equal(0);
    });
    it("should return a valid buffer for a given 10x10 gradient bitmap", () => {
        const originalBuffer: Buffer = fs.readFileSync("test/test_bitmaps/gradient10x10.bmp");
        const originalBitmap: Bitmap = BitmapFactory.createBitmap("test-gradient10x10.bmp", originalBuffer);
        const bitmapWriterBytes: Buffer = bitmapWriter.getBitmapBytes(originalBitmap);
        expect(Buffer.compare(originalBuffer, bitmapWriterBytes)).to.equal(0);
    });
    it("should return a valid buffer for a given 640x480 bitmap", () => {
        const originalBuffer: Buffer = fs.readFileSync("test/test_bitmaps/white640x480.bmp");
        const originalBitmap: Bitmap = BitmapFactory.createBitmap("test-white640x480.bmp", originalBuffer);
        const bitmapWriterBytes: Buffer = bitmapWriter.getBitmapBytes(originalBitmap);
        expect(Buffer.compare(originalBuffer, bitmapWriterBytes)).to.equal(0);
    });
    it("should write the bitmap object to the specified directory", () => {
        // Read real bitmap from fs
        const originalBuffer: Buffer = fs.readFileSync("test/test_bitmaps/white10x10.bmp");
        const originalBitmap: Bitmap = BitmapFactory.createBitmap("test-white10x10.bmp", originalBuffer);
        // Init
        mockfs();
        // Write to mock-fs
        const path: string = bitmapWriter.write(originalBitmap, os.tmpdir());
        assert(fs.existsSync(path));
        mockfs.restore(); // Restore mock fs to original state
    });
    it("should throw if the specified directory doesn't exist", () => {
        // Read real bitmap from fs
        const originalBuffer: Buffer = fs.readFileSync("test/test_bitmaps/white10x10.bmp");
        const originalBitmap: Bitmap = BitmapFactory.createBitmap("test-white10x10.bmp", originalBuffer);
        // Init
        mockfs();
        // Write to mock-fs
        expect(() => bitmapWriter.write(originalBitmap, "/myFakeDir/")).to.throw();
        mockfs.restore(); // Restore mock fs to original state
    });
});
