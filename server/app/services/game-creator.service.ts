import { injectable } from "inversify";
import "reflect-metadata";
import { GameCreationStatus } from "../controllers/game-creator.controller"
import { Message } from "../../../common/communication/message";

@injectable()
export class GameCreatorService {

    public  createSimpleGame(gameName: string, originalImage: string, modifiedImage: string): GameCreationStatus {

        return GameCreationStatus.AllGood;
    }
}
