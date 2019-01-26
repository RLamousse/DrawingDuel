import { Request, Response, Router } from "express";
import { inject, injectable } from "inversify";
import multer = require("multer");
import { Bitmap } from "../../../common/image/Bitmap/bitmap";
import {BitmapFactory} from "../images/bitmap/bitmap-factory";
import {BitmapWriter} from "../images/bitmap/bitmap-writer";
import { BitmapDiffService } from "../services/bitmap-diff.service";
import Types from "../types";

@injectable()
export class BitmapDiffController {

    private readonly _storage: multer.StorageEngine;
    private readonly _multer: multer.Instance;

    public constructor(@inject(Types.BitmapDiffService) private bitmapDiffService: BitmapDiffService) {
        this._storage = multer.memoryStorage();
        this._multer = multer({
            storage: this._storage,
            fileFilter: (req: Express.Request,
                         file: Express.Multer.File,
                         cb: (error: Error | null, acceptFile: boolean) => void) => {
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
                const originalImageFile: Express.Multer.File = req.files["originalImage"][0];
                const source: Bitmap = BitmapFactory.createBitmap(originalImageFile.originalname, originalImageFile.buffer);

                const modifiedImageFile: Express.Multer.File = req.files["modifiedImage"][1];
                const modified: Bitmap = BitmapFactory.createBitmap(modifiedImageFile.originalname, modifiedImageFile.buffer);

                const diffBitmap: Bitmap = this.bitmapDiffService.getDiff(diffFileName, source, modified);
                BitmapWriter.write(diffBitmap);

                // TODO: Set a place to put server answer constants (e.g success=200)
                res.status((diffBitmap ? 200 : 500));
                res.json(diffBitmap.toString());
            });

        return router;
    }
}
