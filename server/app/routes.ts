import { injectable, inject } from "inversify";
import { Router, Request, Response, NextFunction } from "express";

import Types from "./types";
import { Route } from "./routes/index";

@injectable()
export class Routes {

    public constructor(
        @inject(Types.IndexService) private index: Route.Index,
        @inject(Types.IndexService) private uList: Route.UserIndex
    ) { }

    public get routes(): Router {
        const router: Router = Router();

        router.get("/",
                   (req: Request, res: Response, next: NextFunction) => this.index.helloWorld(req, res, next));

        return router;
    }
    public get userList(): Router {
        const router: Router = Router();

        router.get("/",
            (req: Request, res: Response, next: NextFunction) => this.uList.getActiveUser(req, res, next));

        return router;
    }
}
