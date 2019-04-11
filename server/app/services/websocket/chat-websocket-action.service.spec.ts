import { expect } from "chai";
import {Server} from "socket.io";
import {
    createWebsocketMessage, ChatMessage,
    ChatMessagePosition, ChatMessageType,
    WebsocketMessage
} from "../../../../common/communication/messages/message";
import { SocketEvent } from "../../../../common/communication/socket-events";
import {OnlineType} from "../../../../common/model/game/game";
import { ChatWebsocketActionService } from "./chat-websocket-action.service";
import {RadioTowerService} from "./radio-tower.service";

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

class FakeServer {

    public constructor() {
        this.emitValue = "";
        this.eventValue = "";
    }

    // tslint:disable-next-line:no-any
    public sockets: any = {
        emit: (event: string, message: WebsocketMessage<string>) => {
            this.eventValue = event;
            this.emitValue = message.body;
        },
    };

    public eventValue: string;
    public emitValue: string;

    // tslint:disable-next-line:no-any
    public in(room: string): any {
        return {
            emit: (event: string, message: WebsocketMessage<string>) => {
                this.eventValue = event;
                this.emitValue = message.body;
            },
        };
    }

    // tslint:disable-next-line:no-any
    public to(succ: string): any {
        return {
            emit: (event: string, message: WebsocketMessage<string>) => {
                this.eventValue = event;
                this.emitValue = message.body;
            },
        };
    }

    public emit(event: string, message: WebsocketMessage<string>): void {
        this.eventValue = event;
        this.emitValue = message.body;
    }
}

describe("ChatWebsocketActionService", () => {

    let service: ChatWebsocketActionService;
    let socket: Socket;
    let radioTower: RadioTowerService;
    let server: FakeServer;
    beforeEach(() => {
        server = new FakeServer();
        radioTower = new RadioTowerService();
        radioTower.server = server as unknown as Server;
        service = new ChatWebsocketActionService(radioTower);
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
                playerCount: OnlineType.SOLO,
                playerName: "Maxime",
                position: ChatMessagePosition.NA,
                timestamp: new Date("Sat Mar 23 2019 13:51:46 GMT-0400 (Eastern Daylight Time)"),
                type: ChatMessageType.CONNECTION,
            });
        service.execute(message, socket as unknown as SocketIO.Socket);
        expect(server.eventValue).to.equal(SocketEvent.CHAT);
        expect(server.emitValue).to.equal("12:51:46 – Maxime vient de se connecter.");
    });

    it("should emit an appropriate disconnection message on socket disconnection", () => {
        const message: WebsocketMessage<ChatMessage> = createWebsocketMessage(
            {
                gameName: "",
                playerCount: OnlineType.SOLO,
                playerName: "Maxime",
                position: ChatMessagePosition.NA,
                timestamp: new Date("Sat Mar 23 2019 13:51:46 GMT-0400 (Eastern Daylight Time)"),
                type: ChatMessageType.DISCONNECTION,
            });
        service.execute(message, socket as unknown as SocketIO.Socket);
        expect(server.eventValue).to.equal(SocketEvent.CHAT);
        expect(server.emitValue).to.equal("12:51:46 – Maxime vient de se déconnecter.");
    });

    it("should emit an appropriate difference found message", () => {
        const message: WebsocketMessage<ChatMessage> = createWebsocketMessage(
            {
                gameName: "",
                playerCount: OnlineType.SOLO,
                playerName: "Maxime",
                position: ChatMessagePosition.NA,
                timestamp: new Date("Sat Mar 23 2019 13:51:46 GMT-0400 (Eastern Daylight Time)"),
                type: ChatMessageType.DIFF_FOUND,
            });
        service.execute(message, socket as unknown as SocketIO.Socket);
        expect(server.eventValue).to.equal(SocketEvent.CHAT);
        expect(server.emitValue).to.equal("12:51:46 – Différence trouvée.");
        message.body.playerCount = OnlineType.MULTI;
        service.execute(message, socket as unknown as SocketIO.Socket);
        expect(server.eventValue).to.equal(SocketEvent.CHAT);
        expect(server.emitValue).to.equal("12:51:46 – Différence trouvée par Maxime.");
    });

    it("should emit an appropriate difference error message", () => {
        const message: WebsocketMessage<ChatMessage> = createWebsocketMessage({
                gameName: "",
                playerCount: OnlineType.SOLO,
                playerName: "Maxime",
                position: ChatMessagePosition.NA,
                timestamp: new Date("Sat Mar 23 2019 13:51:46 GMT-0400 (Eastern Daylight Time)"),
                type: ChatMessageType.DIFF_ERROR,
                                                                              });
        service.execute(message, socket as unknown as SocketIO.Socket);
        expect(server.eventValue).to.equal(SocketEvent.CHAT);
        expect(server.emitValue).to.equal("12:51:46 – Erreur.");
        message.body.playerCount = OnlineType.MULTI;
        service.execute(message, socket as unknown as SocketIO.Socket);
        expect(server.eventValue).to.equal(SocketEvent.CHAT);
        expect(server.emitValue).to.equal("12:51:46 – Erreur par Maxime.");
    });

    it("should emit an appropriate new time record message", () => {
        const message: WebsocketMessage<ChatMessage> = createWebsocketMessage({
                gameName: "MicheDePain",
                playerCount: OnlineType.SOLO,
                playerName: "Maxime",
                position: ChatMessagePosition.FIRST,
                timestamp: new Date("Sat Mar 23 2019 13:51:46 GMT-0400 (Eastern Daylight Time)"),
                type: ChatMessageType.BEST_TIME,
                                                                              });
        service.execute(message, socket as unknown as SocketIO.Socket);
        expect(server.eventValue).to.equal(SocketEvent.CHAT);
        expect(server.emitValue).to.equal("12:51:46 – Maxime obtient la première place dans"
                                        + " les meilleurs temps du jeu MicheDePain en solo.");
    });

    it("should emit a broken message when input was broken", () => {
        // To test an impossible case
        // tslint:disable-next-line: no-any
        const message: WebsocketMessage<any> = createWebsocketMessage({
                gameName: "MicheDePain",
                playerCount: OnlineType.SOLO,
                playerName: "Maxime",
                position: ChatMessagePosition.FIRST,
                timestamp: new Date("Sat Mar 23 2019 13:51:46 GMT-0400 (Eastern Daylight Time)"),
                                                                      });
        service.execute(message, socket as unknown as SocketIO.Socket);
        expect(server.eventValue).to.equal(SocketEvent.CHAT);
        expect(server.emitValue).to.equal("12:51:46 – Voici pourquoi les default existent dans les switchs.");
    });

    it("should emit an appropriate difference found message (using sendChat)", () => {
        const message: ChatMessage = {
            gameName: "",
            playerCount: OnlineType.SOLO,
            playerName: "Maxime",
            position: ChatMessagePosition.NA,
            timestamp: new Date("Sat Mar 23 2019 13:51:46 GMT-0400 (Eastern Daylight Time)"),
            type: ChatMessageType.DIFF_FOUND,
        };
        service.sendChat(message, "");
        expect(server.eventValue).to.equal(SocketEvent.CHAT);
        expect(server.emitValue).to.equal("12:51:46 – Différence trouvée.");
        message.playerCount = OnlineType.MULTI;
        service.sendChat(message, "");
        expect(server.eventValue).to.equal(SocketEvent.CHAT);
        expect(server.emitValue).to.equal("12:51:46 – Différence trouvée par Maxime.");
    });

    it("should emit an appropriate difference error message (using sendChat)", () => {
        const message: ChatMessage = {
            gameName: "",
            playerCount: OnlineType.SOLO,
            playerName: "Maxime",
            position: ChatMessagePosition.NA,
            timestamp: new Date("Sat Mar 23 2019 13:51:46 GMT-0400 (Eastern Daylight Time)"),
            type: ChatMessageType.DIFF_ERROR,
        };
        service.sendChat(message, "");
        expect(server.eventValue).to.equal(SocketEvent.CHAT);
        expect(server.emitValue).to.equal("12:51:46 – Erreur.");
        message.playerCount = OnlineType.MULTI;
        service.sendChat(message, "");
        expect(server.eventValue).to.equal(SocketEvent.CHAT);
        expect(server.emitValue).to.equal("12:51:46 – Erreur par Maxime.");
    });

    it("should format time nicely", () => {
        const result: string = service["formatTime"](new Date());

        return expect(result.match("(\\d\\d:\\d\\d:\\d\\d)")).to.be.not.null;
    });
});
