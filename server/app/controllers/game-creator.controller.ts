import { NextFunction, Request, Response, Router } from "express";
import e = require("express");
import { inject, injectable } from "inversify";
import * as multer from "multer";
import {Message} from "../../../common/communication/message";
import { GameCreatorService } from "../services/game-creator.service";
import Types from "../types";

export const UPLOAD_PATH: string = "tmp/";
export const ORIGINAL_IMAGE_IDENTIFIER: string = "originalImage";
export const MODIFIED_IMAGE_IDENTIFIER: string = "modifiedImage";
const EXPECTED_FILES_FORMAT: string = "image/bmp";
const FILE_NAME_KEY: string = "filename";

const FILE_FILTER: Function = (req: Request, file: Express.Multer.File, cb: Function) => {
    cb(null, file.mimetype === EXPECTED_FILES_FORMAT);
};
const STORAGE: multer.StorageEngine = multer.diskStorage({
    destination: (req: Request, file: Express.Multer.File, cb: Function) => {
        cb(null, UPLOAD_PATH);
    },
    filename: (req: Request, file: Express.Multer.File, cb: Function) => {
        cb(null, file.fieldname + "-" + Date.now());
    },
});

// @ts-ignore
const UPLOAD: multer.Instance = multer({ fileFilter: FILE_FILTER, storage: STORAGE});
const CP_UPLOAD: e.RequestHandler = UPLOAD.fields([{name: ORIGINAL_IMAGE_IDENTIFIER, maxCount: 1},
                                                   {name: MODIFIED_IMAGE_IDENTIFIER, maxCount: 1}]);

const GAME_NAME_IDENTIFIER: string = "gameName";

// error messages
const FORMAT_ERROR_MESSAGE: string = "Request sent by the client had the wrong format!";
const DIFFERENCE_ERROR_MESSAGE: string = "The images that you sent don't have seven difference!";
const NAME_ERROR_MESSAGE: string = "The game name that you sent already exists!";

const CONFIRM_MESSAGE: Message =  {title: "All good!", body: "Game successfully created!"};

export enum GameCreationStatus {
    FormatError,
    DifferenceError,
    NameError,
    OtherError,
    AllGood,
}

@injectable()
export class GameCreatorController {

    public constructor(@inject(Types.GameCreatorService) private gameCreatorService: GameCreatorService) { }

    public get router(): Router {
        const router: Router = Router();

        router.post("/createSimpleGame",
                    CP_UPLOAD,
                    async (req: Request, res: Response, next: NextFunction) => {
            if (!this.validityTest(req)) {
                next(new Error(FORMAT_ERROR_MESSAGE));
            } else {
                switch (this.gameCreatorService.createSimpleGame(
                    req.body[GAME_NAME_IDENTIFIER],
                    req.files[ORIGINAL_IMAGE_IDENTIFIER][0][FILE_NAME_KEY],
                    req.files[MODIFIED_IMAGE_IDENTIFIER][0][FILE_NAME_KEY])) {
                        case GameCreationStatus.FormatError: {
                            next(new Error(FORMAT_ERROR_MESSAGE));
                            break;
                        }
                        case GameCreationStatus.DifferenceError: {
                            next(new Error(DIFFERENCE_ERROR_MESSAGE));
                            break;
                        }
                        case GameCreationStatus.NameError: {
                            next(new Error(NAME_ERROR_MESSAGE));
                            break;
                        }
                        case GameCreationStatus.AllGood: {
                            res.json(CONFIRM_MESSAGE);
                            break;
                        }
                        case GameCreationStatus.OtherError: {
                            console.error("An unexpected error occurred in gameCreatorService.createSimpleGame!");
                            break;
                        }
                        default: {
                            console.error("Error with gameCreatorService.createSimpleGame return value!");
                        }
                    }
            }

        });

        return router;
    }

    private validityTest(req: Request): boolean {
        try {
            return (req.files[ORIGINAL_IMAGE_IDENTIFIER].length === 1 &&
                    req.files[MODIFIED_IMAGE_IDENTIFIER].length === 1 &&
                    req.body[GAME_NAME_IDENTIFIER] !== "");
        } catch (error) {
            return false;
        }
    }
}
