import {Router} from "express";
import {inject, injectable} from "inversify";
import {DataBaseService} from "../services/data-base.service";
import Types from "../types";

@injectable()
export class GameManagerController {

    public constructor(@inject(Types.DataBaseService) private dataBaseService: DataBaseService) {
    }

    public get router(): Router {
        const router: Router = Router();
        return router;
    }
}
