import Axios, {AxiosResponse} from "axios";
import * as FormData from "form-data";
import * as fs from "fs";
import {inject, injectable} from "inversify";
import "reflect-metadata";
import {Message} from "../../../common/communication/messages/message";
import {IBitmapDiffControllerResponse} from "../../../common/communication/response/bitmap-diff-controller.response";
import {Bitmap} from "../../../common/image/bitmap/bitmap";
import {BITMAP_MEME_TYPE} from "../../../common/image/bitmap/bitmap-utils";
import {IGame, GameType, TIMES_ARRAY_SIZE} from "../../../common/model/IGame";
import {
    DIFFERENCE_ERROR_MESSAGE, FORM_DATA_CONTENT_TYPE, MODIFIED_IMAGE_FIELD_NAME,
    NAME_ERROR_MESSAGE, ORIGINAL_IMAGE_FIELD_NAME,
    OUTPUT_FILE_NAME_FIELD_NAME
} from "../controllers/controller-utils";
import {BitmapFactory} from "../images/bitmap/bitmap-factory";
import Types from "../types";
import {
    ALREADY_EXISTING_GAME_MESSAGE_ERROR, GAME_FIELD,
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

    public async createSimpleGame(gameName: string, originalImageFile: Buffer, modifiedImageFile: Buffer): Promise<Message> {

        await this.testNameExistance(gameName);

        const bitmapDiffImage: IBitmapDiffControllerResponse = await this.getDiffImage(originalImageFile, modifiedImageFile);
        this.testNumberOfDifference(bitmapDiffImage);

        return this.generateGame(gameName, originalImageFile, modifiedImageFile, Buffer.from(bitmapDiffImage.diffImageBuffer));
    }

    private async generateGame(gameName: string, originalImage: Buffer, modifiedImage: Buffer, diffImageBuffer: Buffer): Promise<Message> {
        fs.writeFileSync(this._PATH_TO_IMAGES + gameName + this._LOCAL_PICTURE_IMAGES_END[0], originalImage.buffer);
        fs.writeFileSync(this._PATH_TO_IMAGES + gameName + this._LOCAL_PICTURE_IMAGES_END[1], modifiedImage.buffer);

        const GAME: IGame = {
            gameType: GameType.SIMPLE,
            bestMultiTimes: this.createRandomScores(),
            bestSoloTimes: this.createRandomScores(),
            gameName: gameName,
            modifiedImage: this._PATH_TO_IMAGES + gameName + this._LOCAL_PICTURE_IMAGES_END[0],
            originalImage: this._PATH_TO_IMAGES + modifiedImage + this._LOCAL_PICTURE_IMAGES_END[1],
        };
        try {
            await Axios.post<IGame>("http://localhost:3000/api/data-base/games",
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

        scoreArray.sort();

        return [{name: this._GENERATED_NAMES[2], time: scoreArray[2]},
                {name: this._GENERATED_NAMES[1], time: scoreArray[1]},
                {name: this._GENERATED_NAMES[0], time: scoreArray[0]}];
    }

    private async testNameExistance(gameName: string): Promise<void> {

        try {
            await Axios.get<IGame>("http://localhost:3000/api/data-base/games/" + gameName);
        } catch (error) {
            if (error.response.data.message !== NOT_EXISTING_GAME_MESSAGE_ERROR) {
                throw new Error("dataBase: " + error.response.data.message);
            }

            return;
        }
        throw new Error(NAME_ERROR_MESSAGE);
    }

    private testNumberOfDifference(diffImage: IBitmapDiffControllerResponse): void {
        let diffNumber: number;
        try {
            const diffBitmap: Bitmap = BitmapFactory.createBitmap(diffImage.fileName, Buffer.from(diffImage.diffImageBuffer));
            diffNumber = this.differenceEvaluatorService.getNDifferences(diffBitmap.pixels);
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
}
