import { injectable } from "inversify";
import * as io from "socket.io";
import { ChatMessage, WebsocketMessage, ChatMessageType, ChatMessagePlayerCount } from "../../../../common/communication/messages/message";
import { SocketEvent } from "../../../../common/communication/socket-events";
import { WebsocketActionService } from "./websocket-action.service";

/**
 * This is supposed to be an example/test socket service
 * (as can be deducted from the very static message it answers with)
 */
@injectable()
export class ChatWebsocketActionService extends WebsocketActionService {

    private readonly _EVENT_TYPE: SocketEvent = SocketEvent.CHAT;
    private readonly _DIFF_FOUND_BASE_MESSAGE: string = " – Différence trouvée";
    private readonly _DIFF_ERROR_BASE_MESSAGE: string = " – Erreur";

    public execute(data: WebsocketMessage<ChatMessage>, socket: io.Socket): void {
        const message: WebsocketMessage = {
            title: SocketEvent.CHAT,
            body: this.generateMessage(data.body),
        }
        socket.emit(this._EVENT_TYPE, message);
    }

    private generateMessage(data: ChatMessage): WebsocketMessage<string> {
        const message: string = this.formatTime(data.timestamp);
        // TODO: Change to a map
        switch (data.type) {
            case ChatMessageType.DIFF_FOUND:
                message.concat(this.getDiffFoundMessage(data));
                break;
            case ChatMessageType.DIFF_ERROR:
                message.concat(this.getDiffErrorMessage(data));
                break;
            case ChatMessageType.BEST_TIME:
                message.concat(this.getBestTimeMessage(data));
                break;
            case ChatMessageType.CONNECTION:
                message.concat(this.getConnectionMessage(data));
                break;
            case ChatMessageType.DISCONNECTION:
                message.concat(this.getDisconnectionMessage(data));
                break;
            default:
                break;
        }

        return {
            title: SocketEvent.CHAT,
            body: message,
        };
    }
    private getDisconnectionMessage(data: ChatMessage): string {
        return ` – ${data.playerName} vient de se déconnecter.`;
    }

    private getConnectionMessage(data: ChatMessage): string {
        return ` – ${data.playerName} vient de se connecter.`;
    }

    private getBestTimeMessage(data: ChatMessage): string {
        return (
            ` – ${data.playerName} obtient la ${data.position}` 
            + ` place dans les meilleurs temps du jeu ${data.gameName} en ${data.playerCount}.`
        );
    }

    private getDiffErrorMessage(data: ChatMessage): string {
        const message: string = this._DIFF_ERROR_BASE_MESSAGE;
        if (data.playerCount === ChatMessagePlayerCount.MULTI) {
            message.concat(` par ${data.playerName}`);
        }

        return message.concat(".");
    }

    private getDiffFoundMessage(data: ChatMessage): string {
        const message: string = this._DIFF_FOUND_BASE_MESSAGE;
        if (data.playerCount === ChatMessagePlayerCount.MULTI) {
            message.concat(` par ${data.playerName}`);
        }

        return message.concat(".");
    }

    private formatTime(timestamp: Date): string {
        return `${timestamp.getHours()}:${timestamp.getMinutes()}:${timestamp.getSeconds()}`;
    }
}
