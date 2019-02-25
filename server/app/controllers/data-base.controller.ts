import {NextFunction, Request, Response, Router} from "express";
import * as Httpstatus from "http-status-codes";
import { inject, injectable } from "inversify";
import {IFreeGame} from "../../../common/model/game/free-game";
import {ISimpleGame} from "../../../common/model/game/simple-game";
import {DataBaseService} from "../services/data-base.service";
import {NON_EXISTING_GAME_ERROR_MESSAGE} from "../services/db/simple-games.collection.service";
import Types from "../types";
import {executePromiseSafely} from "./controller-utils";

@injectable()
export class DataBaseController {

    public constructor(@inject(Types.DataBaseService) private dataBaseService: DataBaseService) {
    }

    public get router(): Router {
        const router: Router = Router();

        // ┌──┬───────┬──┐
        // │  │ USERS │  │
        // └──┴───────┴──┘

        router.post("/users", async (req: Request, res: Response, next: NextFunction) => {
            executePromiseSafely(res, next, async () => {
                res.json(await this.dataBaseService.users.create(req.body));
            });
        });

        router.delete("/users/:userId", async (req: Request, res: Response, next: NextFunction) => {
            executePromiseSafely(res, next, async () => {
                res.json(await this.dataBaseService.users.delete(req.params["userId"]));
            });
        });

        // ┌──┬───────┬──┐
        // │  │ GAMES │  │
        // └──┴───────┴──┘

        // Simple Games

        router.post("/games/simple", async (req: Request, res: Response, next: NextFunction) => {
            executePromiseSafely(res, next, async () => {
                res.json(await this.dataBaseService.simpleGames.create(req.body));
            });
        });

        router.delete("/games/simple/:id", async (req: Request, res: Response, next: NextFunction) => {
            executePromiseSafely(res, next, async () => {
                res.json(await this.dataBaseService.simpleGames.delete(req.params["id"]));
            });
        });

        router.get("/games/simple", async (req: Request, res: Response, next: NextFunction) => {
            executePromiseSafely(res, next, async () => {
                res.json(await this.dataBaseService.simpleGames.getAll());
            });
        });

        router.get("/games/simple/:gameName", async (req: Request, res: Response, next: NextFunction) => {
            executePromiseSafely(res, next, async () => {
                this.dataBaseService.simpleGames
                    .getFromId(req.params["gameName"])
                    .then((value: ISimpleGame) => {
                        res.json(value);
                    }).catch((reason: Error) => {
                    if (reason.message === NON_EXISTING_GAME_ERROR_MESSAGE) {
                        res.status(Httpstatus.NOT_FOUND);
                    } else {
                        res.status(Httpstatus.INTERNAL_SERVER_ERROR);
                    }
                    res.json(reason);
                });
            });
        });

        // Free Games

        router.post("/games/free", async (req: Request, res: Response, next: NextFunction) => {
            executePromiseSafely(res, next, async () => {
                res.json(await this.dataBaseService.freeGames.create(req.body));
            });
        });

        router.delete("/games/free/:id", async (req: Request, res: Response, next: NextFunction) => {
            executePromiseSafely(res, next, async () => {
                res.json(await this.dataBaseService.freeGames.delete(req.params["id"]));
            });
        });

        router.get("/games/free", async (req: Request, res: Response, next: NextFunction) => {
            executePromiseSafely(res, next, async () => {
                res.json(await this.dataBaseService.freeGames.getAll());
            });
        });

        router.get("/games/free/:gameName", async (req: Request, res: Response, next: NextFunction) => {
            executePromiseSafely(res, next, async () => {
                this.dataBaseService.freeGames
                    .getFromId(req.params["gameName"])
                    .then((value: IFreeGame) => {
                        res.json(value);
                    }).catch((reason: Error) => {
                    if (reason.message === NON_EXISTING_GAME_ERROR_MESSAGE) {
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
