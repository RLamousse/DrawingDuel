/* tslint:disable:max-file-line-count */
// tslint:disable:no-magic-numbers we want to use magic numbers to simplify our tests
import Axios from "axios";
import AxiosAdapter from "axios-mock-adapter";
// tslint:disable-next-line:no-duplicate-imports Weird interaction between singletons and interface (olivier st-o approved)
import MockAdapter from "axios-mock-adapter";
import {expect} from "chai";
import * as HttpStatus from "http-status-codes";
import {Socket} from "socket.io";
import {anything, instance, mock, when} from "ts-mockito";
import {
    createWebsocketMessage,
    ChatMessage, ChatMessagePosition,
    UpdateScoreMessage,
    WebsocketMessage,
    ChatMessageType
} from "../../../../common/communication/messages/message";
import {MODIFY_SCORES, SERVER_BASE_URL} from "../../../../common/communication/routes";
import {IllegalArgumentError, ScoreNotGoodEnough} from "../../../../common/errors/services.errors";
import {OnlineType} from "../../../../common/model/game/game";
import {ChatWebsocketActionService} from "./chat-websocket-action.service";
import {UpdateGameScoresWebsocketActionService} from "./update-game-scores-websocket-action.service";

describe("Update Game Scores Websocket Action Service", () => {

    let axiosMock: MockAdapter;
    let mockedChatWebsocketActionService: ChatWebsocketActionService;

    const getMockedService: () => UpdateGameScoresWebsocketActionService = () => {
        return new UpdateGameScoresWebsocketActionService(
            instance(mockedChatWebsocketActionService),
        );
    };

    beforeEach(() => {
        axiosMock = new AxiosAdapter(Axios);

        mockedChatWebsocketActionService = mock(ChatWebsocketActionService);
        when(mockedChatWebsocketActionService.execute(anything(), anything())).thenReturn();
    });

    it("should do nothing if the micro service throws a ScoreNotGoodEnough error", async () => {

        axiosMock.onPut(SERVER_BASE_URL + MODIFY_SCORES)
            .reply(HttpStatus.INTERNAL_SERVER_ERROR, new ScoreNotGoodEnough());
        when(mockedChatWebsocketActionService.execute(anything(), anything())).thenThrow();
        const message: WebsocketMessage<UpdateScoreMessage> = createWebsocketMessage<UpdateScoreMessage>({
            onlineType: OnlineType.SOLO,
            gameName: "someGame",
            newTime: {
                name: "someGuy", time: 123,
            },
        });

        return getMockedService().execute(message, {} as Socket).catch(() => {
            expect.fail();
        });
    });

    it("should throw if micro service throws any other error than ScoreNotGoodEnough error", async () => {

        axiosMock.onPut(SERVER_BASE_URL + MODIFY_SCORES)
            .reply(HttpStatus.INTERNAL_SERVER_ERROR, new IllegalArgumentError());
        when(mockedChatWebsocketActionService.execute(anything(), anything())).thenReturn();
        const message: WebsocketMessage<UpdateScoreMessage> = createWebsocketMessage<UpdateScoreMessage>({
            onlineType: OnlineType.SOLO,
            gameName: "someGame",
            newTime: {
                name: "someGuy", time: 123,
            },
        });

        return getMockedService().execute(message, {} as Socket).catch((error: Error) => {
            expect(error.message).to.eql(IllegalArgumentError.ARGUMENT_ERROR_MESSAGE );
        });
    });

    it("should send a message if everything is fine", async () => {

        axiosMock.onPut(SERVER_BASE_URL + MODIFY_SCORES)
            .reply(HttpStatus.OK, 1);
        when(mockedChatWebsocketActionService.execute(anything(), anything())).thenCall(
            (data: WebsocketMessage<ChatMessage>, socket: Socket) => {
                expect(data.body).to.contain({type: ChatMessageType.BEST_TIME,
                                              gameName: "someGame",
                                              playerName: "someGuy",
                                              playerCount: OnlineType.SOLO,
                                              position: ChatMessagePosition.FIRST,
                });
            });
        const message: WebsocketMessage<UpdateScoreMessage> = createWebsocketMessage<UpdateScoreMessage>({
                onlineType: OnlineType.SOLO,
                gameName: "someGame",
                newTime: {
                    name: "someGuy", time: 123,
                },
        });
        await getMockedService().execute(message, {} as Socket);
    });
});
