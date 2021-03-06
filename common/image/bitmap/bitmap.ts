import {BITMAP_FILE_EXTENSION} from "./bitmap-utils";
import {Dimension} from "./IDimension";

export class Bitmap {
    private readonly _fileName: string;
    private readonly _width: number;
    private readonly _height: number;
    private readonly _pixels: number[][]; // [0][0] is bottom-left

    constructor(fileName: string, width: number, height: number, pixels: number[][]) {
        this._fileName = `${fileName}${fileName.endsWith(BITMAP_FILE_EXTENSION) ? "" : BITMAP_FILE_EXTENSION}`;
        this._width = width;
        this._height = height;
        this._pixels = pixels;
    }

    get fileName(): string {
        return this._fileName;
    }

    get width(): number {
        return this._width;
    }

    get height(): number {
        return this._height;
    }

    get dimension(): Dimension {
        return {
            width: this._width,
            height: this._height,
        }
    }

    get pixels(): number[][] {
        return this._pixels;
    }
}
