import {Request} from "express";
import { injectable } from "inversify";
import "reflect-metadata";
import { Message } from "../../../common/communication/message";
import {MODIFIED_IMAGE_IDENTIFIER, ORIGINAL_IMAGE_IDENTIFIER} from "../controllers/game-creator.controller";

const GAME_NAME_IDENTIFIER: string = "gameName";

@injectable()
export class GameCreatorService {

    public async createSimpleGame(req: Request): Promise<Message> {

        try {
            if (req.files[ORIGINAL_IMAGE_IDENTIFIER].length !== 1 ||
                req.files[MODIFIED_IMAGE_IDENTIFIER].length !== 1 ||
                req.body[GAME_NAME_IDENTIFIER] === "") {

                return{
                    title: "error",
                    body: "Request sent by the client had the wrong format!",
                };
            }
        } catch (error) {
            return{
                title: "error",
                body: "Request sent by the client had the wrong format!",
            };
        }

        return {
            title: "1",
            body: "1",
        };
    }
}
