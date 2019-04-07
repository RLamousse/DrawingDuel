export class NoDifferenceAtPointError extends Error {
    public static readonly NO_DIFFERENCE_AT_POINT_ERROR_MESSAGE: string = "There is no difference at the specified point";

    constructor() {
        super(NoDifferenceAtPointError.NO_DIFFERENCE_AT_POINT_ERROR_MESSAGE);
    }
}

export class AlreadyFoundDifferenceError extends Error {
    public static readonly ALREADY_FOUND_DIFFERENCE_ERROR_MESSAGE: string = "Difference was already found!";

    constructor() {
        super(AlreadyFoundDifferenceError.ALREADY_FOUND_DIFFERENCE_ERROR_MESSAGE);
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

export class ScoreNotGoodEnough extends Error {
    public static readonly SCORE_NOT_GOOD_ENOUGH: string = "Your score is not good enough to deserve a place in the podium!";

    constructor() {
        super(ScoreNotGoodEnough.SCORE_NOT_GOOD_ENOUGH);
    }
}

export class Object3DIsNotADifference extends  Error {
    public static readonly OBJ_3D_NOT_A_DIFFERENCE_ERROR_MESSAGE: string = "The object is not a difference!";

    constructor(){
        super(Object3DIsNotADifference.OBJ_3D_NOT_A_DIFFERENCE_ERROR_MESSAGE);
    }
}

export class SceneGenerationError extends  Error {
    public static readonly SCENE_GENERATION_ERROR_MESSAGE: string = "An error occured when trying to render the free view games";

    constructor(){
        super(SceneGenerationError.SCENE_GENERATION_ERROR_MESSAGE);
    }
}

export class AbstractServiceError extends Error {
    public static readonly PREFIX: string = "Error in service: ";

    constructor(reason: string) {
        super(AbstractServiceError.PREFIX + reason);
    }
}
