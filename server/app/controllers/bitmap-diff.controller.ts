import { Request, Response, Router } from "express";
import { inject, injectable } from "inversify";
import multer = require("multer");
import { Bitmap } from "../../../common/image/Bitmap";
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
                    maxCount: 1 
                },
                {
                    name: "modifiedImage",
                    maxCount: 1
                },
            ]),
            (req: Request, res: Response) => {
                const originalImageFile: Express.Multer.File = req.files["originalImage"][0];
                const source: Bitmap = new Bitmap(originalImageFile.originalname, originalImageFile.buffer);

                const modifiedImageFile: Express.Multer.File = req.files["modifiedImage"][1];
                const modified: Bitmap = new Bitmap(modifiedImageFile.originalname, modifiedImageFile.buffer);

                let success: Boolean = this.bitmapDiffService.getDiff(source, modified);
                // TODO: Set a place to put server answer constants (e.g success=200)
                res.status((success ? 200 : 500));
                res.json(this.bitmapDiffService.getDiff(source, modified).toString());
            });

        return router;
    }
}
