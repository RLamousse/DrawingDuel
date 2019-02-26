export class NoDifferenceAtPointError extends Error {
    public static readonly NO_DIFFERENCE_AT_POINT_ERROR_MESSAGE: string = "There is no difference at the specified point";

    constructor() {
        super(NoDifferenceAtPointError.NO_DIFFERENCE_AT_POINT_ERROR_MESSAGE);
    }
}
