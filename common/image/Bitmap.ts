export class Bitmap {
    private static readonly rawBitmapOffsetFlagOffset: number = 0xA;
    private static readonly rawBitmapOffsetFlagLength: number = 4;
    private static readonly widthFlagOffset: number = 0x12;
    private static readonly widthFlagLength: number = 4;
    private static readonly heightFlagOffset: number = 0x16;
    private static readonly heightFlagLength: number = 4;
    private static readonly colorDepthFlagOffset: number = 0x1C;
    private static readonly colorDepthFlagLength: number = 2;
    // private static readonly rawBitmapDataLengthDepthFlagOffset: number = 0x22;
    // private static readonly rawBitmapDataLengthDepthFlagLength: number = 4;

    // private readonly _fileName: string;

    private _rawBitmapDataOffset: number;
    private _width: number;
    private _height: number;
    private _colorDepth: number;
    private _bitsPerRow: number;

    // [0][0] is bottom-left
    private _pixels: number[][];

    constructor(fileName: string, imageData: Buffer) {
        // this._fileName = fileName;

        this.parseHeader(imageData);
        this.loadBuffer(imageData);
    }


    private parseHeader(imageData: Buffer) {
        this._rawBitmapDataOffset = imageData.readUIntLE(Bitmap.rawBitmapOffsetFlagOffset, Bitmap.rawBitmapOffsetFlagLength);
        this._width = imageData.readUIntLE(Bitmap.widthFlagOffset, Bitmap.widthFlagLength);
        this._height = imageData.readUIntLE(Bitmap.heightFlagOffset, Bitmap.heightFlagLength);
        this._colorDepth = imageData.readUIntLE(Bitmap.colorDepthFlagOffset, Bitmap.colorDepthFlagLength) / 8;
        // this._rawBitmapDataLength = imageData.readUIntLE(Bitmap.rawBitmapDataLengthDepthFlagOffset, Bitmap.rawBitmapDataLengthDepthFlagLength);

        this._bitsPerRow = this._colorDepth * this._width + (this._colorDepth * this._width) % 4; // Addresses are a multiple of 4
    }

    private loadBuffer(imageData: Buffer) {
        this._pixels = [];
        for (let i = 0; i < this._height; i++) {
            this._pixels[i] = [];
            for (let j = 0; j < this._width; j++) {
                this._pixels[i][j] = imageData.readUIntLE(
                    this._rawBitmapDataOffset + (i * this._bitsPerRow) + (j * this._colorDepth),
                    this._colorDepth
                );
            }
        }
    }

    get width(): number {
        return this._width;
    }

    get height(): number {
        return this._height;
    }

    get pixels(): number[][] {
        return this._pixels;
    }
}
