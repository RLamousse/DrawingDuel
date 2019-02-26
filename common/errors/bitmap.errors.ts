export class InvalidSizeBitmapError extends Error {

    constructor(fileName: string) {
        super(`Error: ${fileName} bitmap file is not the right size.`);
    }
}
