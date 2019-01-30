import {inject, injectable} from "inversify";
import "reflect-metadata";
import {Message} from "../../../common/communication/message";
import {DIFFERENCE_ERROR_MESSAGE, FORMAT_ERROR_MESSAGE,/* GAME_NAME_KEY,*/ NAME_ERROR_MESSAGE} from "../controllers/game-creator.controller";
import Axios, {AxiosResponse} from "axios";
import Types from "../types";
import {DataBaseController} from "../controllers/data-base.controller"
import {DifferenceEvaluatorService} from "./difference-evaluator.service";

@injectable()
export class GameCreatorService {

    constructor(@inject(Types.DifferenceEvaluatorService) private differenceEvaluatorService: DifferenceEvaluatorService,
                @inject(Types.DataBaseController) private dataBaseController: DataBaseController){}

    public async createSimpleGame(gameName: string, originalImage: string, modifiedImage: string): Promise<Message> {

               // 1 test name in db
        // 1.1 if fail: throw NAME_ERROR_MESSAGE
        // 2 call diff function from the phillips
        // 2.1 if files are not in temp/, throw format error
        // 3 call compare service when imported and finished
        // 3.1 if there are not 7 difference, throw difference error
        // 4 generate data in the database

        return this.generateGame(gameName, originalImage, modifiedImage);

        // 5 send back name of game

        // return {title: GAME_NAME_KEY, body: gameName};

        throw new Error(FORMAT_ERROR_MESSAGE);
        throw new Error(DIFFERENCE_ERROR_MESSAGE);
        throw new Error(NAME_ERROR_MESSAGE);
    }


    private async generateGame(gameName: string, originalImage: string, modifiedImage: string): Promise<Message> {
        //remplacer localhost par une variable url de notre serveur
        //demander charger si api/data-base est une valeur magique
        let response: AxiosResponse<Message> = await Axios.get<Message>("http://localhost:3000/api/data-base/get");

        return response.data;

    }
}
