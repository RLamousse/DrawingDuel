export class Bitmap {
    get fileName(): string {
        return this._fileName;
    }

    get imageData(): Buffer {
        return this._imageData;
    }

    private readonly _fileName: string;
    private readonly _imageData: Buffer;

    constructor(fileName: string, imageData: Buffer) {
        this._fileName = fileName;
        this._imageData = imageData;
    }
}
