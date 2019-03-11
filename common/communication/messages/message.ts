import { SocketEvent } from "../socket-events";

export interface Message {
    title: string;
    body: string;
}

export interface WebsocketMessage<type = Object> {
    title: SocketEvent;
    body: type;
}

export enum ChatMessagePosition {
    FIRST = "première",
    SECOND = "deuxième",
    THIRD = "troisième"
}

export enum ChatMessagePlayerCount {
    SOLO = "solo",
    MULTI = "un contre un"
}

export enum ChatMessageType {
    DIFF_FOUND,
    DIFF_ERROR,
    BEST_TIME,
    CONNECTION,
    DISCONNECTION
}

export interface ChatMessage {
    type: ChatMessageType;
    timestamp: Date;
    playerName: string;
    gameName: string;
    position: ChatMessagePosition;
    playerCount: ChatMessagePlayerCount;
}

export function isAWebsocketMessage (object: any) {
    return (object.title !== undefined && object.body !== undefined);
}