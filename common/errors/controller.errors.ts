export class RequestFormatError extends Error {
    public static readonly FORMAT_ERROR_MESSAGE: string = "Error: Request sent by the client had the wrong format!";

    constructor() {
        super(RequestFormatError.FORMAT_ERROR_MESSAGE);
    }
}

export class EmptyResponseError extends Error {
    public static readonly EMPTY_RESPONSE_ERROR_MESSAGE: string = "Error: the response is empty!";

    constructor() {
        super(EmptyResponseError.EMPTY_RESPONSE_ERROR_MESSAGE);
    }
}

export class NoUsernameInRequestError extends Error {
    public static readonly NO_USERNAME_IN_REQUEST_ERROR_MESSAGE: string = "Error: no username was included in the request";

    constructor() {
        super(NoUsernameInRequestError.NO_USERNAME_IN_REQUEST_ERROR_MESSAGE);
    }
}
