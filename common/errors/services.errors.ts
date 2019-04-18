export class NoDifferenceAtPointError extends Error {
    public static readonly NO_DIFFERENCE_AT_POINT_ERROR_MESSAGE: string = "ERREUR: il n'y a pas de difference ici!";

    constructor() {
        super(NoDifferenceAtPointError.NO_DIFFERENCE_AT_POINT_ERROR_MESSAGE);
    }
}

export class AlreadyFoundDifferenceError extends Error {
    public static readonly ALREADY_FOUND_DIFFERENCE_ERROR_MESSAGE: string = "ERREUR: cette différence a déjà été trouvée!";

    constructor() {
        super(AlreadyFoundDifferenceError.ALREADY_FOUND_DIFFERENCE_ERROR_MESSAGE);
    }
}

export class IllegalArgumentError extends Error {
    public static readonly ARGUMENT_ERROR_MESSAGE: string = "ERREUR: le paramètre a le mauvais format!";

    constructor() {
        super(IllegalArgumentError.ARGUMENT_ERROR_MESSAGE);
    }
}

export class EmptyArrayError extends Error {
    public static readonly EMPTY_ARRAY_ERROR_MESSAGE: string = "ERREUR: le tableau est vide!";

    constructor() {
        super(EmptyArrayError.EMPTY_ARRAY_ERROR_MESSAGE);
    }
}

export class InvalidPointError extends Error {
    public static readonly INVALID_POINT_ERROR_MESSAGE: string = "ERREUR: Point invalide: hors des limites";

    constructor() {
        super(InvalidPointError.INVALID_POINT_ERROR_MESSAGE);
    }
}

export class DifferenceCountError extends Error {
    public static readonly DIFFERENCE_COUNT_ERROR_MESSAGE: string = "ERREUR: Il n'y a pas 7 différences entre ces deux images!";

    constructor() {
        super(DifferenceCountError.DIFFERENCE_COUNT_ERROR_MESSAGE);
    }
}

export class ImageUploadServiceError extends Error {
    public static readonly IMAGE_UPLOAD_ERROR_MESSAGE: string = "ERREUR: L'image n'a pas pu être téléchargée!";

    constructor() {
        super(ImageUploadServiceError.IMAGE_UPLOAD_ERROR_MESSAGE);
    }
}

export class ImageDimensionsMismatchError extends Error {
    public static readonly IMAGE_DIMENSIONS_MISMATCH_ERROR_MESSAGE: string = "ERREUR: Génération de différences impossible car les deux images n'ont pas la même dimension";

    constructor() {
        super(ImageDimensionsMismatchError.IMAGE_DIMENSIONS_MISMATCH_ERROR_MESSAGE);
    }
}

export class ScoreNotGoodEnough extends Error {
    public static readonly SCORE_NOT_GOOD_ENOUGH: string = "ERREUR: Ton score n'est pas assez bon pour mériter une place sur le podium!";

    constructor() {
        super(ScoreNotGoodEnough.SCORE_NOT_GOOD_ENOUGH);
    }
}

export class Object3DIsNotADifference extends  Error {
    public static readonly OBJ_3D_NOT_A_DIFFERENCE_ERROR_MESSAGE: string = "ERREUR: Cet objet n'est pas une différence!";

    constructor(){
        super(Object3DIsNotADifference.OBJ_3D_NOT_A_DIFFERENCE_ERROR_MESSAGE);
    }
}

export class AbstractServiceError extends Error {
    public static readonly PREFIX: string = "Erreur dans le service: ";

    constructor(reason: string) {
        super(AbstractServiceError.PREFIX + reason);
    }
}
