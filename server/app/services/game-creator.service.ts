import { injectable } from "inversify";
import "reflect-metadata";
import { Message } from "../../../common/communication/message";

@injectable()
export class GameCreatorService {

    public async createSimpleGame(gameName: string, originalImage: string, modifiedImage: string): Promise<Message> {

        return {
            title: "h",
            body: "b",
        };
    }
}
