import { NextFunction, Request, Response, Router } from "express";
import { inject, injectable } from "inversify";
import {DataBaseService} from "../services/data-base.service";
import Types from "../types";

@injectable()
export class DataBaseController {

    public constructor(@inject(Types.DataBaseService) private dataBaseService: DataBaseService) { }

    public get router(): Router {
        const router: Router = Router();

        router.get("/get",async (req: Request, res: Response, next: NextFunction) => {
            if (!this.validityTest(req)) {
                next(new Error("Something went wrong"));
            } else {
                // call service
                res.json(this.dataBaseService.get(req.body));
            }

        });

        router.post("/post",async (req: Request, res: Response, next: NextFunction) => {
                if (!this.validityTest(req)) {
                    next(new Error("Something went wrong"));
                } else {
                    // call service
                    res.json(this.dataBaseService.post(req.body));
                }

            });

        return router;
    }



    private validityTest(req: Request): boolean {
        return true;
    }
}
