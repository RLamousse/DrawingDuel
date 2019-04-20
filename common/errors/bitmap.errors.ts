export class InvalidSizeBitmapError extends Error {

    constructor(fileName: string) {
        super(`ERREUR: le bitmap ${fileName} n'a pas la bonne taille.`);
    }
}

export class NotABitmapError extends Error {
    public static readonly NOT_A_BITMAP_MESSAGE_ERROR: string = "ERREUR: donnée entrée n'est pas un bitmap!";

    constructor() {
        super(NotABitmapError.NOT_A_BITMAP_MESSAGE_ERROR);
    }
}

export class NotA24bppBitmapError extends Error {
    public static readonly NOT_A_24_BPP_BITMAP_MESSAGE_ERROR: string = "ERREUR: donnée entrée n'est pas un bitmap 24bpp!";

    constructor() {
        super(NotA24bppBitmapError.NOT_A_24_BPP_BITMAP_MESSAGE_ERROR);
    }
}

export class IncompleteBitmapBufferError extends Error {
    public static readonly INCOMPLETE_BITMAP_MESSAGE_ERROR: string = "ERREUR: donnée incomplète!";

    constructor() {
        super(IncompleteBitmapBufferError.INCOMPLETE_BITMAP_MESSAGE_ERROR);
    }
}

export class IllegalImageFormatError extends Error {
    public static readonly ILLEGAL_IMAGE_FORMAT_MESSAGE_ERROR: string = "ERREUR: Les fichiers envoyés ne sont pas au format BMP!";

    constructor() {
        super(IllegalImageFormatError.ILLEGAL_IMAGE_FORMAT_MESSAGE_ERROR);
    }
}
