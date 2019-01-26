import { injectable } from "inversify";
import "reflect-metadata";
import { Message } from "../../../common/communication/message";
import {MODIFIED_IMAGE_IDENTIFIER, ORIGINAL_IMAGE_IDENTIFIER} from "../controllers/game-creator.controller";

@injectable()
export class GameCreatorService {

    public async createSimpleGame(gameName: string, originalImage: string, modifiedImage: string): Promise<Message> {

        try {
            const test: object = {head: "h", body: "b"};

            return {
                title: test["head2"],
                body: test["body"],
            };
        } catch (error) {
            return {
                title: "0",
                body: "0",
            };
        }


    }
}
