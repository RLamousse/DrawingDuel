import Axios, {AxiosResponse} from "axios";
import * as FormData from "form-data";
import * as fs from "fs";
import {inject, injectable} from "inversify";
import "reflect-metadata";
import {Message} from "../../../common/communication/message";
import {BITMAP_MEME_TYPE} from "../../../common/image/bitmap/bitmap-utils";
import {Game, TIMES_ARRAY_SIZE} from "../../../common/model/game";
import {IBitmapDiffControllerResponse} from "../controllers/bitmap-diff.controller";
import {
    DIFFERENCE_ERROR_MESSAGE, FORM_DATA_CONTENT_TYPE, MODIFIED_IMAGE_FIELD_NAME,
    NAME_ERROR_MESSAGE, ORIGINAL_IMAGE_FIELD_NAME,
    OUTPUT_FILE_NAME_FIELD_NAME
} from "../controllers/controller-utils";
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
    private readonly SUCCESS_MESSAGE: Message = {title: "Game created", body: "The game was successfully created!"};

    public async createSimpleGame(gameName: string, originalImageFile: Buffer, modifiedImageFile: Buffer): Promise<Message> {

        await this.testNameExistance(gameName);

        const bitmapDiffImage: IBitmapDiffControllerResponse = await this.getDiffImage(originalImageFile, modifiedImageFile);
        this.testSimpleGameNumberOfDifference(bitmapDiffImage);

        return this.generateSimpleGame(gameName, originalImageFile, modifiedImageFile);
    }

    public async createFreeGame(gameName: string, originalScene: Buffer, modifiedScene: Buffer): Promise<Message> {

        await this.testNameExistance(gameName);

        this.testfreeGameNumberOfDiffs(originalScene, modifiedScene);

        return this.generateFreeGame(gameName, originalScene, modifiedScene);
    }

    private async generateSimpleGame(gameName: string, originalImage: Buffer, modifiedImage: Buffer): Promise<Message> {
        fs.writeFileSync(this._PATH_TO_IMAGES + gameName + this._LOCAL_PICTURE_IMAGES_END[0], originalImage.buffer);
        fs.writeFileSync(this._PATH_TO_IMAGES + gameName + this._LOCAL_PICTURE_IMAGES_END[1], modifiedImage.buffer);

        const GAME: Game = {
            isSimpleGame: true,
            bestMultiTimes: this.createRandomScores(),
            bestSoloTimes: this.createRandomScores(),
            gameName: gameName,
            modifiedImage: this._PATH_TO_IMAGES + gameName + this._LOCAL_PICTURE_IMAGES_END[0],
            originalImage: this._PATH_TO_IMAGES + modifiedImage + this._LOCAL_PICTURE_IMAGES_END[1],
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

        return this.SUCCESS_MESSAGE;

    }

    private createRandomScores(): {name: string, time: number}[] {

        const scoreArray: number[] = new Array(TIMES_ARRAY_SIZE);
        for (const I of scoreArray) {
            scoreArray[I] = Number((this._MIN_GENERATED_SCORE +
                Math.random() * (this._MAX_GENERATED_SCORE - this._MIN_GENERATED_SCORE)).toFixed(0));
        }

        scoreArray.sort();

        return [{name: this._GENERATED_NAMES[2], time: scoreArray[2]},
                {name: this._GENERATED_NAMES[1], time: scoreArray[1]},
                {name: this._GENERATED_NAMES[0], time: scoreArray[0]}];
    }

    private async testNameExistance(gameName: string): Promise<void> {

        try {
            await Axios.get<Game>("http://localhost:3000/api/data-base/get-game/?" + GAME_NAME_FIELD + "=" + gameName);
        } catch (error) {
            if (error.response.data.message !== NOT_EXISTING_GAME_MESSAGE_ERROR) {
                throw new Error("dataBase: " + error.response.data.message);
            }

            return;
        }
        throw new Error(NAME_ERROR_MESSAGE);
    }

    private testSimpleGameNumberOfDifference(diffImage: IBitmapDiffControllerResponse): void {
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

    private async getDiffImage(originalImageFile: Buffer, modifiedImageFile: Buffer): Promise<IBitmapDiffControllerResponse> {
        try {
            const requestFormData: FormData = new FormData();
            requestFormData.append(OUTPUT_FILE_NAME_FIELD_NAME, "image-diff-" + Date.now() + ".bmp");
            requestFormData.append(ORIGINAL_IMAGE_FIELD_NAME, originalImageFile, {contentType: BITMAP_MEME_TYPE});
            requestFormData.append(MODIFIED_IMAGE_FIELD_NAME, modifiedImageFile, {contentType: BITMAP_MEME_TYPE});

            const response: AxiosResponse<IBitmapDiffControllerResponse> = await Axios.get<IBitmapDiffControllerResponse>(
                "http://localhost:3000/api/image-diff/",
                { data: requestFormData, headers: FORM_DATA_CONTENT_TYPE},
            );

            return response.data;
        } catch (error) {
            throw new Error("game diff: " + error.response.data.message);
        }
    }

    private testfreeGameNumberOfDiffs(originalScene: Buffer, modifiedScene: Buffer): void {

    }

    private async generateFreeGame(gameName: string, originalScene: Buffer, modifiedScene: Buffer): Promise<Message> {
        //TODO insert new way to write files(directly in mongodb)

        //TODO new version of game
        const GAME: Game = {
            isSimpleGame: true,
            bestMultiTimes: this.createRandomScores(),
            bestSoloTimes: this.createRandomScores(),
            gameName: gameName,
            modifiedImage: this._PATH_TO_IMAGES + gameName + this._LOCAL_PICTURE_IMAGES_END[0],
            originalImage: this._PATH_TO_IMAGES + modifiedImage + this._LOCAL_PICTURE_IMAGES_END[1],
        };
        try {
            await Axios.post<Game>("http://localhost:3000/api/data-base/add-game",
                {data: {[GAME_FIELD]: GAME}});
        } catch (error) {
            if (error.response.data.message === ALREADY_EXISTING_GAME_MESSAGE_ERROR) {
                throw new Error(NAME_ERROR_MESSAGE);
            }
            throw new Error("dataBase: " + error.response.data.message);
        }

        return this.SUCCESS_MESSAGE;
    }
}
