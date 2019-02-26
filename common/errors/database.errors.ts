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

