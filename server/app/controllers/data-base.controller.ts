import { NextFunction, Request, Response, Router } from "express";
import { inject, injectable } from "inversify";
import {DataBaseService} from "../services/data-base.service";
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
                res.json(await this.dataBaseService.games.delete(req.query["id"]));
            });
        });

        router.get("/games", async (req: Request, res: Response, next: NextFunction) => {
            executeSafely(next, async () => {
                res.json(await this.dataBaseService.games.getAll());
            });
        });

        router.get("/games/:gameName", async (req: Request, res: Response, next: NextFunction) => {
            executeSafely(next, async () => {
                res.json(await this.dataBaseService.games.getFromId(req.query["gameName"]));
            });
        });

        // ┌──┬────────┬──┐
        // │  │ IMAGES │  │
        // └──┴────────┴──┘

        router.post("/images", async (req: Request, res: Response, next: NextFunction) => {
            executeSafely(next, async () => {
                res.json(await this.dataBaseService.images.create(req.body));
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
