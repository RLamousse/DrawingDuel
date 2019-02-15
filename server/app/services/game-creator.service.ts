import Axios, {AxiosResponse} from "axios";
import * as FormData from "form-data";
import * as Httpstatus from "http-status-codes";
import {inject, injectable} from "inversify";
import "reflect-metadata";
import {Message} from "../../../common/communication/messages/message";
import {Bitmap} from "../../../common/image/bitmap/bitmap";
import {BITMAP_MEME_TYPE} from "../../../common/image/bitmap/bitmap-utils";
import {IBitmapImage} from "../../../common/model/IBitmapImage";
import {GameType, IGame, TIMES_ARRAY_SIZE} from "../../../common/model/IGame";
import {IRecordTime} from "../../../common/model/IRecordTime";
import {bufferToNumberArray} from "../../../common/util/util";
import {
    DIFFERENCE_ERROR_MESSAGE, MODIFIED_IMAGE_FIELD_NAME,
    NAME_ERROR_MESSAGE, ORIGINAL_IMAGE_FIELD_NAME,
    OUTPUT_FILE_NAME_FIELD_NAME
} from "../controllers/controller-utils";
import {BitmapFactory} from "../images/bitmap/bitmap-factory";
import Types from "../types";
import {ALREADY_EXISTING_GAME_MESSAGE_ERROR, NON_EXISTING_GAME_ERROR_MESSAGE} from "./db/games.collection.service";
import {ALREADY_EXISTING_IMAGE_MESSAGE_ERROR} from "./db/images.collection.service";
import {DifferenceEvaluatorService} from "./difference-evaluator.service";

export const EXPECTED_DIFF_NUMBER: number = 7;

@injectable()
export class GameCreatorService {

    public constructor(@inject(Types.DifferenceEvaluatorService) private differenceEvaluatorService: DifferenceEvaluatorService) {}

    private readonly _MIN_GENERATED_SCORE: number = 20;
    private readonly _MAX_GENERATED_SCORE: number = 120;
    private readonly _GENERATED_NAMES: string[] = ["normie", "hardTryer4269", "xXx_D4B0W5_xXx"];
    private readonly GAME_IMAGES_KEYS_SUFFIX: string[] = ["-originalImage.bmp", "-modifiedImage.bmp", "-diffImage.bmp"];

    public async createSimpleGame(gameName: string, originalImageFile: Buffer, modifiedImageFile: Buffer): Promise<Message> {

        await this.testNameExistance(gameName);

        const bitmapDiffImageBuffer: Buffer = await this.getDiffImage(originalImageFile, modifiedImageFile);
        this.testNumberOfDifference(bitmapDiffImageBuffer); // TODO

        return this.generateGame(gameName, originalImageFile, modifiedImageFile);
    }

    private async generateGame(gameName: string, originalImage: Buffer, modifiedImage: Buffer): Promise<Message> {
        try {
            const images: IBitmapImage[] = await this.uploadImages(originalImage, modifiedImage, gameName);
            await this.uploadGame(gameName, images);
        } catch (error) {
            if (error.response.data.message === ALREADY_EXISTING_GAME_MESSAGE_ERROR) {
                throw new Error(NAME_ERROR_MESSAGE);
            } else if (error.response.data.message !== NON_EXISTING_GAME_ERROR_MESSAGE) {
                throw new Error("dataBase: " + error.response.data.message);
            }
        }

        return {title: "Game created", body: "The game was successfully created!"};
    }

    private async uploadGame(gameName: string, images: IBitmapImage[]) {
        const game: IGame = {
            gameType: GameType.SIMPLE,
            bestMultiTimes: this.createRandomScores(),
            bestSoloTimes: this.createRandomScores(),
            gameName: gameName,
            originalImage: images[0].name,
            modifiedImage: images[1].name,
            diffImage: images[2].name,
        };

        await Axios.post<IGame>("http://localhost:3000/api/data-base/games", game);
    }

    private async uploadImages(originalImage: Buffer,
                               modifiedImage: Buffer,
                               gameName: string): Promise<IBitmapImage[]> {

        const images: IBitmapImage[] = [];
        const imageData: Buffer[] = [originalImage, modifiedImage];
        for (let i: number = 0; i < this.GAME_IMAGES_KEYS_SUFFIX.length; i++) {
            const image: IBitmapImage = {
                name: gameName + this.GAME_IMAGES_KEYS_SUFFIX[i],
                data: bufferToNumberArray(imageData[i]),
            };

            await Axios.post<IBitmapImage>("http://localhost:3000/api/data-base/images", image)
                .catch((error: any) => {
                    if (error.message !== ALREADY_EXISTING_IMAGE_MESSAGE_ERROR) {
                        throw error;
                    }
                })
                .then((response: AxiosResponse<IBitmapImage>) => {
                    images.push(response.data);
                });
        }

        return images;
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
            await Axios.get<IGame>("http://localhost:3000/api/data-base/games/" + gameName);
        } catch (error) {
            if (error.response.status !== Httpstatus.NOT_FOUND) {
                throw new Error("dataBase: " + error.response.data.message);
            }

            return;
        }
        throw new Error(NAME_ERROR_MESSAGE);
    }

    private testNumberOfDifference(diffImage: Buffer): void {
        let diffNumber: number;
        try {
            const diffBitmap: Bitmap = BitmapFactory.createBitmap("diffImage", diffImage);
            diffNumber = this.differenceEvaluatorService.getNDifferences(diffBitmap.pixels);
        } catch (error) {
            throw new Error("bmp diff counting: " + error.message);
        }
        if (diffNumber !== EXPECTED_DIFF_NUMBER) {
            throw new Error(DIFFERENCE_ERROR_MESSAGE);
        }
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
