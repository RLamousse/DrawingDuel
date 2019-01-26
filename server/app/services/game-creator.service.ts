import {Request} from "express";
import { injectable } from "inversify";
import "reflect-metadata";
import { Message } from "../../../common/communication/message";

@injectable()
export class GameCreatorService {

    public async createSimpleGame(req: Request): Promise<Message> {

        return {
            title: "smaple text",
            body: "smaple text",
        };
    }
}
