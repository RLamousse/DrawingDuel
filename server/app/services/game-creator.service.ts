import Axios from "axios";
import * as FormData from "form-data";
import * as fs from "fs";
import {injectable} from "inversify";
import "reflect-metadata";
import {Game, TIMES_ARRAY_SIZE} from "../../../common/Object/game";
import {Message} from "../../../common/communication/message";
import {
    DIFFERENCE_ERROR_MESSAGE,
    FORMAT_ERROR_MESSAGE, MODIFIED_IMAGE_IDENTIFIER,
    NAME_ERROR_MESSAGE,
    ORIGINAL_IMAGE_IDENTIFIER
} from "../controllers/game-creator.controller";
import {
    ALREADY_EXISTING_GAME_MESSAGE_ERROR, GAME_FIELD,
    GAME_NAME_FIELD,
    NOT_EXISTING_GAME_MESSAGE_ERROR
} from "./data-base.service";

@injectable()
export class GameCreatorService {

    private readonly _MIN_GENERATED_SCORE: number = 20;
    private readonly _MAX_GENERATED_SCORE: number = 120;

    public async createSimpleGame(gameName: string, originalImageFile: string, modifiedImageFile: string): Promise<Message> {


        this.testNameExistance(gameName);
        // 2 call diff function from the phillips
        let diffImage: object;
        try {

            const formData: FormData = new FormData();
            formData.append("name", "diffImage-" + Date.now() + ".bmp");
            // let file = document.querySelector();
            console.dir(fs.readFileSync(originalImageFile));
            formData.append(ORIGINAL_IMAGE_IDENTIFIER, fs.readFileSync(originalImageFile));
            formData.append(MODIFIED_IMAGE_IDENTIFIER, fs.readFileSync(modifiedImageFile));
            diffImage = (await Axios.post<object>("http://localhost:3000/api/image-diff",
                                                  formData,
                                                  {headers: {"Content-Type": "multipart/form-data"}})).data;
            // @ts-ignore
            // diffImage = (await Axios({
            //     method: "post",
            //     url: "http://localhost:3000/api/image-diff",
            //     data: formData,
            //     config: { headers: {"Content-Type": "multipart/form-data" }},
            // })).data;

        } catch (error) {
            throw new Error("imageDiff: " + error);
        }
        // 3 call compare service when imported and finished
        // TODO solve same problem as 2
        // 3.1 if there are not 7 difference, throw difference error
        // 4 generate data in the database

        const test: Message = await this.generateGame(gameName, fs.readFileSync(originalImageFile), fs.readFileSync(modifiedImageFile));

        // return test;
        // 5 send back name of game
        test.title = JSON.stringify(diffImage);

        return test;

        throw new Error(FORMAT_ERROR_MESSAGE);
        throw new Error(DIFFERENCE_ERROR_MESSAGE);
        throw new Error(NAME_ERROR_MESSAGE);
    }

    private async generateGame(gameName: string, originalImageData: Buffer, modifiedImageData: Buffer): Promise<Message> {


        // let response: Message = await Axios.get<Message>("http://localhost:3000/api/data-base/add-game");
        // remplacer localhost par une variable url de notre serveur
        // demander charger si api/data-base est une valeur magique

        const GAME: Game = {
            bestMultiTimes: this.createRandomScores(),
            bestSoloTimes: this.createRandomScores(),
            gameName: gameName,
            modifiedImage: modifiedImageData,
            originalImage: originalImageData,
        };
        try {
            await Axios.post<Game>("http://localhost:3000/api/data-base/add-game",
                                   {data: {[GAME_FIELD]: GAME}});
        } catch (error) {
            if (error.response.data.message === ALREADY_EXISTING_GAME_MESSAGE_ERROR) {
                throw new Error(NAME_ERROR_MESSAGE);
            } else if (error.response.data.message !== NOT_EXISTING_GAME_MESSAGE_ERROR) {
                throw new Error("dataBase: " + error.response.data.message);
            }
        }
        return {title: "Game created", body: "The game was successfully created!"};

    }

    private createRandomScores(): {name: string, time: number}[] {

        const scoreArray: number[] = new Array(TIMES_ARRAY_SIZE);
        for (const I of scoreArray){
            scoreArray[I] = Number((this._MIN_GENERATED_SCORE +
                Math.random() * (this._MAX_GENERATED_SCORE - this._MIN_GENERATED_SCORE)).toFixed(0));
        }

        scoreArray.sort();

        //TODO demander si ce sont des valeurs magiques
        return [{name: "xXx_D4B0W5_xXx", time: scoreArray[2]},
                {name: "hardTryer4269", time: scoreArray[1]},
                {name: "normie", time: scoreArray[0]}];
    }

    private async testNameExistance(gameName: string): Promise<void> {

        try {
            await Axios.get<Game>("http://localhost:3000/api/data-base/get-game",
                                  {data: {[GAME_NAME_FIELD]: gameName}});
        } catch (error) {
            if (error.response.data.message === ALREADY_EXISTING_GAME_MESSAGE_ERROR) {
                throw new Error(NAME_ERROR_MESSAGE);
            } else if (error.response.data.message !== NOT_EXISTING_GAME_MESSAGE_ERROR) {
                throw new Error("dataBase: " + error.response.data.message);
            }
        }
    }
}
