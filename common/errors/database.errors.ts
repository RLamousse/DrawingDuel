export class DatabaseError extends Error {
    public static readonly DATA_BASE_MESSAGE_ERROR: string = "ERROR: something went wrong with the database!";

    constructor() {
        super(DatabaseError.DATA_BASE_MESSAGE_ERROR);
    }
}

export class EmptyIdError extends Error {
    public static readonly EMPTY_ID_ERROR_MESSAGE: string = "ERROR: Specified ID is empty!";

    constructor() {
        super(EmptyIdError.EMPTY_ID_ERROR_MESSAGE);
    }
}

export class NonExistentGameError extends Error {
    public static readonly NON_EXISTENT_GAME_ERROR_MESSAGE: string = "ERROR: the specified game does not exist!";

    constructor() {
        super(NonExistentGameError.NON_EXISTENT_GAME_ERROR_MESSAGE);
    }
}

export class AlreadyExistentGameError extends Error {
    public static readonly ALREADY_EXISTENT_GAME_ERROR_MESSAGE: string = "Error: The game name that you sent already exists!";

    constructor() {
        super(AlreadyExistentGameError.ALREADY_EXISTENT_GAME_ERROR_MESSAGE);
    }
}

export class NonExistentThemeError extends Error {
    public static readonly NON_EXISTING_THEME_ERROR_MESSAGE: string = "ERROR: The theme is not supported yet!";

    constructor() {
        super(NonExistentThemeError.NON_EXISTING_THEME_ERROR_MESSAGE);
    }
}

export class InvalidGameError extends Error {
    public static readonly GAME_FORMAT_ERROR_MESSAGE: string = "ERROR: the game has the wrong format!";

    constructor() {
        super(InvalidGameError.GAME_FORMAT_ERROR_MESSAGE);
    }
}

export class NonExistentUserError extends Error {
    public static readonly NON_EXISTENT_USER_ERROR_MESSAGE: string = "ERROR: the specified username does no exist!";

    constructor() {
        super(NonExistentUserError.NON_EXISTENT_USER_ERROR_MESSAGE);
    }
}

export class AlreadyExistentUserError extends Error {
    public static readonly ALREADY_EXISTENT_USER_ERROR_MESSAGE: string = "ERROR: the specified username already exists!";

    constructor() {
        super(AlreadyExistentUserError.ALREADY_EXISTENT_USER_ERROR_MESSAGE);
    }
}
