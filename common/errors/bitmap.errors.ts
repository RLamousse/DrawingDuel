export class InvalidSizeBitmapError extends Error {

    constructor(fileName: string) {
        super(`Error: ${fileName} bitmap file is not the right size.`);
    }
}

export class NotABitmapError extends Error {
    public static readonly NOT_A_BITMAP_MESSAGE_ERROR: string = "ERROR: buffer is not a bitmap!";

    constructor() {
        super(NotABitmapError.NOT_A_BITMAP_MESSAGE_ERROR);
    }
}

export class NotA24bppBitmapError extends Error {
    public static readonly NOT_A_24_BPP_BITMAP_MESSAGE_ERROR: string = "ERROR: Buffer is not from a 24bpp bitmap!";

    constructor() {
        super(NotA24bppBitmapError.NOT_A_24_BPP_BITMAP_MESSAGE_ERROR);
    }
}

export class IncompleteBitmapBufferError extends Error {
    public static readonly INCOMPLETE_BITMAP_MESSAGE_ERROR: string = "ERROR: Buffer is not complete!";

    constructor() {
        super(IncompleteBitmapBufferError.INCOMPLETE_BITMAP_MESSAGE_ERROR);
    }
}

export class IllegalImageFormatError extends Error {
    public static readonly ILLEGAL_IMAGE_FORMAT_MESSAGE_ERROR: string = "Error: Sent files are not in bmp format!";

    constructor() {
        super(IllegalImageFormatError.ILLEGAL_IMAGE_FORMAT_MESSAGE_ERROR);
    }
}
