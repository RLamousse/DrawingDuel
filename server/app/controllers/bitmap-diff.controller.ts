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
                const modifiedImageFile: Express.Multer.File = req.files["modifiedImage"][1];
                try {
                    this.checkFileExist(originalImageFile, "originalImage");
                    this.checkFileExist(modifiedImageFile, "modifiedImage");
                } catch (error) {
                    this.anserWithError(error, res);

                    return;
                }
                const source: Bitmap = BitmapFactory.createBitmap(originalImageFile.originalname, originalImageFile.buffer);
                const modified: Bitmap = BitmapFactory.createBitmap(modifiedImageFile.originalname, modifiedImageFile.buffer);

                try {
                    this.checkBitMapSizeOk(source);
                    this.checkBitMapSizeOk(modified);
                } catch (error) {
                    this.anserWithError(error, res);

                    return;
                }

                const diffBitmap: Bitmap = this.bitmapDiffService.getDiff(diffFileName, source, modified);
                BitmapWriter.write(diffBitmap);
                res.status((diffBitmap ? HttpStatus.OK : HttpStatus.INTERNAL_SERVER_ERROR));
                res.json(diffBitmap.toString());
            });

        // To remove
        router.get("/", (req: Request, res: Response) => {
            try {
                this.checkFileExist(((undefined as unknown) as Express.Multer.File) , "dummy");
            } catch (error) {
                // tslint:disable-next-line
                console.log(error.stack);
            }
            res.send("Salut Max");
            // tslint:disable-next-line:no-console
            console.log("Apres le throw");
        });

        return router;
    }

    private checkFileExist(file: Express.Multer.File, fileName: string): void {
        if (!file) {
            throw new Error(`No ${fileName} bitmap file was found`);
        }
    }

    private checkBitMapSizeOk(bitmap: Bitmap): void {
        if (bitmap.height !== this.REQUIRED_IMAGE_HEIGHT || bitmap.width !== this.REQUIRED_IMAGE_WIDTH) {
            throw new Error(`${bitmap.fileName} bitmap file is not the right size`);
        }
    }

    private anserWithError(error: Error, res: Response): void {
        // console.error((error as Error).stack);
        res.status(HttpStatus.INTERNAL_SERVER_ERROR);
        res.json({
            status: "error",
            error,
        });
    }

}
