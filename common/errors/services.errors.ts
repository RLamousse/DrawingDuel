export class NoDifferenceAtPointError extends Error {
    public static readonly NO_DIFFERENCE_AT_POINT_ERROR_MESSAGE: string = "There is no difference at the specified point";

    constructor() {
        super(NoDifferenceAtPointError.NO_DIFFERENCE_AT_POINT_ERROR_MESSAGE);
    }
}

export class IllegalArgumentError extends Error {
    public static readonly ARGUMENT_ERROR_MESSAGE: string = "Error: the argument has the wrong format!";

    constructor() {
        super(IllegalArgumentError.ARGUMENT_ERROR_MESSAGE);
    }
}

export class EmptyArrayError extends Error {
    public static readonly EMPTY_ARRAY_ERROR_MESSAGE: string = "Error: the given array is empty!";

    constructor() {
        super(EmptyArrayError.EMPTY_ARRAY_ERROR_MESSAGE);
    }
}

export class InvalidPointError extends Error {
    public static readonly INVALID_POINT_ERROR_MESSAGE: string = "Invalid point: out of bounds";

    constructor() {
        super(InvalidPointError.INVALID_POINT_ERROR_MESSAGE);
    }
}

export class DifferenceCountError extends Error {
    public static readonly DIFFERENCE_COUNT_ERROR_MESSAGE: string = "Error: The data that you sent doesn't have seven differences!";

    constructor() {
        super(DifferenceCountError.DIFFERENCE_COUNT_ERROR_MESSAGE);
    }
}

export class ImageUploadServiceError extends Error {
    public static readonly IMAGE_UPLOAD_ERROR_MESSAGE: string = "Error: The image cannot be uploaded!";

    constructor() {
        super(ImageUploadServiceError.IMAGE_UPLOAD_ERROR_MESSAGE);
    }
}

export class ImageDimensionsMismatchError extends Error {
    public static readonly IMAGE_DIMENSIONS_MISMATCH_ERROR_MESSAGE: string = "Cannot generate the difference if the images does not have the same dimensions";

    constructor() {
        super(ImageDimensionsMismatchError.IMAGE_DIMENSIONS_MISMATCH_ERROR_MESSAGE);
    }
}
