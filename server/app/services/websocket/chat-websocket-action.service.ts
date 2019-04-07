import {format} from "date-and-time";
import {injectable} from "inversify";
import {Socket} from "socket.io";
import {
    createWebsocketMessage,
    ChatMessage,
    ChatMessageType,
    WebsocketMessage
} from "../../../../common/communication/messages/message";
import {SocketEvent} from "../../../../common/communication/socket-events";
import {OnlineType} from "../../../../common/model/game/game";
import {WebsocketActionService} from "./websocket-action.service";

@injectable()
export class ChatWebsocketActionService extends WebsocketActionService {

    private readonly _EVENT_TYPE: SocketEvent = SocketEvent.CHAT;
    private readonly _DIFF_FOUND_BASE_MESSAGE: string = " – Différence trouvée";
    private readonly _DIFF_ERROR_BASE_MESSAGE: string = " – Erreur";
    private readonly _WRONG_INPUT_FORMAT: string = " – Voici pourquoi les default existent dans les switchs.";

    public execute(data: WebsocketMessage<ChatMessage>, socket: Socket): void {
        const message: WebsocketMessage<string> = this.generateMessage(data.body);
        socket.emit(this._EVENT_TYPE, message);
    }

    private generateMessage(data: ChatMessage): WebsocketMessage<string> {
        let message: string = this.formatTime(data.timestamp);
        switch (data.type) {
            case ChatMessageType.DIFF_FOUND:
                message += (this.getDiffFoundMessage(data));
                break;
            case ChatMessageType.DIFF_ERROR:
                message += (this.getDiffErrorMessage(data));
                break;
            case ChatMessageType.BEST_TIME:
                message += (this.getBestTimeMessage(data));
                break;
            case ChatMessageType.CONNECTION:
                message += (this.getConnectionMessage(data.playerName));
                break;
            case ChatMessageType.DISCONNECTION:
                message += (this.getDisconnectionMessage(data.playerName));
                break;
            default:
                message += this._WRONG_INPUT_FORMAT;
                break;
        }

        return createWebsocketMessage(message);
    }

    public getDisconnectionMessage(user: string): string {
        return ` – ${user} vient de se déconnecter.`;
    }

    public getConnectionMessage(user: string): string {
        return ` – ${user} vient de se connecter.`;
    }

    private getBestTimeMessage(data: ChatMessage): string {
        return (
            ` – ${data.playerName} obtient la ${data.position}`
            + ` place dans les meilleurs temps du jeu ${data.gameName} en ${data.playerCount}.`
        );
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

    private formatTime(timestamp: Date): string {
        const date: Date = new Date(timestamp);

        return format(date, "HH:mm:ss");
    }
}
