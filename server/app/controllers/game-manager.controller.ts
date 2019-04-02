import {NextFunction, Request, Response, Router} from "express";
import * as Httpstatus from "http-status-codes";
import {inject, injectable} from "inversify";
import {NonExistentGameError} from "../../../common/errors/database.errors";
import {IFreeGame} from "../../../common/model/game/free-game";
import {ISimpleGame} from "../../../common/model/game/simple-game";
import {DataBaseService} from "../services/data-base.service";
import Types from "../types";
import {executePromiseSafely} from "./controller-utils";

@injectable()
export class GameManagerController {

    public constructor(@inject(Types.DataBaseService) private dataBaseService: DataBaseService) {
    }

    public get router(): Router {
        const router: Router = Router();

        // ┌──┬────────┬──┐
        // │  │ SIMPLE │  │
        // └──┴────────┴──┘

        router.delete("/simple/:id", async (req: Request, res: Response, next: NextFunction) => {
            executePromiseSafely(res, next, async () => {
                res.json(await this.dataBaseService.simpleGames.delete(req.params["id"]));
            });
        });

        router.get("/simple/", async (req: Request, res: Response, next: NextFunction) => {
            executePromiseSafely(res, next, async () => {
                res.json(await this.dataBaseService.simpleGames.getAll());
            });
        });

        router.get("/simple/:id", async (req: Request, res: Response, next: NextFunction) => {
            executePromiseSafely(res, next, async () => {
                this.dataBaseService.simpleGames
                    .getFromId(req.params["id"])
                    .then((value: ISimpleGame) => {
                        res.json(value);
                    }).catch((reason: Error) => {
                    if (reason.message === NonExistentGameError.NON_EXISTENT_GAME_ERROR_MESSAGE) {
                        res.status(Httpstatus.NOT_FOUND);
                    } else {
                        res.status(Httpstatus.INTERNAL_SERVER_ERROR);
                    }
                    res.json(reason);
                });
            });
        });

        // ┌──┬──────┬──┐
        // │  │ FREE │  │
        // └──┴──────┴──┘
        router.delete("/free/:id", async (req: Request, res: Response, next: NextFunction) => {
            executePromiseSafely(res, next, async () => {
                res.json(await this.dataBaseService.freeGames.delete(req.params["id"]));
            });
        });

        router.get("/free/", async (req: Request, res: Response, next: NextFunction) => {
            executePromiseSafely(res, next, async () => {
                res.json(await this.dataBaseService.freeGames.getAll());
            });
        });

        router.get("/free/:id", async (req: Request, res: Response, next: NextFunction) => {
            executePromiseSafely(res, next, async () => {
                this.dataBaseService.freeGames
                    .getFromId(req.params["id"])
                    .then((value: IFreeGame) => {
                        res.json(value);
                    }).catch((reason: Error) => {
                    if (reason.message === NonExistentGameError.NON_EXISTENT_GAME_ERROR_MESSAGE) {
                        res.status(Httpstatus.NOT_FOUND);
                    } else {
                        res.status(Httpstatus.INTERNAL_SERVER_ERROR);
                    }
                    res.json(reason);
                });
            });
        });

        return router;
    }
}
