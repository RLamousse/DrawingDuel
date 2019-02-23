import Axios, {AxiosResponse} from "axios";
import * as FormData from "form-data";
import * as Httpstatus from "http-status-codes";
import {inject, injectable} from "inversify";
import "reflect-metadata";
import {Message} from "../../../common/communication/messages/message";
import {Bitmap} from "../../../common/image/bitmap/bitmap";
import {BITMAP_MEME_TYPE} from "../../../common/image/bitmap/bitmap-utils";
import {TIMES_ARRAY_SIZE} from "../../../common/model/game/game";
import {IRecordTime} from "../../../common/model/game/record-time";
import {ISimpleDifferenceData, ISimpleGame} from "../../../common/model/game/simple-game";
import {
    DIFFERENCE_ERROR_MESSAGE,
    GAME_CREATION_SUCCESS_MESSAGE,
    MODIFIED_IMAGE_FIELD_NAME,
    NAME_ERROR_MESSAGE,
    NON_EXISTING_THEME,
    ORIGINAL_IMAGE_FIELD_NAME,
    OUTPUT_FILE_NAME_FIELD_NAME
} from "../controllers/controller-utils";
import {BitmapFactory} from "../images/bitmap/bitmap-factory";
import Types from "../types";
import {NON_EXISTING_GAME_ERROR_MESSAGE} from "./db/simple-games.collection.service";
import {DifferenceEvaluatorService} from "./difference-evaluator.service";
import {ImageUploadService} from "./image-upload.service";
import {IFreeGame} from "../../../common/model/game/free-game";
import {
    ModificationType,
    ObjectGeometry,
    Themes
} from "../../../common/free-game-json-interface/FreeGameCreatorInterface/free-game-enum";
import {FreeGameCreatorService} from "./free-game-creator.service";
import {IScenesJSON} from "../../../common/free-game-json-interface/JSONInterface/IScenesJSON";

export const EXPECTED_DIFF_NUMBER: number = 7;

@injectable()
export class GameCreatorService {

    public constructor(
        @inject(Types.DifferenceEvaluatorService) private differenceEvaluatorService: DifferenceEvaluatorService,
        @inject(Types.ImageUploadService) private imageUploadService: ImageUploadService) {}

    private readonly _MIN_GENERATED_SCORE: number = 20;
    private readonly _MAX_GENERATED_SCORE: number = 120;
    private readonly _GENERATED_NAMES: string[] = ["normie", "hardTryer4269", "xXx_D4B0W5_xXx"];

    private static async testNameExistence(gameName: string): Promise<void> {
        try {
            await Axios.get<ISimpleGame>("http://localhost:3000/api/data-base/games/simple/" + gameName);
        } catch (error) {
            if (error.response.status !== Httpstatus.NOT_FOUND) {
                throw new Error("dataBase: " + error.response.data.message);
            }
            try {
                await Axios.get<IFreeGame>("http://localhost:3000/api/data-base/games/free/" + gameName);
            } catch (error) {
                if (error.response.status !== Httpstatus.NOT_FOUND) {
                    throw new Error("dataBase: " + error.response.data.message);
                }
                return;
            }
        }
        throw new Error(NAME_ERROR_MESSAGE);
    }

    private static async getDiffImage(originalImageFile: Buffer, modifiedImageFile: Buffer): Promise<Buffer> {
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

    public async createFreeGame(gameName: string, numberOfObjects: number, theme: Themes, modTypes: ModificationType[]): Promise<Message> {

        await GameCreatorService.testNameExistence(gameName);

        const scenes: IScenesJSON = this.generateScene(numberOfObjects, theme, modTypes);

        return await this.generateFreeGame(gameName, scenes);
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
            if (error.message !== NON_EXISTING_GAME_ERROR_MESSAGE) {
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
        await Axios.post<Message>("http://localhost:3000/api/data-base/games/simple/", game)
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
        await Axios.post<Message>("http://localhost:3000/api/data-base/games/free/", game)
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
        for (const I of scoreArray) {
            scoreArray[I] = Number((this._MIN_GENERATED_SCORE +
                Math.random() * (this._MAX_GENERATED_SCORE - this._MIN_GENERATED_SCORE)).toFixed(0));
        }

        scoreArray.sort();

        return [{name: this._GENERATED_NAMES[2], time: scoreArray[2]},
                {name: this._GENERATED_NAMES[1], time: scoreArray[1]},
                {name: this._GENERATED_NAMES[0], time: scoreArray[0]}];
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
            throw new Error(DIFFERENCE_ERROR_MESSAGE);
        }

        return diffData;
    }

    private async generateFreeGame(gameName: string, scenes: IScenesJSON): Promise<Message> {
        await this.uploadFreeGame(gameName, scenes);
        return GAME_CREATION_SUCCESS_MESSAGE;
    }

    private generateScene(numberOfObjects: number, theme: Themes, modTypes: ModificationType[]): IScenesJSON {
        if (theme === Themes.Geometry) {
            const sceneCreator: FreeGameCreatorService = new FreeGameCreatorService(numberOfObjects,
                [ObjectGeometry.sphere,
                    ObjectGeometry.cube,
                    ObjectGeometry.cone,
                    ObjectGeometry.cylinder,
                    ObjectGeometry.pyramid],
                modTypes);

            sceneCreator.generateIScenes();
            return {originalObjects: sceneCreator.objects, modifiedObjects: sceneCreator.modifiedObjects};
        }
        throw new Error(NON_EXISTING_THEME);
    }
}
