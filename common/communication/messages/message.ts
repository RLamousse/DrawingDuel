import { SocketEvent } from "../socket-events";
import {IRecordTime} from "../../model/game/record-time";
import {OnlineType} from "../../model/game/game";

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
    playerCount: OnlineType;
}

export interface UpdateScoreMessage {
    newTime: IRecordTime;
    gameName: string;
    onlineType: OnlineType;
}

export function isAWebsocketMessage (object: any) {
    return (object.title !== undefined && object.body !== undefined);
}
