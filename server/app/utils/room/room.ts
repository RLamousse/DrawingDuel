import {Socket} from "socket.io";

export interface IRoomEvent {
}

export enum RoomType {
    SOLO,
    MULTI,
}

export interface IRoom {
    join(gameName: string, client: Socket): void;

    interact(event: IRoomEvent, client: Socket): void;
}
