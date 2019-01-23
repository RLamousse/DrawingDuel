export class Bitmap {
    private readonly _fileName: string;
    private readonly _imageData: Buffer;
    private _width: number;
    private _height: number;
    private _colorDepth: number;
    private _rawBitmapDataLength: number;

    constructor(fileName: string, imageData: Buffer) {
        this._fileName = fileName;

        this.parseHeader(imageData);
        this.loadBuffer(imageData);
    }


    private parseHeader(imageData: Buffer) {
        // TODO: Consts for magic numbers
        this._width = imageData.readUIntLE(0x12, 4);
        this._height = imageData.readUIntLE(0x16, 4);
        this._colorDepth = imageData.readUIntLE(0x1C, 2);
        this._rawBitmapDataLength = imageData.readUIntLE(0x22, 4);
    }

    private loadBuffer(imageData: Buffer) {

    }

    get fileName(): string {
        return this._fileName;
    }

    get imageData(): Buffer {
        return this._imageData;
    }

    get width(): number {
        return this._width;
    }

    get height(): number {
        return this._height;
    }

    get colorDepth(): number {
        return this._colorDepth;
    }

    get rawBitmapDataLength(): number {
        return this._rawBitmapDataLength;
    }
}
