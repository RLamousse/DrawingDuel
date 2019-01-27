import { injectable } from "inversify";
import "reflect-metadata";
import {Message} from "../../../common/communication/message";
import {DIFFERENCE_ERROR_MESSAGE, FORMAT_ERROR_MESSAGE, NAME_ERROR_MESSAGE} from "../controllers/game-creator.controller";

@injectable()
export class GameCreatorService {

    public async createSimpleGame(gameName: string, originalImage: string, modifiedImage: string): Promise<Message> {
        return {title: "Game name", body: "name of the game that was successfully created"};
    }
}
