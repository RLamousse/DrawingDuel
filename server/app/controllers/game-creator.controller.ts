import { NextFunction, Request, Response, Router } from "express";
import e = require("express");
import * as fs from "fs";
import { inject, injectable } from "inversify";
import * as multer from "multer";
import * as os from "os";
import {GAME_NAME_FIELD} from "../services/data-base.service";
import { GameCreatorService } from "../services/game-creator.service";
import Types from "../types";
import {
    assertFieldOfRequest,
    assertRequestImageFilesFields,
    BITMAP_MULTER_FILTER,
    MODIFIED_IMAGE_FIELD_NAME,
    MULTER_BMP_FIELDS, ORIGINAL_IMAGE_FIELD_NAME
} from "./controller-utils";

@injectable()
export class GameCreatorController {
    private readonly _storage: multer.StorageEngine;
    private readonly _multer: multer.Instance;
    private readonly _cpUpload: e.RequestHandler;

    public constructor(@inject(Types.GameCreatorService) private gameCreatorService: GameCreatorService) {

//TODO copy rightly named files in tmp, and tell that to the phillips too!
        this._storage = multer.diskStorage({
            destination: (req: Express.Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
                cb(null, os.tmpdir());
            },
            filename: (req: Express.Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
                cb(null, file.fieldname + "-" + Date.now() + ".bmp");
            },
        });
        this._multer = multer({
            storage: this._storage,
            fileFilter: BITMAP_MULTER_FILTER,
        });
        this._cpUpload = this._multer.fields(MULTER_BMP_FIELDS);
    }

    public get router(): Router {
        const router: Router = Router();

        router.post("/create-simple-game", this._cpUpload, async (req: Request, res: Response, next: NextFunction) => {
            try {
                assertFieldOfRequest(req, GAME_NAME_FIELD);
                assertRequestImageFilesFields(req);

                res.json(await this.gameCreatorService.createSimpleGame(
                    req.body[GAME_NAME_FIELD],
                    req.files[ORIGINAL_IMAGE_FIELD_NAME][0].path,
                    req.files[MODIFIED_IMAGE_FIELD_NAME][0].path));

            } catch (error) {
                next(error);
            } finally {
                this.deleteTmpFiles(req.files[ORIGINAL_IMAGE_FIELD_NAME][0].path,
                                    req.files[MODIFIED_IMAGE_FIELD_NAME][0].path);
            }
        });

        return router;
    }

    private deleteTmpFiles(originalImageFile: string, modifiedImageFile: string): void {

        fs.unlink(originalImageFile, (error: Error) => {
            if (error) { console.dir("file " + originalImageFile + " was not found"); }
        });
        fs.unlink(modifiedImageFile, (error: Error) => {
            if (error) { console.dir("file " + modifiedImageFile + " was not found"); }
        });
    }
}
