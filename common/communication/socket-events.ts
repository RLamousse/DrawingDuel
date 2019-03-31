export enum SocketEvent {
    CONNECTION = "connection",
    DISCONNECT = "disconnect",
    USER_DISCONNECTION = "user_disconnection",
    USER_CONNECTION = "user_connection",
    WELCOME = "welcome",
    DELETE = "delete",
    UPDATE_SCORE = "update-score",
    DUMMY = "dummy",
    CHAT = "chat",
    USERNAME_CHECK = "username-check",

    // Rooms
    CREATE = "room-create",
    FETCH = "room-fetch",
    CHECK_IN = "room-check-in",
    INTERACT = "room-interact",
    CHECK_OUT = "room-check-out",
    READY = "room-ready",
}
