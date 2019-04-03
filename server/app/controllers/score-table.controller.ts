import {NextFunction, Request, Response, Router} from "express";
import {inject, injectable} from "inversify";
import {GAME_NAME_FIELD} from "../../../common/communication/requests/game-creator.controller.request";
import {ScoreTableService} from "../services/score-table.service";
import Types from "../types";
import {
    assertBodyFieldsOfQuery,
    assertUpdateScoreTable,
    executePromiseSafely
} from "./controller-utils";

@injectable()
export class ScoreTableController {

    public constructor(@inject(Types.ScoreTableService) private scoreTableService: ScoreTableService) {}

    public get router(): Router {
        const router: Router = Router();

        router.put("/modify-scores", async (req: Request, res: Response, next: NextFunction) => {
            executePromiseSafely(res, next, async () => {
                assertUpdateScoreTable(req);
                res.json(await this.scoreTableService.updateTableScore(req.body.gameName, req.body.newTime, req.body.onlineType));
            });
        });

        router.put("/reset-scores/:gameName", async (req: Request, res: Response, next: NextFunction) => {
            executePromiseSafely(res, next, async () => {
                assertBodyFieldsOfQuery(req, GAME_NAME_FIELD);
                res.json(await this.scoreTableService.resetScores(req.params.gameName));
            });
        });

        return router;
    }
}
