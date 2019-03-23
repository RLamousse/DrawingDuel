import {NextFunction, Request, Response, Router} from "express";
import {inject, injectable} from "inversify";
import {ScoreTableService} from "../services/score-table.service";
import Types from "../types";
import {assertUpdateScoreTable, executePromiseSafely} from "./controller-utils";

@injectable()
export class ScoreTableController {

    public constructor(@inject(Types.ScoreTableService) private scoreTableService: ScoreTableService) {}

    public get router(): Router {
        const router: Router = Router();

        router.put("/modify-scores", async (req: Request, res: Response, next: NextFunction) => {
            executePromiseSafely(res, next, async () => {
                assertUpdateScoreTable(req);
                res.json(await this.scoreTableService.updateTableScore(req.body.gameName, req.body.newTime, req.body.isSolo));
            });
        });

        return router;
    }
}
