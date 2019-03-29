import {IInteractionData} from "../../model/rooms/interaction";
import { SocketEvent } from "../socket-events";
import {IRecordTime} from "../../model/game/record-time";

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
    THIRD = "troisième",
    NA = "NA",
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

export interface UpdateScoreMessage {
    newTime: IRecordTime;
    gameName: string;
    isSolo: boolean;
}

export interface RoomMessage {
    gameName: string;
}

export interface RoomCreationMessage extends RoomMessage {
    playerCount: number;
}

export interface RoomInteractionMessage extends RoomMessage {
    interactionData: IInteractionData;
}

export function isAWebsocketMessage (object: any) {
    return (object.title !== undefined && object.body !== undefined);
}
