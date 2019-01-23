import { NextFunction, Request, Response, Router } from "express";
import { inject, injectable } from "inversify";
import {Bitmap} from "../../../common/image/Bitmap";
import {BitmapDiffService} from "../services/bitmap-diff.service";
import Types from "../types";

@injectable()
export class BitmapDiffController {

    public constructor(@inject(Types.BitmapDiffService) private bitmapDiffService: BitmapDiffService) { }

    public get router(): Router {
        const router: Router = Router();
        router.post("/",
                    (req: Request, res: Response, next: NextFunction) => {
                        const source = new Bitmap();
                        const modified = new Bitmap();
                        this.bitmapDiffService.getDiff(source, modified);

                        res.json('lorem ipsum');
            });

        return router;
    }
}
