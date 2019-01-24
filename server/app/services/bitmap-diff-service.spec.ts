import { expect } from "chai";
import * as fs from "fs";
import {Bitmap} from "../../../common/image/Bitmap";
import {BitmapDiffService} from "./bitmap-diff.service";

const bitmapDiffService: BitmapDiffService = new BitmapDiffService();
const smallSolidWhiteBitmap: Bitmap = new Bitmap("white10x10.bmp", fs.readFileSync("test/test_bitmaps/white10x10.bmp"));
const largeSolidWhiteBitmap: Bitmap = new Bitmap("white640x480.bmp", fs.readFileSync("test/test_bitmaps/white640x480.bmp"));

describe("A service generating the difference between two bitmaps", () => {
     it("should throw if the two images are not of the same dimensions", () => {
         expect(() => bitmapDiffService.getDiff(smallSolidWhiteBitmap, largeSolidWhiteBitmap)).to.throw();
    });
});
