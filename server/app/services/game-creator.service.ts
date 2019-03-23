import Axios, {AxiosResponse} from "axios";
import * as FormData from "form-data";
import * as Httpstatus from "http-status-codes";
import {inject, injectable} from "inversify";
import "reflect-metadata";
import {Message} from "../../../common/communication/messages/message";
import {DB_FREE_GAME, DB_SIMPLE_GAME, DIFF_CREATOR_BASE, SERVER_BASE_URL} from "../../../common/communication/routes";
import {AlreadyExistentGameError, NonExistentGameError, NonExistentThemeError} from "../../../common/errors/database.errors";
import {DifferenceCountError} from "../../../common/errors/services.errors";
import {
    ModificationType,
    Themes
} from "../../../common/free-game-json-interface/FreeGameCreatorInterface/free-game-enum";
import {IScenesJSON} from "../../../common/free-game-json-interface/JSONInterface/IScenesJSON";
import {Bitmap} from "../../../common/image/bitmap/bitmap";
import {BITMAP_MEME_TYPE} from "../../../common/image/bitmap/bitmap-utils";
import {IFreeGame} from "../../../common/model/game/free-game";
import {TIMES_ARRAY_SIZE} from "../../../common/model/game/game";
import {IRecordTime} from "../../../common/model/game/record-time";
import {ISimpleDifferenceData, ISimpleGame} from "../../../common/model/game/simple-game";
import {
    GAME_CREATION_SUCCESS_MESSAGE,
    MODIFIED_IMAGE_FIELD_NAME,
    ORIGINAL_IMAGE_FIELD_NAME,
    OUTPUT_FILE_NAME_FIELD_NAME
} from "../controllers/controller-utils";
import {BitmapFactory} from "../images/bitmap/bitmap-factory";
import Types from "../types";
import {DifferenceEvaluatorService} from "./difference-evaluator.service";
import {FreeGameCreatorService} from "./free-game-creator.service";
import {ImageUploadService} from "./image-upload.service";

export const EXPECTED_DIFF_NUMBER: number = 7;

@injectable()
export class GameCreatorService {

    public constructor(
        @inject(Types.DifferenceEvaluatorService) private differenceEvaluatorService: DifferenceEvaluatorService,
        @inject(Types.ImageUploadService) private imageUploadService: ImageUploadService,
        @inject(Types.FreeGameCreatorService) private freeGameCreatorService: FreeGameCreatorService) {
    }

    private readonly _MIN_GENERATED_SCORE: number = 120;
    private readonly _MAX_GENERATED_SCORE: number = 360;
    private readonly _GENERATED_NAMES: string[] = ["normie",
                                                   "hardTryer4269",
                                                   "xXx_D4B0W5_xXx",
                                                   "spongebob",
                                                   "pikatchu",
                                                   "sanic",
                                                   "Donald J. Trump",
                                                   "some aliens",
                                                   "ur mom",
                                                   "Som Ting Wong"];

    private static async testNameExistence(gameName: string): Promise<void> {
        try {
            await Axios.get<ISimpleGame>(SERVER_BASE_URL + DB_SIMPLE_GAME + gameName);
        } catch (error) {
            if (error.response.status !== Httpstatus.NOT_FOUND) {
                throw new Error("dataBase: " + error.response.data.message);
            }
            try {
                await Axios.get<IFreeGame>(SERVER_BASE_URL + DB_FREE_GAME + gameName);
            } catch (error) {
                if (error.response.status !== Httpstatus.NOT_FOUND) {
                    throw new Error("dataBase: " + error.response.data.message);
                }

                return;
            }
        }
        throw new AlreadyExistentGameError();
    }

    private static async getDiffImage(originalImageFile: Buffer, modifiedImageFile: Buffer): Promise<Buffer> {
        try {
            const requestFormData: FormData = new FormData();
            requestFormData.append(OUTPUT_FILE_NAME_FIELD_NAME, "image-diff-" + Date.now() + ".bmp");
            requestFormData.append(ORIGINAL_IMAGE_FIELD_NAME, originalImageFile, {contentType: BITMAP_MEME_TYPE, filename: "original.bmp"});
            requestFormData.append(MODIFIED_IMAGE_FIELD_NAME, modifiedImageFile, {contentType: BITMAP_MEME_TYPE, filename: "modified.bmp"});
            const response: AxiosResponse<ArrayBuffer> = await Axios.post<ArrayBuffer>(
                SERVER_BASE_URL + DIFF_CREATOR_BASE,
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

    public async createFreeGame(gameName: string, numberOfObjects: number, theme: Themes, modTypes: ModificationType[]): Promise<Message> {

        await GameCreatorService.testNameExistence(gameName);

        const scenes: IScenesJSON = this.generateScene(numberOfObjects, theme, modTypes);

        return this.generateFreeGame(gameName, scenes);
    }

    public async createSimpleGame(gameName: string, originalImageFile: Buffer, modifiedImageFile: Buffer): Promise<Message> {

        try {
            await GameCreatorService.testNameExistence(gameName);

            const bitmapDiffImageBuffer: Buffer = await GameCreatorService.getDiffImage(originalImageFile, modifiedImageFile);
            const differenceData: ISimpleDifferenceData = this.testSimpleGameNumberOfDifference(bitmapDiffImageBuffer);

            return this.generateSimpleGame(gameName, originalImageFile, modifiedImageFile, differenceData);
        } catch (error) {
            throw error;
        }
    }

    private async generateSimpleGame(gameName: string,
                                     originalImage: Buffer,
                                     modifiedImage: Buffer,
                                     differenceData: ISimpleDifferenceData): Promise<Message> {
        try {
            const imagesUrls: string[] = await this.uploadImages(originalImage, modifiedImage);
            await this.uploadSimpleGame(gameName, imagesUrls, differenceData);
        } catch (error) {
            if (error.message !== NonExistentGameError.NON_EXISTENT_GAME_ERROR_MESSAGE) {
                throw new Error("dataBase: " + error.message);
            }
        }

        return GAME_CREATION_SUCCESS_MESSAGE;
    }

    private async uploadSimpleGame(gameName: string, imagesUrls: string[], differenceData: ISimpleDifferenceData): Promise<void> {
        const game: ISimpleGame = {
            gameName: gameName,
            bestSoloTimes: this.createRandomScores(),
            bestMultiTimes: this.createRandomScores(),
            originalImage: imagesUrls[0],
            modifiedImage: imagesUrls[1],
            diffData: differenceData,
        };
        await Axios.post<Message>(SERVER_BASE_URL + DB_SIMPLE_GAME, game)
        // tslint:disable-next-line:no-any Generic error response
            .catch((reason: any) => {
                throw new Error("Unable to create game: " + reason.response.data.message);
            });
    }

    private async uploadFreeGame(gameName: string, scenes: IScenesJSON): Promise<void> {
        const game: IFreeGame = {
            gameName: gameName,
            bestSoloTimes: this.createRandomScores(),
            bestMultiTimes: this.createRandomScores(),
            scenes: scenes,
        };
        await Axios.post<Message>(SERVER_BASE_URL + DB_FREE_GAME, game)
            // any is the default type of the required callback function
            // tslint:disable-next-line:no-any Generic error response
            .catch((reason: any) => {
                throw new Error("dataBase: Unable to create game: " + reason.response.data.message);
            });
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
        for (let i: number = 0; i < TIMES_ARRAY_SIZE; i++) {
            scoreArray[i] = Number((this._MIN_GENERATED_SCORE +
                Math.random() * (this._MAX_GENERATED_SCORE - this._MIN_GENERATED_SCORE)).toFixed(0));
        }

        scoreArray.sort((a: number, b: number) => b - a);
        const randomNames: string[] = this.generateRandomNames();

        return [{name: randomNames[2], time: scoreArray[2]},
                {name: randomNames[1], time: scoreArray[1]},
                {name: randomNames[0], time: scoreArray[0]}];
    }

    private testSimpleGameNumberOfDifference(diffImage: Buffer): ISimpleDifferenceData {
        let diffData: ISimpleDifferenceData;
        try {
            const diffBitmap: Bitmap = BitmapFactory.createBitmap("diffImage", diffImage);
            diffData = this.differenceEvaluatorService.getSimpleNDifferences(diffBitmap.pixels);
        } catch (error) {
            throw new Error("bmp diff counting: " + error.message);
        }
        if (diffData.length !== EXPECTED_DIFF_NUMBER) {
            throw new DifferenceCountError();
        }

        return diffData;
    }

    private async generateFreeGame(gameName: string, scenes: IScenesJSON): Promise<Message> {
        await this.uploadFreeGame(gameName, scenes);

        return GAME_CREATION_SUCCESS_MESSAGE;
    }

    private generateScene(numberOfObjects: number, theme: Themes, modTypes: ModificationType[]): IScenesJSON {
        if (theme === Themes.Geometry) {

            return this.freeGameCreatorService.generateIScenes(numberOfObjects, modTypes);
        }
        throw new NonExistentThemeError();
    }

    private generateRandomNames(): string[] {
        const randomNamesIndex: number[] = [];
        while (randomNamesIndex.length < TIMES_ARRAY_SIZE) {
            const randomNumber: number = Math.floor(Math.random() * (this._GENERATED_NAMES.length));
            if (randomNamesIndex.indexOf(randomNumber) < 0) {
                randomNamesIndex.push(randomNumber);
            }
        }

        return [this._GENERATED_NAMES[randomNamesIndex[0]],
                this._GENERATED_NAMES[randomNamesIndex[1]],
                this._GENERATED_NAMES[randomNamesIndex[2]]];
    }
}
