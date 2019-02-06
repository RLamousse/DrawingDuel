// tslint:disable:no-magic-numbers
import {expect} from "chai";
import * as fs from "fs";
import {instance, mock, when} from "ts-mockito";
import {Bitmap} from "../../../../common/image/bitmap/bitmap";
import {create2dArray} from "../../../../common/util/util";
import {BitmapFactory} from "./bitmap-factory";

describe("A util class to create Bitmap objects", () => {
    it("should create a bitmap file from a valid 10x10 24bpp buffer", () => {
        const originalBuffer: Buffer = fs.readFileSync("test/test_bitmaps/white10x10.bmp");
        const bitmap: Bitmap = BitmapFactory.createBitmap("test-factory1.bmp", originalBuffer);
        const mockedBitmap: Bitmap = mock(Bitmap);

        when(mockedBitmap.fileName).thenReturn("test-factory1.bmp");
        when(mockedBitmap.width).thenReturn(10);
        when(mockedBitmap.height).thenReturn(10);
        when(mockedBitmap.pixels).thenReturn(create2dArray(10, 10, 0xFFFFFF));

        const bitmapInstance: Bitmap = instance(mockedBitmap);
        expect(bitmap.fileName).to.equal(bitmapInstance.fileName);
        expect(bitmap.width).to.equal(bitmapInstance.width);
        expect(bitmap.height).to.equal(bitmapInstance.height);
        expect(bitmap.pixels).to.deep.equal(bitmapInstance.pixels);
    });
    it("should create a bitmap file from a valid 640x480 24bpp buffer", () => {
        const originalBuffer: Buffer = fs.readFileSync("test/test_bitmaps/white640x480.bmp");
        const bitmap: Bitmap = BitmapFactory.createBitmap("test-factory1.bmp", originalBuffer);
        const mockedBitmap: Bitmap = mock(Bitmap);

        when(mockedBitmap.fileName).thenReturn("test-factory1.bmp");
        when(mockedBitmap.width).thenReturn(640);
        when(mockedBitmap.height).thenReturn(480);
        when(mockedBitmap.pixels).thenReturn(create2dArray(640, 480, 0xFFFFFF));

        const bitmapInstance: Bitmap = instance(mockedBitmap);
        expect(bitmap.fileName).to.equal(bitmapInstance.fileName);
        expect(bitmap.width).to.equal(bitmapInstance.width);
        expect(bitmap.height).to.equal(bitmapInstance.height);
        expect(bitmap.pixels).to.deep.equal(bitmapInstance.pixels);
    });
    it("should throw if the specified buffer is not a bitmap", () => {
        const originalBuffer: Buffer = fs.readFileSync("test/test_bitmaps/not-a-bitmap.bmp");
        expect(() => BitmapFactory.createBitmap("test-factory2.bmp", originalBuffer)).to.throw("Buffer is not a bitmap");
    });
    it("should throw if the specified bitmap buffer is not 24bpp", () => {
        const originalBuffer: Buffer = fs.readFileSync("test/test_bitmaps/32bpp640x480.bmp");
        expect(() => BitmapFactory.createBitmap("test-factory3.bmp", originalBuffer)).to.throw("Buffer is not from a 24bpp bitmap");
    });
    it("should throw if the specified bitmap buffer is not complete", () => {
        const originalBuffer: Buffer = fs.readFileSync("test/test_bitmaps/incomplete.bmp");
        expect(() => BitmapFactory.createBitmap("test-factory4.bmp", originalBuffer)).to.throw("Buffer is not complete");
    });
    it("should create a valid bitmap with extra padding before EOF", () => {
        const originalBuffer: Buffer = fs.readFileSync("test/test_bitmaps/black10x10-extra-padding.bmp");
        const bitmap: Bitmap = BitmapFactory.createBitmap("test-factory5.bmp", originalBuffer);
        const mockedBitmap: Bitmap = mock(Bitmap);

        when(mockedBitmap.fileName).thenReturn("test-factory5.bmp");
        when(mockedBitmap.width).thenReturn(10);
        when(mockedBitmap.height).thenReturn(10);
        when(mockedBitmap.pixels).thenReturn(create2dArray(10, 10, 0x0));

        const bitmapInstance: Bitmap = instance(mockedBitmap);
        expect(bitmap.fileName).to.equal(bitmapInstance.fileName);
        expect(bitmap.width).to.equal(bitmapInstance.width);
        expect(bitmap.height).to.equal(bitmapInstance.height);
        expect(bitmap.pixels).to.deep.equal(bitmapInstance.pixels);
    });
});
