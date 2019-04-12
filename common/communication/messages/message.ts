import {IInteractionData} from "../../model/rooms/interaction";
import {IRecordTime} from "../../model/game/record-time";
import {OnlineType} from "../../model/game/game";

export interface Message {
    title: string;
    body: string;
}

export interface WebsocketMessage<type = Object> {
    body: type;
}

export enum ChatMessagePosition {
    FIRST = "première",
    SECOND = "deuxième",
    THIRD = "troisième",
    NA = "NA",
}

export enum PlayerCountMessage {
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
    playerCount: OnlineType;
}

export interface UpdateScoreMessage {
    newTime: IRecordTime;
    gameName: string;
    onlineType: OnlineType;
}

export interface RoomMessage {
}

export interface RoomCreationMessage extends RoomMessage {
    gameName: string;
    playerCount: OnlineType;
    username: string;
}

export interface RoomCheckInMessage extends RoomMessage {
    gameName: string;
    username: string;
}

export interface RoomInteractionMessage<T extends IInteractionData> extends RoomMessage {
    interactionData: T;
}

export const isAWebsocketMessage: (object: any) => boolean =
    (object: any) => (object.title !== undefined && object.body !== undefined);

export const createWebsocketMessage: <T>(data?: T) => WebsocketMessage<T> = <T>(data?: T) => {
    return {
        body: data,
    } as WebsocketMessage<T>;
};
