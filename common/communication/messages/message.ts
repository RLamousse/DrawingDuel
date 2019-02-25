import { SocketEvent } from "../socket-events";

export interface Message {
    title: string;
    body: string;
}

export interface WebsocketMessage<type = Object> {
    title: SocketEvent;
    body: type;
}

export function isAWebsocketMessage (object: any) {
    return (object.title !== undefined && object.body !== undefined);
}