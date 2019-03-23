import { expect } from "chai";
import {
    ChatMessage, ChatMessagePlayerCount,
    ChatMessagePosition, ChatMessageType,
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
    });

    it("should emit right connection message", () => {
        const message: WebsocketMessage<ChatMessage> = {
            title: SocketEvent.CHAT,
            body: {
                gameName: "",
                playerCount: ChatMessagePlayerCount.SOLO,
                playerName: "Maxime",
                position: ChatMessagePosition.NA,
                timestamp: new Date("Sat Mar 23 2019 13:51:46 GMT-0400 (Eastern Daylight Time)"),
                type: ChatMessageType.CONNECTION,
            },
        };

        service.execute(message, socket as unknown as SocketIO.Socket);
        expect(socket.eventValue).to.equal(SocketEvent.CHAT);
        expect(socket.emitValue).to.equal("12:51:46 – Maxime vient de se connecter.");
    });

    it("should emit right disconnection message", () => {
        const message: WebsocketMessage<ChatMessage> = {
            title: SocketEvent.CHAT,
            body: {
                gameName: "",
                playerCount: ChatMessagePlayerCount.SOLO,
                playerName: "Maxime",
                position: ChatMessagePosition.NA,
                timestamp: new Date("Sat Mar 23 2019 13:51:46 GMT-0400 (Eastern Daylight Time)"),
                type: ChatMessageType.DISCONNECTION,
            },
        };
        service.execute(message, socket as unknown as SocketIO.Socket);
        expect(socket.eventValue).to.equal(SocketEvent.CHAT);
        expect(socket.emitValue).to.equal("12:51:46 – Maxime vient de se déconnecter.");
    });

    it("should emit right difference found message", () => {
        const message: WebsocketMessage<ChatMessage> = {
            title: SocketEvent.CHAT,
            body: {
                gameName: "",
                playerCount: ChatMessagePlayerCount.SOLO,
                playerName: "Maxime",
                position: ChatMessagePosition.NA,
                timestamp: new Date("Sat Mar 23 2019 13:51:46 GMT-0400 (Eastern Daylight Time)"),
                type: ChatMessageType.DIFF_FOUND,
            },
        };
        service.execute(message, socket as unknown as SocketIO.Socket);
        expect(socket.eventValue).to.equal(SocketEvent.CHAT);
        expect(socket.emitValue).to.equal("12:51:46 – Différence trouvée.");
        message.body.playerCount = ChatMessagePlayerCount.MULTI;
        service.execute(message, socket as unknown as SocketIO.Socket);
        expect(socket.eventValue).to.equal(SocketEvent.CHAT);
        expect(socket.emitValue).to.equal("12:51:46 – Différence trouvée par Maxime.");
    });

    it("should emit right difference error message", () => {
        const message: WebsocketMessage<ChatMessage> = {
            title: SocketEvent.CHAT,
            body: {
                gameName: "",
                playerCount: ChatMessagePlayerCount.SOLO,
                playerName: "Maxime",
                position: ChatMessagePosition.NA,
                timestamp: new Date("Sat Mar 23 2019 13:51:46 GMT-0400 (Eastern Daylight Time)"),
                type: ChatMessageType.DIFF_ERROR,
            },
        };
        service.execute(message, socket as unknown as SocketIO.Socket);
        expect(socket.eventValue).to.equal(SocketEvent.CHAT);
        expect(socket.emitValue).to.equal("12:51:46 – Erreur.");
        message.body.playerCount = ChatMessagePlayerCount.MULTI;
        service.execute(message, socket as unknown as SocketIO.Socket);
        expect(socket.eventValue).to.equal(SocketEvent.CHAT);
        expect(socket.emitValue).to.equal("12:51:46 – Erreur par Maxime.");
    });

    it("should emit right new time record message", () => {
        const message: WebsocketMessage<ChatMessage> = {
            title: SocketEvent.CHAT,
            body: {
                gameName: "MicheDePain",
                playerCount: ChatMessagePlayerCount.SOLO,
                playerName: "Maxime",
                position: ChatMessagePosition.FIRST,
                timestamp: new Date("Sat Mar 23 2019 13:51:46 GMT-0400 (Eastern Daylight Time)"),
                type: ChatMessageType.BEST_TIME,
            },
        };
        service.execute(message, socket as unknown as SocketIO.Socket);
        expect(socket.eventValue).to.equal(SocketEvent.CHAT);
        expect(socket.emitValue).to.equal("12:51:46 – Maxime obtient la première place dans"
                                        + " les meilleurs temps du jeu MicheDePain en solo.");
    });

    it("should emit broken message when input was broken", () => {
        const message: WebsocketMessage<any> = {
            title: SocketEvent.CHAT,
            body: {
                gameName: "MicheDePain",
                playerCount: ChatMessagePlayerCount.SOLO,
                playerName: "Maxime",
                position: ChatMessagePosition.FIRST,
                timestamp: new Date("Sat Mar 23 2019 13:51:46 GMT-0400 (Eastern Daylight Time)"),
            },
        };
        service.execute(message, socket as unknown as SocketIO.Socket);
        expect(socket.eventValue).to.equal(SocketEvent.CHAT);
        expect(socket.emitValue).to.equal("12:51:46 – Voici pourquoi les default existent dans les switchs.");
    });
});
