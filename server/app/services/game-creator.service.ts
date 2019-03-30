import Axios, {AxiosResponse} from "axios";
import * as FormData from "form-data";
import {inject, injectable} from "inversify";
import "reflect-metadata";
import {Message} from "../../../common/communication/messages/message";
import {DIFF_CREATOR_BASE, SERVER_BASE_URL} from "../../../common/communication/routes";
import {
    AbstractDataBaseError,
    AlreadyExistentGameError,
    NonExistentThemeError
} from "../../../common/errors/database.errors";
import {AbstractServiceError, DifferenceCountError} from "../../../common/errors/services.errors";
import {
    ModificationType,
    Themes
} from "../../../common/free-game-json-interface/FreeGameCreatorInterface/free-game-enum";
import {IScenesDB} from "../../../common/free-game-json-interface/JSONInterface/IScenesJSON";
import {Bitmap} from "../../../common/image/bitmap/bitmap";
import {BITMAP_MEME_TYPE} from "../../../common/image/bitmap/bitmap-utils";
import {IFreeGame} from "../../../common/model/game/free-game";
import {ISimpleDifferenceData, ISimpleGame} from "../../../common/model/game/simple-game";
import {
    GAME_CREATION_SUCCESS_MESSAGE,
    MODIFIED_IMAGE_FIELD_NAME,
    ORIGINAL_IMAGE_FIELD_NAME,
    OUTPUT_FILE_NAME_FIELD_NAME
} from "../controllers/controller-utils";
import {BitmapFactory} from "../images/bitmap/bitmap-factory";
import Types from "../types";
import {DataBaseService} from "./data-base.service";
import {DifferenceEvaluatorService} from "./difference-evaluator.service";
import {FreeGameCreatorService} from "./free-game-creator.service";
import {ImageUploadService} from "./image-upload.service";
import {createRandomScores} from "./service-utils";

export const EXPECTED_DIFF_NUMBER: number = 7;

@injectable()
export class GameCreatorService {

    public constructor(
        @inject(Types.DifferenceEvaluatorService) private differenceEvaluatorService: DifferenceEvaluatorService,
        @inject(Types.DataBaseService) private dataBaseService: DataBaseService,
        @inject(Types.ImageUploadService) private imageUploadService: ImageUploadService,
        @inject(Types.FreeGameCreatorService) private freeGameCreatorService: FreeGameCreatorService) {
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
            throw new AbstractServiceError("game diff: " + error.response.data.message);
        }
    }

    private async testNameExistence(gameName: string): Promise<void> {
        let containsGame: boolean;
        try {
            containsGame = await this.dataBaseService.simpleGames.contains(gameName) ||
                await this.dataBaseService.freeGames.contains(gameName);
        } catch (error) {
            throw new AbstractDataBaseError(error.message);
        }

        if (containsGame) {
            throw new AlreadyExistentGameError();
        }
    }

    public async createFreeGame(gameName: string, numberOfObjects: number, theme: Themes, modTypes: ModificationType[]): Promise<Message> {

        await this.testNameExistence(gameName);

        const scenes: IScenesDB = this.generateScene(numberOfObjects, theme, modTypes);

        return this.generateFreeGame(gameName, scenes);
    }

    public async createSimpleGame(gameName: string, originalImageFile: Buffer, modifiedImageFile: Buffer): Promise<Message> {

        try {
            await this.testNameExistence(gameName);

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
        let imagesUrls: string[];
        try {
            imagesUrls = await this.uploadImages(originalImage, modifiedImage);
        } catch (error) {
            throw new AbstractServiceError(error.message);
        }
        await this.uploadSimpleGame(gameName, imagesUrls, differenceData);

        return GAME_CREATION_SUCCESS_MESSAGE;
    }

    private async uploadSimpleGame(gameName: string, imagesUrls: string[], differenceData: ISimpleDifferenceData): Promise<void> {
        const game: ISimpleGame = {
            gameName: gameName,
            bestSoloTimes: createRandomScores(),
            bestMultiTimes: createRandomScores(),
            originalImage: imagesUrls[0],
            modifiedImage: imagesUrls[1],
            diffData: differenceData,
            toBeDeleted: false,
        };
        try {
            await this.dataBaseService.simpleGames.create(game);
        } catch (error) {
            throw new AbstractDataBaseError(error.message);
        }
    }

    private async uploadFreeGame(gameName: string, scenes: IScenesDB): Promise<void> {
        const game: IFreeGame = {
            gameName: gameName,
            bestSoloTimes: createRandomScores(),
            bestMultiTimes: createRandomScores(),
            scenes: scenes,
            toBeDeleted: false,
        };
        try {
            await this.dataBaseService.freeGames.create(game);
        } catch (error) {
            throw new AbstractDataBaseError(error.message);
        }
    }

    private async uploadImages(...imageBuffers: Buffer[]): Promise<string[]> {

        const imagesUrls: string[] = [];
        for (const image of imageBuffers) {
            imagesUrls.push(await this.imageUploadService.uploadImage(image));
        }

        return imagesUrls;
    }

    private testSimpleGameNumberOfDifference(diffImage: Buffer): ISimpleDifferenceData {
        let diffData: ISimpleDifferenceData;
        try {
            const diffBitmap: Bitmap = BitmapFactory.createBitmap("diffImage", diffImage);
            diffData = this.differenceEvaluatorService.getSimpleNDifferences(diffBitmap.pixels);
        } catch (error) {
            throw new AbstractServiceError("bmp diff counting: " + error.message);
        }
        if (diffData.length !== EXPECTED_DIFF_NUMBER) {
            throw new DifferenceCountError();
        }

        return diffData;
    }

    private async generateFreeGame(gameName: string, scenes: IScenesDB): Promise<Message> {
        await this.uploadFreeGame(gameName, scenes);

        return GAME_CREATION_SUCCESS_MESSAGE;
    }

    private generateScene(numberOfObjects: number, theme: Themes, modTypes: ModificationType[]): IScenesDB {
        if (theme === Themes.Geometry) {

            return this.freeGameCreatorService.generateIScenes(numberOfObjects, modTypes, Themes.Geometry);
        } else if (theme === Themes.Space) {

            return this.freeGameCreatorService.generateIScenes(numberOfObjects, modTypes, Themes.Space);
        }
        throw new NonExistentThemeError();
    }
}
