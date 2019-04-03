import Axios from "axios";
import {inject, injectable} from "inversify";
import * as io from "socket.io";
import {
    createWebsocketMessage,
    ChatMessage,
    ChatMessagePlayerCount,
    ChatMessagePosition, ChatMessageType,
    UpdateScoreMessage,
    WebsocketMessage
} from "../../../../common/communication/messages/message";
import {MODIFY_SCORES, SERVER_BASE_URL} from "../../../../common/communication/routes";
import {ScoreNotGoodEnough} from "../../../../common/errors/services.errors";
import types from "../../types";
import {ChatWebsocketActionService} from "./chat-websocket-action.service";
import {WebsocketActionService} from "./websocket-action.service";

/**
 * This is supposed to be an example/test socket service
 * (as can be deducted from the very static message it answers with)
 */
@injectable()
export class UpdateGameScoresWebsocketActionService implements WebsocketActionService {

    private readonly POSITION_TRANSLATE_TABLE: ChatMessagePosition[] = [ChatMessagePosition.NA,
                                                                        ChatMessagePosition.FIRST,
                                                                        ChatMessagePosition.SECOND,
                                                                        ChatMessagePosition.THIRD];

    public constructor(@inject(types.ChatWebsocketActionService) private chatAction: ChatWebsocketActionService) {}

    public async execute(data: WebsocketMessage<UpdateScoreMessage>, socket: io.Socket): Promise<void> {
        let position: number;
        try {
            position = (await Axios.put<number>(
                SERVER_BASE_URL + MODIFY_SCORES, data.body)).data;
        } catch (error) {
            if (error.response.data.message === ScoreNotGoodEnough.SCORE_NOT_GOOD_ENOUGH) {
                return;
            } else {
                throw error.response.data;
            }
        }
        const resBody: ChatMessage = {type: ChatMessageType.BEST_TIME,
                                      gameName: data.body.gameName,
                                      playerName: data.body.newTime.name,
                                      playerCount: data.body.isSolo ? ChatMessagePlayerCount.SOLO : ChatMessagePlayerCount.MULTI,
                                      position: this.POSITION_TRANSLATE_TABLE[position],
                                      timestamp: new Date(),
        };
        this.chatAction.execute(createWebsocketMessage(resBody), socket);
    }
}
