import {format} from "date-and-time";
import {inject, injectable} from "inversify";
import {
    createWebsocketMessage,
    ChatMessage,
    ChatMessageType,
    WebsocketMessage
} from "../../../../common/communication/messages/message";
import {SocketEvent} from "../../../../common/communication/socket-events";
import {RoomNotDefinedError} from "../../../../common/errors/services.errors";
import {OnlineType} from "../../../../common/model/game/game";
import types from "../../types";
import {RadioTowerService} from "./radio-tower.service";

@injectable()
export class ChatWebsocketActionService {

    public constructor(@inject(types.RadioTowerService) private radioTower: RadioTowerService) {
    }

    private readonly _EVENT_TYPE: SocketEvent = SocketEvent.CHAT;
    private readonly _DIFF_FOUND_BASE_MESSAGE: string = " – Différence trouvée";
    private readonly _DIFF_ERROR_BASE_MESSAGE: string = " – Erreur";
    private readonly _WRONG_INPUT_FORMAT: string = " – Voici pourquoi les default existent dans les switchs.";

    private static formatTime(timestamp: Date): string {
        const date: Date = new Date(timestamp);

        return format(date, "HH:mm:ss");
    }

    public static getDisconnectionMessage(user: string): string {
        return ` – ${user} vient de se déconnecter.`;
    }

    public static getConnectionMessage(user: string): string {
        return ` – ${user} vient de se connecter.`;
    }

    private static getBestTimeMessage(data: ChatMessage): string {
        return (
            ` – ${data.playerName} obtient la ${data.position}`
            + ` place dans les meilleurs temps du jeu ${data.gameName} en ${data.playerCount}.`
        );
    }

    public sendChat(chatMessage: ChatMessage, chatRoom?: string): void {
        const message: WebsocketMessage<string> = this.generateMessage(chatMessage);
        this.handleRightEmitScope(chatMessage, message, chatRoom);
    }

    private handleRightEmitScope(input: ChatMessage, message: WebsocketMessage<string>, chatRoom?: string): void {
        switch (input.type) {
            case ChatMessageType.BEST_TIME:
                this.radioTower.broadcast(this._EVENT_TYPE, message);
                break;
            case ChatMessageType.DIFF_ERROR:
            case ChatMessageType.DIFF_FOUND:
                if (chatRoom) {
                    this.radioTower.sendToRoom(this._EVENT_TYPE, message, chatRoom);
                } else {
                    throw new RoomNotDefinedError();
                }
                break;
            default:
                this.radioTower.broadcast(this._EVENT_TYPE, message);
                break;
        }
    }

    private generateMessage(data: ChatMessage): WebsocketMessage<string> {
        let message: string = ChatWebsocketActionService.formatTime(data.timestamp);
        switch (data.type) {
            case ChatMessageType.DIFF_FOUND:
                message += (this.getDiffFoundMessage(data));
                break;
            case ChatMessageType.DIFF_ERROR:
                message += (this.getDiffErrorMessage(data));
                break;
            case ChatMessageType.BEST_TIME:
                message += (ChatWebsocketActionService.getBestTimeMessage(data));
                break;
            case ChatMessageType.CONNECTION:
                message += (ChatWebsocketActionService.getConnectionMessage(data.playerName));
                break;
            case ChatMessageType.DISCONNECTION:
                message += (ChatWebsocketActionService.getDisconnectionMessage(data.playerName));
                break;
            default:
                message += this._WRONG_INPUT_FORMAT;
                break;
        }

        return createWebsocketMessage(message);
    }

    private getDiffErrorMessage(data: ChatMessage): string {
        let message: string = this._DIFF_ERROR_BASE_MESSAGE;
        if (data.playerCount === OnlineType.MULTI) {
            message += (` par ${data.playerName}`);
        }

        return message += (".");
    }

    private getDiffFoundMessage(data: ChatMessage): string {
        let message: string = this._DIFF_FOUND_BASE_MESSAGE;
        if (data.playerCount === OnlineType.MULTI) {
            message += (` par ${data.playerName}`);
        }

        return message += (".");
    }
}
