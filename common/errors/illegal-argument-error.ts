export default class IllegalArgumentError extends Error {
    public constructor(message: string) {
        super(message);
    }
}
