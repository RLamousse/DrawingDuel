import { format } from "date-and-time";
import { injectable } from "inversify";
import * as io from "socket.io";
import { ChatMessage, ChatMessagePlayerCount, ChatMessageType, WebsocketMessage } from "../../../../common/communication/messages/message";
import { SocketEvent } from "../../../../common/communication/socket-events";
import { WebsocketActionService } from "./websocket-action.service";

@injectable()
export class ChatWebsocketActionService extends WebsocketActionService {

    private readonly _EVENT_TYPE: SocketEvent = SocketEvent.CHAT;
    private readonly _DIFF_FOUND_BASE_MESSAGE: string = " – Différence trouvée";
    private readonly _DIFF_ERROR_BASE_MESSAGE: string = " – Erreur";

    public execute(data: WebsocketMessage<ChatMessage>, socket: io.Socket): void {
        const message: WebsocketMessage<string> = this.generateMessage(data.body);
        socket.emit(this._EVENT_TYPE, message);
        if (this.shouldBroadcast(data.body)) {
            socket.broadcast.emit(this._EVENT_TYPE, message);
        }
    }

    private shouldBroadcast(data: ChatMessage): boolean {
        return data.type === ChatMessageType.BEST_TIME;
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
                break;
        }

        return {
            title: SocketEvent.CHAT,
            body: message,
        };
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
        if (data.playerCount === ChatMessagePlayerCount.MULTI) {
            message += (` par ${data.playerName}`);
        }

        return message += (".");
    }

    private getDiffFoundMessage(data: ChatMessage): string {
        let message: string = this._DIFF_FOUND_BASE_MESSAGE;
        if (data.playerCount === ChatMessagePlayerCount.MULTI) {
            message += (` par ${data.playerName}`);
        }

        return message += (".");
    }

    private formatTime(timestamp: Date): string {
        const date: Date = new Date(timestamp);

        return format(date, "HH:mm:ss");
    }
}
