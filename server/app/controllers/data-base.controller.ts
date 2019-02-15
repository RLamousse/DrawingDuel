import { NextFunction, Request, Response, Router } from "express";
import * as Httpstatus from "http-status-codes";
import { inject, injectable } from "inversify";
import {IGame} from "../../../common/model/IGame";
import {DataBaseService} from "../services/data-base.service";
import {NON_EXISTING_GAME_ERROR_MESSAGE} from "../services/db/games.collection.service";
import Types from "../types";
import {executeSafely} from "./controller-utils";

@injectable()
export class DataBaseController {

    public constructor(@inject(Types.DataBaseService) private dataBaseService: DataBaseService) { }

    public get router(): Router {
        const router: Router = Router();

        // ┌──┬───────┬──┐
        // │  │ USERS │  │
        // └──┴───────┴──┘

        router.post("/users", async (req: Request, res: Response, next: NextFunction) => {
            executeSafely(next, async () => {
                res.json(await this.dataBaseService.users.create(req.body));
            });
        });

        router.delete("/users/:userId", async (req: Request, res: Response, next: NextFunction) => {
            executeSafely(next, async () => {
                res.json(await this.dataBaseService.users.delete(req.params["userId"]));
            });
        });

        // ┌──┬───────┬──┐
        // │  │ GAMES │  │
        // └──┴───────┴──┘

        router.post("/games", async (req: Request, res: Response, next: NextFunction) => {
            executeSafely(next, async () => {
                res.json(await this.dataBaseService.games.create(req.body));
            });
        });

        router.delete("/games/:id", async (req: Request, res: Response, next: NextFunction) => {
            executeSafely(next, async () => {
                res.json(await this.dataBaseService.games.delete(req.params["id"]));
            });
        });

        router.get("/games", async (req: Request, res: Response, next: NextFunction) => {
            executeSafely(next, async () => {
                res.json(await this.dataBaseService.games.getAll());
            });
        });

        router.get("/games/:gameName", async (req: Request, res: Response, next: NextFunction) => {
            executeSafely(next, async () => {
                this.dataBaseService.games
                    .getFromId(req.params["gameName"])
                    .then((value: IGame) => {
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
