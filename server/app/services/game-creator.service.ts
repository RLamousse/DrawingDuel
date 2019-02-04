import Axios from "axios";
import * as fs from "fs";
import {inject, injectable} from "inversify";
import "reflect-metadata";
import {Game, TIMES_ARRAY_SIZE} from "../../../common/Object/game";
import {Message} from "../../../common/communication/message";
import {
    DIFFERENCE_ERROR_MESSAGE, FORMAT_ERROR_MESSAGE,
    NAME_ERROR_MESSAGE
} from "../controllers/game-creator.controller";
import {BitmapFactory} from "../images/bitmap/bitmap-factory";
import Types from "../types";
import {
    ALREADY_EXISTING_GAME_MESSAGE_ERROR, GAME_FIELD,
    GAME_NAME_FIELD,
    NOT_EXISTING_GAME_MESSAGE_ERROR
} from "./data-base.service";
import {DifferenceEvaluatorService} from "./difference-evaluator.service";

export const EXPECTED_DIFF_NUMBER: number = 7;

@injectable()
export class GameCreatorService {

    public constructor(@inject(Types.DifferenceEvaluatorService) private differenceEvaluatorService: DifferenceEvaluatorService) {}

    private readonly _MIN_GENERATED_SCORE: number = 20;
    private readonly _MAX_GENERATED_SCORE: number = 120;
    private readonly _GENERATED_NAMES: string[] = ["normie", "hardTryer4269", "xXx_D4B0W5_xXx"];
    private readonly _LOCAL_PICTURE_IMAGES_END: string[] = ["-originalImage.bmp", "-modifiedImage.bmp"];
    private readonly _PATH_TO_IMAGES: string = "public/";

    public async createSimpleGame(gameName: string, originalImageFile: string, modifiedImageFile: string): Promise<Message> {

        this.testFileExistence(originalImageFile, modifiedImageFile);

        await this.testNameExistance(gameName);

        const DIFF_IMAGE: {status: string, fileName: string, filePath: string} = await this.getDiffImage(originalImageFile,
                                                                                                         modifiedImageFile);
        this.testNumberOfDifference(DIFF_IMAGE);

        return this.generateGame(gameName, originalImageFile, modifiedImageFile);
    }

    // @ts-ignore
    private async generateGame(gameName: string, originalImage: string, modifiedImage: string): Promise<Message> {

        fs.copyFile(originalImage, this._PATH_TO_IMAGES +
            gameName + this._LOCAL_PICTURE_IMAGES_END[0], (err: Error) => {
            if (err) {
                throw err;
            }
        });
        fs.copyFile(modifiedImage, this._PATH_TO_IMAGES +
            gameName + this._LOCAL_PICTURE_IMAGES_END[1],(err: Error) => {
            if (err) {
                throw err;
            }
        });

        const GAME: Game = {
            isSimpleGame: true,
            bestMultiTimes: this.createRandomScores(),
            bestSoloTimes: this.createRandomScores(),
            gameName: gameName,
            modifiedImage: this._PATH_TO_IMAGES +
                gameName + this._LOCAL_PICTURE_IMAGES_END[0],
            originalImage: this._PATH_TO_IMAGES +
                modifiedImage + this._LOCAL_PICTURE_IMAGES_END[1],
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
        for (const I of scoreArray) {
            scoreArray[I] = Number((this._MIN_GENERATED_SCORE +
                Math.random() * (this._MAX_GENERATED_SCORE - this._MIN_GENERATED_SCORE)).toFixed(0));
        }

        scoreArray.sort((a: number, b: number) => {
            if (a < b) {
                return -1;
            }
            if (a > b) {
                return 1;
            } else {
                return 0;
            }
        });

        return [{name: this._GENERATED_NAMES[2], time: scoreArray[2]},
                {name: this._GENERATED_NAMES[1], time: scoreArray[1]},
                {name: this._GENERATED_NAMES[0], time: scoreArray[0]}];
    }

    private async testNameExistance(gameName: string): Promise<void> {

        try {
            await Axios.get<Game>("http://localhost:3000/api/data-base/get-game",
                                  {data: {[GAME_NAME_FIELD]: gameName}});
        } catch (error) {
            if (error.response.data.message !== NOT_EXISTING_GAME_MESSAGE_ERROR) {
                throw new Error("dataBase: " + error.response.data.message);
            }

            return;
        }
        throw new Error(NAME_ERROR_MESSAGE);
    }

    private testNumberOfDifference(diffImage: {status: string, fileName: string, filePath: string}): void {
        let diffNumber: number;
        try {
            diffNumber = this.differenceEvaluatorService.getNDifferences(
                BitmapFactory.createBitmap(diffImage.fileName,
                                           fs.readFileSync(diffImage.filePath)).pixels);
        } catch (error) {
            throw new Error("bmp diff counting: " + error.message);
        }
        if (diffNumber !== EXPECTED_DIFF_NUMBER) {
            throw new Error(DIFFERENCE_ERROR_MESSAGE);
        }
    }

    private async getDiffImage(originalImageFile: string, modifiedImageFile: string): Promise<{status: string,
                                                                                               fileName: string,
                                                                                               filePath: string}> {
        let diffImage: {status: string, fileName: string, filePath: string};
        try {
        diffImage = (await Axios.get<{status: string,
                                      fileName: string,
                                      filePath: string,
        }>("http://localhost:3000/api/image-diff/",
           {data: {name: "image-diff-" + Date.now() + ".bmp",
                   originalImage: originalImageFile,
                   modifiedImage: modifiedImageFile}})).data;

        } catch (error) {
            throw new Error("game diff: " + error.response.data.message);
        }

        return diffImage;
    }

    private testFileExistence(originalImageFile: string, modifiedImageFile: string): void {
        if (!(fs.existsSync(originalImageFile) && fs.existsSync(modifiedImageFile))) {
            throw new Error(FORMAT_ERROR_MESSAGE);
        }
    }
}
