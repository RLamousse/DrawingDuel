export enum SocketEvent {
    CONNECTION = "connection",
    DISCONNECTION = "disconnection",
    WELCOME = "welcome",
    DUMMY = "dummy",

    // Game
    SOLO_ROOM_CREATE = "solo-room-create",
    MULTI_ROOM_CREATE = "multi-room-create",
    ROOM_JOIN = "room-join",
    ROOM_ACTION = "room-action",
    ROOM_LEAVE = "room-leave",
}
