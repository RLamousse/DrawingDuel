import { injectable } from "inversify";
import "reflect-metadata";
import { GameCreationStatus } from "../controllers/game-creator.controller"

@injectable()
export class GameCreatorService {

    public  createSimpleGame(gameName: string, originalImage: string, modifiedImage: string): GameCreationStatus {

        return GameCreationStatus.AllGood;
    }
}
