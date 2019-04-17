export class DatabaseError extends Error {
    public static readonly DATA_BASE_MESSAGE_ERROR: string = "ERREUR: un problème est survenu avec la base de données!";

    constructor() {
        super(DatabaseError.DATA_BASE_MESSAGE_ERROR);
    }
}

export class EmptyIdError extends Error {
    public static readonly EMPTY_ID_ERROR_MESSAGE: string = "ERREUR: L'ID est vide!";

    constructor() {
        super(EmptyIdError.EMPTY_ID_ERROR_MESSAGE);
    }
}

export class NonExistentGameError extends Error {
    public static readonly NON_EXISTENT_GAME_ERROR_MESSAGE: string = "ERREUR: cette partie n'existe pas!";

    constructor() {
        super(NonExistentGameError.NON_EXISTENT_GAME_ERROR_MESSAGE);
    }
}

export class AlreadyExistentGameError extends Error {
    public static readonly ALREADY_EXISTENT_GAME_ERROR_MESSAGE: string = "ERREUR: Le nom de partie que vous avez rentré existe déjà!";

    constructor() {
        super(AlreadyExistentGameError.ALREADY_EXISTENT_GAME_ERROR_MESSAGE);
    }
}

export class InvalidGameError extends Error {
    public static readonly GAME_FORMAT_ERROR_MESSAGE: string = "ERREUR: la partie a le mauvais format!";

    constructor() {
        super(InvalidGameError.GAME_FORMAT_ERROR_MESSAGE);
    }
}

export class InvalidGameInfoError extends Error {
    public static readonly GAME_INFO_FORMAT_ERROR_MESSAGE: string = "ERREUR: les nouveaux attributs de la partie ont le mauvais format!";

    constructor() {
        super(InvalidGameInfoError.GAME_INFO_FORMAT_ERROR_MESSAGE);
    }
}

export class NonExistentUserError extends Error {
    public static readonly NON_EXISTENT_USER_ERROR_MESSAGE: string = "ERREUR: ce nom d'utilisateur n'existe pas!";

    constructor() {
        super(NonExistentUserError.NON_EXISTENT_USER_ERROR_MESSAGE);
    }
}

export class AlreadyExistentUserError extends Error {
    public static readonly ALREADY_EXISTENT_USER_ERROR_MESSAGE: string = "ERREUR: ce nom d'utilisateur existe déjà!";

    constructor() {
        super(AlreadyExistentUserError.ALREADY_EXISTENT_USER_ERROR_MESSAGE);
    }
}

export class NoElementFoundError extends Error {
    public static readonly NO_ELEMENT_FOUND_ERROR_MESSAGE: string = "ERREUR: la requete n'a pas abouti, rien a été trouvé!";

    constructor() {
        super(NoElementFoundError.NO_ELEMENT_FOUND_ERROR_MESSAGE);
    }
}

export class AbstractDataBaseError extends Error {
    public static readonly PREFIX: string = "Erreur de base de données: ";

    constructor(message: string) {
        super(AbstractDataBaseError.PREFIX + message);
    }
}
