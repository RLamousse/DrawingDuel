export enum SocketEvent {
    DISCONNECT_USER = "disconnect-user",
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

    // ╔═══════╗
    // ║ Rooms ║
    // ╚═══════╝
    // Client events
    CREATE = "room-create",
    FETCH = "room-fetch",
    CHECK_IN = "room-check-in",
    INTERACT = "room-interact",
    INTERACT_ERROR = "room-interact-error",
    CHECK_OUT = "room-check-out",
    // Server events
    READY = "room-ready",
    ROOM_ERROR = "room-error",
    PUSH_ROOMS = "room-push",
    KICK = "room-kick"
}
