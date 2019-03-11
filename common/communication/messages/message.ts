import { SocketEvent } from "../socket-events";

export interface Message {
    title: string;
    body: string;
}

export interface WebsocketMessage {
    title: SocketEvent;
    body: Object;
}

export enum ChatMessagePosition {
    FIRST = "première", SECOND = "deuxième" , THIRD = "troisième"
}

export enum ChatMessagePlayerCount {
    SOLO = "solo", MULTI = "un contre un"
}
export interface ChatMessage {
    timestamp: Date;
    playerName: string;
    gameName: string;
    position: ChatMessagePosition;
    playerCount: ChatMessagePlayerCount;
}

export function isAWebsocketMessage (object: any) {
    return (object.title !== undefined && object.body !== undefined);
}