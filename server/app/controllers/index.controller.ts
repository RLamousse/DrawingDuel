import { injectable, inject } from "inversify";
import { Router, Request, Response, NextFunction } from "express";

import Types from "../types";
import { IndexService } from "../services/index.service";

@injectable()
export class IndexController {

    public constructor(@inject(Types.IndexService) private indexService: IndexService) { }

    public get router(): Router {
        const router: Router = Router();
        
        router.get("/",
            async (req: Request, res: Response, next: NextFunction) => {
                // Send the request to the service and send the response
                const time = await this.indexService.helloWorld();
                res.json(time);
            });

        router.get("/about",
            (req: Request, res: Response, next: NextFunction) => {
                // Send the request to the service and send the response
                res.json(this.indexService.about());
            });

        router.get("/createGame", // change the url to something more legitimate
            async (req: Request, res: Response, next: NextFunction) => {
                const answer: object = await this.indexService.createGame(req);
                res.json(answer);
            });

        return router;
    }
}
