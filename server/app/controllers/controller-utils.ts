import {NextFunction, Request, Response} from "express";
import * as HttpStatus from "http-status-codes";
import {Field} from "multer";
import {Message} from "../../../common/communication/messages/message";
import {GAME_NAME_FIELD} from "../../../common/communication/requests/game-creator.controller.request";
import {IllegalImageFormatError} from "../../../common/errors/bitmap.errors";
import {RequestFormatError} from "../../../common/errors/controller.errors";
import {
    ModificationType,
    Themes
} from "../../../common/free-game-json-interface/FreeGameCreatorInterface/free-game-enum";
import {OnlineType} from "../../../common/model/game/game";
import {EXPECTED_DIFF_NUMBER} from "../services/game-creator.service";

export const REQUIRED_IMAGE_HEIGHT: number = 480;
export const REQUIRED_IMAGE_WIDTH: number = 640;
export const OUTPUT_FILE_NAME_FIELD_NAME: string = "name";
export const ORIGINAL_IMAGE_FIELD_NAME: string = "originalImage";
export const MODIFIED_IMAGE_FIELD_NAME: string = "modifiedImage";
export const EXPECTED_FILES_FORMAT: string = "image/bmp";
export const GAME_CREATION_SUCCESS_MESSAGE: Message = {title: "Game created", body: "The game was successfully created!"};

const NUMBER_OF_MODIFICATION_TYPES: number = 3;
export const MAX_3D_OBJECTS: number = 1000;

export const BITMAP_MULTER_FILTER:
    (req: Express.Request, file: Express.Multer.File, cb: (error: (Error | null), acceptFile: boolean) => void) => void =
    (req: Express.Request, file: Express.Multer.File, cb: (error: Error | null, acceptFile: boolean) => void) => {
        if (file.mimetype !== EXPECTED_FILES_FORMAT) {
            return cb(new IllegalImageFormatError(), false);
        }

        return cb(null, true);
    };
export const MULTER_BMP_FIELDS: Field[] = [{name: ORIGINAL_IMAGE_FIELD_NAME, maxCount: 1}, {name: MODIFIED_IMAGE_FIELD_NAME, maxCount: 1}];

export const assertRequestImageFilesFields: (req: Express.Request) => void = (req: Request): void => {
    if (typeof req.files[ORIGINAL_IMAGE_FIELD_NAME] === "undefined" ||
        typeof req.files[MODIFIED_IMAGE_FIELD_NAME] === "undefined" ||
        typeof req.files[ORIGINAL_IMAGE_FIELD_NAME][0] === "undefined" ||
        typeof req.files[MODIFIED_IMAGE_FIELD_NAME][0] === "undefined") {
        throw new RequestFormatError();
    }
};

export const assertUpdateScoreTable: (req: Express.Request) => void = (req: Request): void => {
    if (typeof req.body.gameName !== "string" ||
    req.body.gameName === "" ||
    !req.body.newTime ||
    typeof req.body.newTime.name !== "string" ||
    typeof req.body.newTime.time !== "number" ||
    req.body.newTime.name === "" ||
    !(req.body.onlineType === OnlineType.SOLO ||
    req.body.onlineType === OnlineType.MULTIPLAYER)) {
        throw new RequestFormatError();
    }
};

export const assertBodyFieldsOfRequest: (req: Request, ...fields: string[]) => void = (req: Request, ...fields: string[]): void => {
    let field: string;
    for (field of fields) {
        if (typeof req.body[field] === "undefined" || req.body[field] === "") {
            throw new RequestFormatError();
        }
    }
};

export const assertBodyFieldsOfQuery: (req: Request, ...fields: string[]) => void = (req: Request, ...fields: string[]): void => {
    let field: string;
    for (field of fields) {
        if (typeof req.params[field] === "undefined" || req.params[field] === "") {
            throw new RequestFormatError();
        }
    }
};

const assertBasicSceneFields: (req: Request) => boolean = (req: Request): boolean => {
    return (req.body.theme !== Themes.Geometry &&
        req.body.theme !== Themes.Sanic &&
        req.body.theme !== Themes.Space) ||
        !Array.isArray(req.body.modificationTypes) ||
        req.body.modificationTypes.length < 1 ||
        req.body.modificationTypes.length > NUMBER_OF_MODIFICATION_TYPES ||
        !(req.body.objectQuantity <= MAX_3D_OBJECTS && req.body.objectQuantity >= 0) ||
        (req.body.objectQuantity < EXPECTED_DIFF_NUMBER &&
            req.body.modificationTypes.indexOf(ModificationType.remove) >= 0);
};

const assertModificationType: (modificationType: ModificationType) => boolean = (modificationType: ModificationType): boolean => {
    return modificationType !== ModificationType.add &&
        modificationType !== ModificationType.remove &&
        modificationType !== ModificationType.changeColor;
};

export const assertRequestSceneFields: (req: Express.Request) => void = (req: Request): void => {
    assertBodyFieldsOfRequest(req, GAME_NAME_FIELD);

    if (assertBasicSceneFields(req)) {
        throw new RequestFormatError();
    }
    for (const modificationType of req.body.modificationTypes) {
        if (assertModificationType(modificationType)) {
            throw new RequestFormatError();
        }
    }
};

export const assertParamsOfRequest: (req: Request, ...parms: string[]) => void = (req: Request, ...parms: string[]): void => {
    let param: string;
    for (param of parms) {
        if (typeof req.query[param] === "undefined" || req.query[param] === "") {
            throw new RequestFormatError();
        }
    }
};

export const executeSafely: (res: Response, next: NextFunction, func: () => void) => void =
    (res: Response, next: NextFunction, func: () => void): void => {
        try {
            func();
        } catch (error) {
            if (error.message === RequestFormatError.FORMAT_ERROR_MESSAGE) {
                res.status(HttpStatus.BAD_REQUEST);
            }
            next(error);
        }
    };

export const executePromiseSafely: (res: Response, next: NextFunction, func: () => Promise<void>) => void =
    (res: Response, next: NextFunction, func: () => Promise<void>): void => {
        func().catch((reason: Error) => {
            if (reason.message === RequestFormatError.FORMAT_ERROR_MESSAGE) {
                res.status(HttpStatus.BAD_REQUEST);
            }

            return next(reason);
        });
    };
