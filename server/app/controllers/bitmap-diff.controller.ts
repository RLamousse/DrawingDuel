import {NextFunction, Request, Response, Router} from "express";
import * as HttpStatus from "http-status-codes";
import {inject, injectable} from "inversify";
import {InvalidSizeBitmapError} from "../../../common/errors/bitmap.errors";
import multer = require("multer");
import {Bitmap} from "../../../common/image/bitmap/bitmap";
import {BITMAP_MEME_TYPE} from "../../../common/image/bitmap/bitmap-utils";
import {BitmapFactory} from "../images/bitmap/bitmap-factory";
import {BitmapWriter} from "../images/bitmap/bitmap-writer";
import {BitmapDiffService} from "../services/bitmap-diff.service";
import Types from "../types";
import {
    assertBodyFieldsOfRequest,
    assertRequestImageFilesFields,
    executeSafely,
    BITMAP_MULTER_FILTER,
    MODIFIED_IMAGE_FIELD_NAME,
    MULTER_BMP_FIELDS,
    ORIGINAL_IMAGE_FIELD_NAME,
    OUTPUT_FILE_NAME_FIELD_NAME,
    REQUIRED_IMAGE_HEIGHT,
    REQUIRED_IMAGE_WIDTH
} from "./controller-utils";

@injectable()
export class BitmapDiffController {

    private readonly _storage: multer.StorageEngine;
    private readonly _multer: multer.Instance;

    public constructor(
        @inject(Types.BitmapDiffService) private bitmapDiffService: BitmapDiffService,
        @inject(Types.BitmapWriter) private bitmapWriter: BitmapWriter) {
        this._storage = multer.memoryStorage();
        this._multer = multer({
                                  storage: this._storage,
                                  fileFilter: BITMAP_MULTER_FILTER,
                              });
    }

    public get router(): Router {
        const router: Router = Router();
        router.post("/",
                    this._multer.fields(MULTER_BMP_FIELDS),
                    (req: Request, res: Response, next: NextFunction) => {
                        executeSafely(res, next, () => {
                            const diffFileName: string = req.body[OUTPUT_FILE_NAME_FIELD_NAME];
                            assertBodyFieldsOfRequest(req, OUTPUT_FILE_NAME_FIELD_NAME);
                            assertRequestImageFilesFields(req);

                            const originalBitmap: Bitmap = BitmapDiffController.createBitmapFromRequest(req.files,
                                                                                                        ORIGINAL_IMAGE_FIELD_NAME,
                                                                                                        "o-" + diffFileName);
                            const modifiedBitmap: Bitmap = BitmapDiffController.createBitmapFromRequest(req.files,
                                                                                                        MODIFIED_IMAGE_FIELD_NAME,
                                                                                                        "m-" + diffFileName);

                            const diffBitmap: Bitmap = this.bitmapDiffService.getDiff(diffFileName, originalBitmap, modifiedBitmap);
                            const bitmapBytes: Buffer = this.bitmapWriter.getBitmapBytes(diffBitmap);

                            res.status((diffBitmap ? HttpStatus.OK : HttpStatus.INTERNAL_SERVER_ERROR));
                            res.contentType(BITMAP_MEME_TYPE);
                            res.send(bitmapBytes);
                        });
                    });

        return router;
    }

    private static createBitmapFromRequest(
        files: Express.Multer.File[] | { [fieldname: string]: Express.Multer.File[] },
        field: string,
        fileName: string): Bitmap {

        const bitmapFile: Express.Multer.File = files[field][0];
        const bitmap: Bitmap = BitmapFactory.createBitmap(fileName, bitmapFile.buffer);
        BitmapDiffController.checkBitMapSizeOk(bitmap);

        return bitmap;
    }

    private static checkBitMapSizeOk(bitmap: Bitmap): void {
        if (bitmap.width !== REQUIRED_IMAGE_WIDTH || bitmap.height !== REQUIRED_IMAGE_HEIGHT) {
            throw new InvalidSizeBitmapError(bitmap.fileName);
        }
    }

}
