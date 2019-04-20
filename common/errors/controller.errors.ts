export class RequestFormatError extends Error {
    public static readonly FORMAT_ERROR_MESSAGE: string = "ERREUR: La requete du client a le mauvais format!";

    constructor() {
        super(RequestFormatError.FORMAT_ERROR_MESSAGE);
    }
}

export class NoUsernameInRequestError extends Error {
    public static readonly NO_USERNAME_IN_REQUEST_ERROR_MESSAGE: string = "ERREUR: il manque nom d'utilisateur dans la requete";

    constructor() {
        super(NoUsernameInRequestError.NO_USERNAME_IN_REQUEST_ERROR_MESSAGE);
    }
}
