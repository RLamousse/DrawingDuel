import { expect } from "chai";
import {Server} from "socket.io";
import {
    ChatMessage,
    ChatMessagePosition, ChatMessageType,
    WebsocketMessage
} from "../../../../common/communication/messages/message";
import { SocketEvent } from "../../../../common/communication/socket-events";
import {RoomNotDefinedError} from "../../../../common/errors/services.errors";
import {OnlineType} from "../../../../common/model/game/game";
import { ChatWebsocketActionService } from "./chat-websocket-action.service";
import {RadioTowerService} from "./radio-tower.service";

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
    let radioTower: RadioTowerService;
    let server: FakeServer;
    beforeEach(() => {
        server = new FakeServer();
        radioTower = new RadioTowerService();
        radioTower.server = server as unknown as Server;
        service = new ChatWebsocketActionService(radioTower);

        // Private member access
        // tslint:disable-next-line: no-any
        (service as any).formatTime = () => {
            return "09:51:46";
        };
    });

    it("should emit an appropriate connection message on socket connection", () => {
        const message: ChatMessage = {
            gameName: "",
            playerCount: OnlineType.SOLO,
            playerName: "Maxime",
            position: ChatMessagePosition.NA,
            timestamp: new Date("April 20 2069 04:20:00"),
            type: ChatMessageType.CONNECTION,
        };
        service.sendChat(message);
        expect(server.eventValue).to.equal(SocketEvent.CHAT);
        expect(server.emitValue).to.contain("Maxime vient de se connecter.");
    });

    it("should emit an appropriate disconnection message on socket disconnection", () => {
        const message: ChatMessage = {
            gameName: "",
            playerCount: OnlineType.SOLO,
            playerName: "Maxime",
            position: ChatMessagePosition.NA,
            timestamp: new Date("April 20 2069 04:20:00"),
            type: ChatMessageType.DISCONNECTION,
        };
        service.sendChat(message);
        expect(server.eventValue).to.equal(SocketEvent.CHAT);
        expect(server.emitValue).to.contain("Maxime vient de se déconnecter.");
    });

    it("should emit an appropriate difference found message", () => {
        const message: ChatMessage = {
            gameName: "",
            playerCount: OnlineType.SOLO,
            playerName: "Maxime",
            position: ChatMessagePosition.NA,
            timestamp: new Date("April 20 2069 04:20:00"),
            type: ChatMessageType.DIFF_FOUND,
        };
        service.sendChat(message, "id");
        expect(server.eventValue).to.equal(SocketEvent.CHAT);
        expect(server.emitValue).to.contain("Différence trouvée.");
        message.playerCount = OnlineType.MULTI;
        service.sendChat(message, "id");
        expect(server.eventValue).to.equal(SocketEvent.CHAT);
        expect(server.emitValue).to.contain("Différence trouvée par Maxime.");
    });

    it("should emit an appropriate difference error message", () => {
        const message: ChatMessage = {
            gameName: "",
            playerCount: OnlineType.SOLO,
            playerName: "Maxime",
            position: ChatMessagePosition.NA,
            timestamp: new Date("April 20 2069 04:20:00"),
            type: ChatMessageType.DIFF_ERROR,
        };
        service.sendChat(message, "id");
        expect(server.eventValue).to.equal(SocketEvent.CHAT);
        expect(server.emitValue).to.contain("Erreur.");
        message.playerCount = OnlineType.MULTI;
        service.sendChat(message, "id");
        expect(server.eventValue).to.equal(SocketEvent.CHAT);
        expect(server.emitValue).to.contain("Erreur par Maxime.");
    });

    it("should emit an appropriate new time record message", () => {
        const message: ChatMessage = {
            gameName: "MicheDePain",
            playerCount: OnlineType.SOLO,
            playerName: "Maxime",
            position: ChatMessagePosition.FIRST,
            timestamp: new Date("April 20 2069 04:20:00"),
            type: ChatMessageType.BEST_TIME,
        };
        service.sendChat(message);
        expect(server.eventValue).to.equal(SocketEvent.CHAT);
        expect(server.emitValue).to.contain("Maxime obtient la première place dans"
                                        + " les meilleurs temps du jeu MicheDePain en solo.");
    });

    it("should emit a broken message when input was broken", () => {
        // To test an impossible case
        // tslint:disable-next-line: no-any
        const message: any = {
            gameName: "MicheDePain",
            playerCount: OnlineType.SOLO,
            playerName: "Maxime",
            position: ChatMessagePosition.FIRST,
            timestamp: new Date("April 20 2069 04:20:00"),
        };
        service.sendChat(message);
        expect(server.eventValue).to.equal(SocketEvent.CHAT);
        expect(server.emitValue).to.contain("Voici pourquoi les default existent dans les switchs.");
    });

    it("should throw if no room id specified and sending to a room", () => {
        const message: ChatMessage = {
            gameName: "",
            playerCount: OnlineType.SOLO,
            playerName: "Maxime",
            position: ChatMessagePosition.NA,
            timestamp: new Date("April 20 2069 04:20:00"),
            type: ChatMessageType.DIFF_FOUND,
        };
        try {
            service.sendChat(message, "");
        } catch (e) {
            expect(e.message).to.equal(RoomNotDefinedError.ROOM_NOT_DEFINED_ERROR_MESSAGE);
        }
    });

    it("should format time nicely", () => {
        const result: string = service["formatTime"](new Date());

        return expect(result.match("(\\d\\d:\\d\\d:\\d\\d)")).to.be.not.null;
    });
});
