import { NextFunction, Request, Response, Router } from "express";
import e = require("express");
import { inject, injectable } from "inversify";
import {DataBaseService, GAME_FIELD, GAME_NAME_FIELD, USER_NAME_FIELD} from "../services/data-base.service";
import Types from "../types";
import {executeSafely} from "./controller-utils";

export const USERNAME_FORMAT_ERROR_MESSAGE: string = "ERROR: the username has the wrong format!";
export const GAME_NAME_FORMAT_ERROR_MESSAGE: string = "ERROR: the game name has the wrong format!";
export const GAME_FORMAT_ERROR_MESSAGE: string = "ERROR: the game has the wrong format!";

@injectable()
export class DataBaseController {

    public constructor(@inject(Types.DataBaseService) private dataBaseService: DataBaseService) { }

    public get router(): Router {
        const router: Router = Router();

        router.post("/users", async (req: Request, res: Response, next: NextFunction) => {
            executeSafely(next, async () => {
                this.testUserName(req);
                res.json(await this.dataBaseService.addUser(req.query[USER_NAME_FIELD]));
            });
        });

        router.delete("/users/:userId", async (req: Request, res: Response, next: NextFunction) => {
            executeSafely(next, async () => {
                this.testUserName(req);
                res.json(await this.dataBaseService.deleteUser(req.query["userId"]));
            });
        });

        router.post("/games", async (req: Request, res: Response, next: NextFunction) => {
            executeSafely(next, async () => {
                this.testGame(req);
                res.json(await this.dataBaseService.addGame(req.body[GAME_FIELD]));
            });
        });

        router.delete("/games/:id", async (req: Request, res: Response, next: NextFunction) => {
            executeSafely(next, async () => {
                this.testGameName(req);
                res.json(await this.dataBaseService.deleteGame(req.query["id"]));
            });
        });

        router.get("/games", async (req: Request, res: Response, next: NextFunction) => {
            executeSafely(next, async () => {
                res.json(await this.dataBaseService.getGames());
            });
        });

        router.get("/games/:gameName", async (req: Request, res: Response, next: NextFunction) => {
            executeSafely(next, async () => {
                this.testGameName(req);
                res.json(await this.dataBaseService.getGame(req.query["gameName"]));
            });
        });

        return router;
    }

    private testUserName(req: e.Request): void {
        if (!this.isStringFieldCorrect(USER_NAME_FIELD, req.query)) {
            throw new Error(USERNAME_FORMAT_ERROR_MESSAGE);
        }
    }

    private testGame(req: e.Request): void {
        this.dataBaseService.testGameStructure(req.body[GAME_FIELD]);
    }

    private testGameName(req: Request): void {
        if (!this.isStringFieldCorrect(GAME_NAME_FIELD, req.query)) {
            throw new Error(GAME_NAME_FORMAT_ERROR_MESSAGE);
        }
    }

    private isStringFieldCorrect(filedName: string, item: object): boolean {
        return (!(typeof item[filedName] === "undefined" ||
                  typeof item[filedName] !== "string" ||
                  item[filedName] === ""));
    }
}
