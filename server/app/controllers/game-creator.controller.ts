import { NextFunction, Request, Response, Router } from "express";
import e = require("express");
import { inject, injectable } from "inversify";
import * as multer from "multer";
import {GAME_NAME_FIELD} from "../services/data-base.service";
import { GameCreatorService } from "../services/game-creator.service";
import Types from "../types";

export const ORIGINAL_IMAGE_IDENTIFIER: string = "originalImage";
export const MODIFIED_IMAGE_IDENTIFIER: string = "modifiedImage";
const EXPECTED_FILES_FORMAT: string = "image/bmp";

// error messages
export const DIFFERENCE_ERROR_MESSAGE: string = "Error: The images that you sent don't have seven difference!";
export const FORMAT_ERROR_MESSAGE: string = "Error: Request sent by the client had the wrong format!";
export const NAME_ERROR_MESSAGE: string = "Error: The game name that you sent already exists!";
export const BMP_ERROR_MESSAGE: string = "Error: Sent files are not in bmp format!";

@injectable()
export class GameCreatorController {
    private readonly _storage: multer.StorageEngine;
    private readonly _multer: multer.Instance;
    private readonly _cpUpload: e.RequestHandler;

    public constructor(@inject(Types.GameCreatorService) private gameCreatorService: GameCreatorService) {
        this._storage = multer.diskStorage({
            destination: (req: Express.Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
                cb(null, "./tmp");
            },
            filename: (req: Express.Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
                cb(null, file.fieldname + "-" + Date.now() + ".bmp");
            },
        });
        this._multer = multer({
            storage: this._storage,
            fileFilter: (req: Express.Request,
                         file: Express.Multer.File,
                         cb: (error: Error | null, acceptFile: boolean) => void) => {
                if (file.mimetype !== EXPECTED_FILES_FORMAT) {
                    //TODO validate files(maybe extern validator)
                    return cb(new Error(BMP_ERROR_MESSAGE), false);
                }

                cb(null, true);

            },
        });
        this._cpUpload = this._multer.fields([{name: ORIGINAL_IMAGE_IDENTIFIER, maxCount: 1},
                                              {name: MODIFIED_IMAGE_IDENTIFIER, maxCount: 1}]);
    }

    public get router(): Router {
        const router: Router = Router();

        router.post("/create-simple-game",
                    this._cpUpload,
                    async (req: Request, res: Response, next: NextFunction) => {
            try {
                this.validityTest(req);
                res.json(await this.gameCreatorService.createSimpleGame(
                    req.body[GAME_NAME_FIELD],
                    req.files[ORIGINAL_IMAGE_IDENTIFIER][0].path,
                    req.files[MODIFIED_IMAGE_IDENTIFIER][0].path));
            } catch (error) {
                next(error);
            }

        });

        return router;
    }

    private validityTest(req: Request): void {
        if (typeof req.files[ORIGINAL_IMAGE_IDENTIFIER] === "undefined" ||
            typeof req.files[MODIFIED_IMAGE_IDENTIFIER] === "undefined" ||
            typeof req.files[ORIGINAL_IMAGE_IDENTIFIER][0] === "undefined" ||
            typeof req.files[MODIFIED_IMAGE_IDENTIFIER][0] === "undefined") {
            throw new Error(FORMAT_ERROR_MESSAGE);
        }
        if (typeof req.body[GAME_NAME_FIELD] !== "string" || req.body[GAME_NAME_FIELD] === "") {
            throw new Error(FORMAT_ERROR_MESSAGE);
        }
    }
}
