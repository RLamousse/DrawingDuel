export class RoomFullError extends Error {
    public static readonly ROOM_FULL_ERROR_MESSAGE: string = "Cannot join the room: it is full.";

    constructor() {
        super(RoomFullError.ROOM_FULL_ERROR_MESSAGE);
    }
}
