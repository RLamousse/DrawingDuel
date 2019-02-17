import Axios, {AxiosResponse} from "axios";
import * as FormData from "form-data";
import * as Httpstatus from "http-status-codes";
import {inject, injectable} from "inversify";
import "reflect-metadata";
import {Message} from "../../../common/communication/messages/message";
import {Bitmap} from "../../../common/image/bitmap/bitmap";
import {BITMAP_MEME_TYPE} from "../../../common/image/bitmap/bitmap-utils";
import {ISimpleDifferenceData} from "../../../common/model/game/differences/simple-difference-data";
import {Game, TIMES_ARRAY_SIZE} from "../../../common/model/game/game";
import {IRecordTime} from "../../../common/model/game/record-time";
import SimpleGame from "../../../common/model/game/simple-game";
import {
    DIFFERENCE_ERROR_MESSAGE, MODIFIED_IMAGE_FIELD_NAME,
    NAME_ERROR_MESSAGE, ORIGINAL_IMAGE_FIELD_NAME,
    OUTPUT_FILE_NAME_FIELD_NAME
} from "../controllers/controller-utils";
import {BitmapFactory} from "../images/bitmap/bitmap-factory";
import Types from "../types";
import {ALREADY_EXISTING_GAME_MESSAGE_ERROR, NON_EXISTING_GAME_ERROR_MESSAGE} from "./db/games.collection.service";
import {DifferenceEvaluatorService} from "./difference-evaluator.service";
import {ImageUploadService} from "./image-upload.service";

export const EXPECTED_DIFF_NUMBER: number = 7;

@injectable()
export class GameCreatorService {

    public constructor(
        @inject(Types.DifferenceEvaluatorService) private differenceEvaluatorService: DifferenceEvaluatorService,
        @inject(Types.ImageUploadService) private imageUploadService: ImageUploadService) {}

    private readonly _MIN_GENERATED_SCORE: number = 20;
    private readonly _MAX_GENERATED_SCORE: number = 120;
    private readonly _GENERATED_NAMES: string[] = ["normie", "hardTryer4269", "xXx_D4B0W5_xXx"];

    public async createSimpleGame(gameName: string, originalImageFile: Buffer, modifiedImageFile: Buffer): Promise<Message> {

        await this.testNameExistance(gameName);

        const bitmapDiffImageBuffer: Buffer = await this.getDiffImage(originalImageFile, modifiedImageFile);
        const differenceData: ISimpleDifferenceData = this.testNumberOfDifference(bitmapDiffImageBuffer);

        return this.generateGame(gameName, originalImageFile, modifiedImageFile, differenceData);
    }

    private async generateGame(gameName: string,
                               originalImage: Buffer,
                               modifiedImage: Buffer,
                               differenceData: ISimpleDifferenceData): Promise<Message> {
        try {
            const imagesUrls: string[] = await this.uploadImages(originalImage, modifiedImage);
            await this.uploadGame(gameName, imagesUrls, differenceData);
        } catch (error) {
            if (error.response.data.message === ALREADY_EXISTING_GAME_MESSAGE_ERROR) {
                throw new Error(NAME_ERROR_MESSAGE);
            } else if (error.response.data.message !== NON_EXISTING_GAME_ERROR_MESSAGE) {
                throw new Error("dataBase: " + error.response.data.message);
            }
        }

        return {title: "Game created", body: "The game was successfully created!"};
    }

    private async uploadGame(gameName: string, imagesUrls: string[], differenceData: ISimpleDifferenceData): Promise<void> {
        const game: SimpleGame = new SimpleGame(
            gameName,
            differenceData,
            this.createRandomScores(), this.createRandomScores(),
            imagesUrls[0], imagesUrls[1],
        );
        await Axios.post<Game>("http://localhost:3000/api/data-base/games", game);
    }

    private async uploadImages(...imageBuffers: Buffer[]): Promise<string[]> {

        const imagesUrls: string[] = [];
        for (const image of imageBuffers) {
            imagesUrls.push(await this.imageUploadService.uploadImage(image));
        }

        return imagesUrls;
    }

    private createRandomScores(): IRecordTime[] {

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
            await Axios.get<Game>("http://localhost:3000/api/data-base/games/" + gameName);
        } catch (error) {
            if (error.response.status !== Httpstatus.NOT_FOUND) {
                throw new Error("dataBase: " + error.response.data.message);
            }

            return;
        }
        throw new Error(NAME_ERROR_MESSAGE);
    }

    private testNumberOfDifference(diffImage: Buffer): ISimpleDifferenceData {
        let diffData: ISimpleDifferenceData;
        try {
            const diffBitmap: Bitmap = BitmapFactory.createBitmap("diffImage", diffImage);
            diffData = this.differenceEvaluatorService.getNDifferences(diffBitmap.pixels);
        } catch (error) {
            throw new Error("bmp diff counting: " + error.message);
        }
        if (diffData.size !== EXPECTED_DIFF_NUMBER) {
            throw new Error(DIFFERENCE_ERROR_MESSAGE);
        }

        return diffData;
    }

    private async getDiffImage(originalImageFile: Buffer, modifiedImageFile: Buffer): Promise<Buffer> {
        try {
            const requestFormData: FormData = new FormData();
            requestFormData.append(OUTPUT_FILE_NAME_FIELD_NAME, "image-diff-" + Date.now() + ".bmp");
            requestFormData.append(ORIGINAL_IMAGE_FIELD_NAME, originalImageFile, {contentType: BITMAP_MEME_TYPE, filename: "original.bmp"});
            requestFormData.append(MODIFIED_IMAGE_FIELD_NAME, modifiedImageFile, {contentType: BITMAP_MEME_TYPE, filename: "modified.bmp"});
            const response: AxiosResponse<ArrayBuffer> = await Axios.post<ArrayBuffer>(
                "http://localhost:3000/api/image-diff/",
                requestFormData,
                {
                    headers: requestFormData.getHeaders(),
                    responseType: "arraybuffer",
                },
            );

            return Buffer.from(response.data);
        } catch (error) {
            throw new Error("game diff: " + error.response.data.message);
        }
    }
}
