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

    private readonly _storage: multer.StorageEngine;
    private readonly _multer: multer.Instance;
    private readonly REQUIRED_IMAGE_HEIGHT: number = 480;
    private readonly REQUIRED_IMAGE_WIDTH: number = 640;

    public constructor(@inject(Types.BitmapDiffService) private bitmapDiffService: BitmapDiffService) {
        this._storage = multer.memoryStorage();
        this._multer = multer({
            storage: this._storage,
            fileFilter: (req: Express.Request,
                         file: Express.Multer.File,
                         cb: (error: Error | null, acceptFile: boolean) => void) => {
                    if (!(file.mimetype === "image/bmp")) {
                        return cb(new Error("Only bmp's are allowed!"), false);
                    }
                    cb(null, file.mimetype === "image/bmp");
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
                const diffFileName: string = req.body["name"];
                try {
                    if (req.files) {
                        BitmapDiffController.checkFileExists(req.files["originalImage"], "originalImage");
                        BitmapDiffController.checkFileExists(req.files["modifiedImage"], "modifiedImage");
                    }
                } catch (error) {
                    this.answerWithError(error, res);

                    return;
                }
                const originalImageFile: Express.Multer.File = req.files["originalImage"][0];
                const modifiedImageFile: Express.Multer.File = req.files["modifiedImage"][1];
                const source: Bitmap = BitmapFactory.createBitmap(originalImageFile.originalname, originalImageFile.buffer);
                const modified: Bitmap = BitmapFactory.createBitmap(modifiedImageFile.originalname, modifiedImageFile.buffer);

                try {
                    this.checkBitMapSizeOk(source);
                    this.checkBitMapSizeOk(modified);
                } catch (error) {
                    this.answerWithError(error, res);

                    return;
                }
                const diffBitmap: Bitmap = this.bitmapDiffService.getDiff(diffFileName, source, modified);
                BitmapWriter.write(diffBitmap);
                res.status((diffBitmap ? HttpStatus.OK : HttpStatus.INTERNAL_SERVER_ERROR));
                res.json(diffBitmap.toString());
            });

        return router;
    }

    private static checkFileExists(file: Express.Multer.File, fileName: string): void {
        if (!file) {
            throw new Error(`Error: No ${fileName} bitmap file was found`);
        }
    }

    private checkBitMapSizeOk(bitmap: Bitmap): void {
        if (bitmap.height !== this.REQUIRED_IMAGE_HEIGHT || bitmap.width !== this.REQUIRED_IMAGE_WIDTH) {
            throw new Error(`Error: ${bitmap.fileName} bitmap file is not the right size`);
        }
    }

    private answerWithError(error: Error, res: Response): void {
        // console.error(error);
        res.status(HttpStatus.INTERNAL_SERVER_ERROR);
        res.json({
            status: "error",
            error: error.message,
        });
    }

}
