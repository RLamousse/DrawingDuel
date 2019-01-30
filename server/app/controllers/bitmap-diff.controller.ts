import { Request, Response, Router } from "express";
import * as HttpStatus from "http-status-codes";
import { inject, injectable } from "inversify";
import multer = require("multer");
import { Bitmap } from "../../../common/image/Bitmap/bitmap";
import { BitmapFactory } from "../images/bitmap/bitmap-factory";
import { BitmapWriter } from "../images/bitmap/bitmap-writer";
import { BitmapDiffService } from "../services/bitmap-diff.service";
import Types from "../types";

@injectable()
export class BitmapDiffController {

    public constructor(
        @inject(Types.BitmapDiffService) private bitmapDiffService: BitmapDiffService,
        @inject(Types.BitmapWriter) private bitmapWriter: BitmapWriter) {
        this._storage = multer.memoryStorage();
        this._multer = multer({
            storage: this._storage,
            fileFilter: (req: Express.Request,
                         file: Express.Multer.File,
                         cb: (error: Error | null, acceptFile: boolean) => void) => {
                    if (file.mimetype !== "image/bmp") {
                        return cb(new Error("Error: Only bmp's are allowed!"), false);
                    }

                    cb(null, true);
            },
        });
    }

    public get router(): Router {
        const router: Router = Router();
        router.post("/",
                    this._multer.fields([
                {
                    name: "originalImage",
                    maxCount: 1,
                },
                {
                    name: "modifiedImage",
                    maxCount: 1,
                },
            ]),
                    (req: Request, res: Response) => {
                    try {
                        const diffFileName: string = req.body["name"];
                        if (diffFileName === undefined) {
                            throw new Error("Error: No name was specified");
                        }
                        if (req.files[BitmapDiffController.ORIGINAL_IMAGE_FIELD_NAME] === undefined &&
                            req.files[BitmapDiffController.MODIFIED_IMAGE_FIELD_NAME] === undefined) {
                            throw new Error("Error: No files were included in request");
                        }

                        const originalBitmap: Bitmap = BitmapDiffController.createBitmapFromRequest(
                            req.files, BitmapDiffController.ORIGINAL_IMAGE_FIELD_NAME);
                        const modifiedBitmap: Bitmap = BitmapDiffController.createBitmapFromRequest(
                            req.files, BitmapDiffController.MODIFIED_IMAGE_FIELD_NAME);

                        const diffBitmap: Bitmap = this.bitmapDiffService.getDiff(diffFileName, originalBitmap, modifiedBitmap);
                        const bitmapDiffPath: string = this.bitmapWriter.write(diffBitmap);
                        res.status((diffBitmap ? HttpStatus.OK : HttpStatus.INTERNAL_SERVER_ERROR));
                        res.json({
                             status: "ok",
                             fileName: diffFileName,
                             filePath: bitmapDiffPath,
                        });
                    } catch (error) {
                        BitmapDiffController.answerWithError(error, res);

                        return;
                    }
            });

        return router;
    }

    private static readonly REQUIRED_IMAGE_HEIGHT: number = 480;
    private static readonly REQUIRED_IMAGE_WIDTH: number = 640;
    private static readonly ORIGINAL_IMAGE_FIELD_NAME: string = "originalImage";
    private static readonly MODIFIED_IMAGE_FIELD_NAME: string = "modifiedImage";

    private readonly _storage: multer.StorageEngine;
    private readonly _multer: multer.Instance;

    private static createBitmapFromRequest(
        files: Express.Multer.File[]|{[fieldname: string]: Express.Multer.File[]},
        field: string): Bitmap {

        BitmapDiffController.checkFileExists(files[field], field);
        const bitmapFile: Express.Multer.File = files[field][0];
        const bitmap: Bitmap = BitmapFactory.createBitmap(bitmapFile.originalname, bitmapFile.buffer);
        BitmapDiffController.checkBitMapSizeOk(bitmap);

        return bitmap;
    }

    private static checkFileExists(file: Express.Multer.File, fileName: string): void {
        if (!file) {
            throw new Error(`Error: No ${fileName} bitmap file was found`);
        }
    }

    private static answerWithError(error: Error, res: Response): void {
        // console.error(error);
        res.status(HttpStatus.INTERNAL_SERVER_ERROR);
        res.json({
            status: "error",
            error: error.message,
        });
    }

    private static checkBitMapSizeOk(bitmap: Bitmap): void {
        if (bitmap.height !== BitmapDiffController.REQUIRED_IMAGE_HEIGHT || bitmap.width !== BitmapDiffController.REQUIRED_IMAGE_WIDTH) {
            throw new Error(`Error: ${bitmap.fileName} bitmap file is not the right size`);
        }
    }

}
