import { NextFunction, Request, Response, Router } from "express";
import * as Httpstatus from "http-status-codes";
import { inject, injectable } from "inversify";
import {Message} from "../../../common/communication/messages/message";
import {IGame} from "../../../common/model/IGame";
import {DataBaseService} from "../services/data-base.service";
import {NON_EXISTING_GAME_ERROR_MESSAGE} from "../services/db/games.collection.service";
import {ALREADY_EXISTING_IMAGE_MESSAGE_ERROR} from "../services/db/images.collection.service";
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
                res.json(await this.dataBaseService.users.create(req.query));
            });
        });

        router.delete("/users/:userId", async (req: Request, res: Response, next: NextFunction) => {
            executeSafely(next, async () => {
                res.json(await this.dataBaseService.users.delete(req.query["userId"]));
            });
        });

        // ┌──┬───────┬──┐
        // │  │ GAMES │  │
        // └──┴───────┴──┘

        router.post("/games", async (req: Request, res: Response, next: NextFunction) => {
            executeSafely(next, async () => {
                res.json(await this.dataBaseService.games.create(req.query));
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

        // ┌──┬────────┬──┐
        // │  │ IMAGES │  │
        // └──┴────────┴──┘

        router.post("/images", async (req: Request, res: Response, next: NextFunction) => {
            executeSafely(next, async () => {
                await this.dataBaseService.images.create(req.body)
                    .then((value: Message) => {
                        res.json(value);
                    }).catch((reason: Error) => {
                        if (reason.message === ALREADY_EXISTING_IMAGE_MESSAGE_ERROR) {
                            return res.status(Httpstatus.OK);
                        }

                        return res.status(Httpstatus.INTERNAL_SERVER_ERROR);
                    });
            });
        });

        router.delete("/images/:id", async (req: Request, res: Response, next: NextFunction) => {
            executeSafely(next, async () => {
                res.json(await this.dataBaseService.images.delete(req.query["id"]));
            });
        });

        router.get("/images", async (req: Request, res: Response, next: NextFunction) => {
            executeSafely(next, async () => {
                res.json(await this.dataBaseService.images.getAll());
            });
        });

        router.get("/images/:gameName", async (req: Request, res: Response, next: NextFunction) => {
            executeSafely(next, async () => {
                res.json(await this.dataBaseService.images.getFromId(req.query["imageName"]));
            });
        });

        return router;
    }
}
