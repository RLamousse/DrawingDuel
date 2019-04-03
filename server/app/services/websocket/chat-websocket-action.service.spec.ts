import { expect } from "chai";
import {
    createWebsocketMessage, ChatMessage,
    PlayerCountMessage, ChatMessagePosition, ChatMessageType,
    WebsocketMessage
} from "../../../../common/communication/messages/message";
import { SocketEvent } from "../../../../common/communication/socket-events";
import { ChatWebsocketActionService } from "./chat-websocket-action.service";

class Socket {
    public constructor () {
        this.emitValue = "";
        this.eventValue = "";
    }
    public eventValue: string;
    public emitValue: string;
    public emit(event: string, message: WebsocketMessage<string>): void {
        this.eventValue = event;
        this.emitValue = message.body;
    }
}

describe("ChatWebsocketActionService", () => {

    let service: ChatWebsocketActionService;
    let socket: Socket;
    beforeEach(() => {
        service = new ChatWebsocketActionService();
        socket = new Socket();
        // Private member access
        // tslint:disable-next-line: no-any
        (service as any).formatTime = () => {
            return "12:51:46";
        };
    });

    it("should emit an appropriate connection message on socket connection", () => {
        const message: WebsocketMessage<ChatMessage> = createWebsocketMessage(
            {
                gameName: "",
                playerCount: PlayerCountMessage.SOLO,
                playerName: "Maxime",
                position: ChatMessagePosition.NA,
                timestamp: new Date("Sat Mar 23 2019 13:51:46 GMT-0400 (Eastern Daylight Time)"),
                type: ChatMessageType.CONNECTION,
            });

        service.execute(message, socket as unknown as SocketIO.Socket);
        expect(socket.eventValue).to.equal(SocketEvent.CHAT);
        expect(socket.emitValue).to.equal("12:51:46 – Maxime vient de se connecter.");
    });

    it("should emit an appropriate disconnection message on socket disconnection", () => {
        const message: WebsocketMessage<ChatMessage> = createWebsocketMessage(
            {
                gameName: "",
                playerCount: PlayerCountMessage.SOLO,
                playerName: "Maxime",
                position: ChatMessagePosition.NA,
                timestamp: new Date("Sat Mar 23 2019 13:51:46 GMT-0400 (Eastern Daylight Time)"),
                type: ChatMessageType.DISCONNECTION,
            });
        service.execute(message, socket as unknown as SocketIO.Socket);
        expect(socket.eventValue).to.equal(SocketEvent.CHAT);
        expect(socket.emitValue).to.equal("12:51:46 – Maxime vient de se déconnecter.");
    });

    it("should emit an appropriate difference found message", () => {
        const message: WebsocketMessage<ChatMessage> = createWebsocketMessage(
            {
                gameName: "",
                playerCount: PlayerCountMessage.SOLO,
                playerName: "Maxime",
                position: ChatMessagePosition.NA,
                timestamp: new Date("Sat Mar 23 2019 13:51:46 GMT-0400 (Eastern Daylight Time)"),
                type: ChatMessageType.DIFF_FOUND,
            });
        service.execute(message, socket as unknown as SocketIO.Socket);
        expect(socket.eventValue).to.equal(SocketEvent.CHAT);
        expect(socket.emitValue).to.equal("12:51:46 – Différence trouvée.");
        message.body.playerCount = PlayerCountMessage.MULTI;
        service.execute(message, socket as unknown as SocketIO.Socket);
        expect(socket.eventValue).to.equal(SocketEvent.CHAT);
        expect(socket.emitValue).to.equal("12:51:46 – Différence trouvée par Maxime.");
    });

    it("should emit an appropriate difference error message", () => {
        const message: WebsocketMessage<ChatMessage> = createWebsocketMessage({
                gameName: "",
            playerCount: PlayerCountMessage.SOLO,
                playerName: "Maxime",
                position: ChatMessagePosition.NA,
                timestamp: new Date("Sat Mar 23 2019 13:51:46 GMT-0400 (Eastern Daylight Time)"),
                type: ChatMessageType.DIFF_ERROR,
                                                                              });
        service.execute(message, socket as unknown as SocketIO.Socket);
        expect(socket.eventValue).to.equal(SocketEvent.CHAT);
        expect(socket.emitValue).to.equal("12:51:46 – Erreur.");
        message.body.playerCount = PlayerCountMessage.MULTI;
        service.execute(message, socket as unknown as SocketIO.Socket);
        expect(socket.eventValue).to.equal(SocketEvent.CHAT);
        expect(socket.emitValue).to.equal("12:51:46 – Erreur par Maxime.");
    });

    it("should emit an appropriate new time record message", () => {
        const message: WebsocketMessage<ChatMessage> = createWebsocketMessage({
                gameName: "MicheDePain",
            playerCount: PlayerCountMessage.SOLO,
                playerName: "Maxime",
                position: ChatMessagePosition.FIRST,
                timestamp: new Date("Sat Mar 23 2019 13:51:46 GMT-0400 (Eastern Daylight Time)"),
                type: ChatMessageType.BEST_TIME,
                                                                              });
        service.execute(message, socket as unknown as SocketIO.Socket);
        expect(socket.eventValue).to.equal(SocketEvent.CHAT);
        expect(socket.emitValue).to.equal("12:51:46 – Maxime obtient la première place dans"
                                        + " les meilleurs temps du jeu MicheDePain en solo.");
    });

    it("should emit a broken message when input was broken", () => {
        // To test an impossible case
        // tslint:disable-next-line: no-any
        const message: WebsocketMessage<any> = createWebsocketMessage({
                gameName: "MicheDePain",
            playerCount: PlayerCountMessage.SOLO,
                playerName: "Maxime",
                position: ChatMessagePosition.FIRST,
                timestamp: new Date("Sat Mar 23 2019 13:51:46 GMT-0400 (Eastern Daylight Time)"),
                                                                      });
        service.execute(message, socket as unknown as SocketIO.Socket);
        expect(socket.eventValue).to.equal(SocketEvent.CHAT);
        expect(socket.emitValue).to.equal("12:51:46 – Voici pourquoi les default existent dans les switchs.");
    });
});
