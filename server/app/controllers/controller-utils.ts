import {NextFunction, Request} from "express";
import {Field} from "multer";
import {Message} from "../../../common/communication/messages/message";
import {GAME_NAME_FIELD} from "../../../common/communication/requests/game-creator.controller.request";

export const REQUIRED_IMAGE_HEIGHT: number = 480;
export const REQUIRED_IMAGE_WIDTH: number = 640;
export const OUTPUT_FILE_NAME_FIELD_NAME: string = "name";
export const ORIGINAL_IMAGE_FIELD_NAME: string = "originalImage";
export const NON_EXISTING_THEME: string = "ERROR: The theme is not recognized";
export const MODIFIED_IMAGE_FIELD_NAME: string = "modifiedImage";
export const EXPECTED_FILES_FORMAT: string = "image/bmp";
export const DIFFERENCE_ERROR_MESSAGE: string = "Error: The data that you sent doesn't have seven differences!";
export const GAME_CREATION_SUCCESS_MESSAGE: Message = {title: "Game created", body: "The game was successfully created!"};
export const FORMAT_ERROR_MESSAGE: string = "Error: Request sent by the client had the wrong format!";
export const NAME_ERROR_MESSAGE: string = "Error: The game name that you sent already exists!";
export const BMP_ERROR_MESSAGE: string = "Error: Sent files are not in bmp format!";

export const BITMAP_MULTER_FILTER:
    (req: Express.Request, file: Express.Multer.File, cb: (error: (Error | null), acceptFile: boolean) => void) => void =
    (req: Express.Request, file: Express.Multer.File, cb: (error: Error | null, acceptFile: boolean) => void) => {
    if (file.mimetype !== EXPECTED_FILES_FORMAT) {
        return cb(new Error(BMP_ERROR_MESSAGE), false);
    }

    return cb(null, true);
};
export const MULTER_BMP_FIELDS: Field[] = [{name: ORIGINAL_IMAGE_FIELD_NAME, maxCount: 1}, {name: MODIFIED_IMAGE_FIELD_NAME, maxCount: 1}];

export const assertRequestImageFilesFields: (req: Express.Request) => void = (req: Request): void => {
    if (typeof req.files[ORIGINAL_IMAGE_FIELD_NAME] === "undefined" ||
        typeof req.files[MODIFIED_IMAGE_FIELD_NAME] === "undefined" ||
        typeof req.files[ORIGINAL_IMAGE_FIELD_NAME][0] === "undefined" ||
        typeof req.files[MODIFIED_IMAGE_FIELD_NAME][0] === "undefined") {
            throw new Error(FORMAT_ERROR_MESSAGE);
    }
};

export const assertRequestSceneFields: (req: Express.Request) => void = (req: Request): void => {
    assertFieldsOfRequest(req, GAME_NAME_FIELD);
    //TODO assert these objects like the function just up
    assertFieldsOfRequest(req, "objectQuantity");
    assertFieldsOfRequest(req, "objectTypes");
    assertFieldsOfRequest(req, "modificationTypes"); //TODO after merge with Ballandras, use constants
    //TODO the same convention as phillipe for this request
};

export const assertFieldsOfRequest: (req: Request, ...fields: string[]) => void = (req: Request, ...fields: string[]): void => {
    let field: string;
    for (field of fields) {
        if (typeof req.body[field] === "undefined" || req.body[field] === "") {
            throw new Error(FORMAT_ERROR_MESSAGE);
        }
    }
};

export const executeSafely: (next: NextFunction, func: () => void) => void = (next: NextFunction, func: () => void): void => {
    try {
        func();
    } catch (error) {
        next(error);
    }
};

export const executePromiseSafely: (next: NextFunction, func: () => Promise<void>) => void =
    (next: NextFunction, func: () => Promise<void>): void => {
        func().catch((reason: Error) => next(reason));
};
