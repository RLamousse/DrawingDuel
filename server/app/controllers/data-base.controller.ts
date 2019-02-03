import { NextFunction, Request, Response, Router } from "express";
import e = require("express");
import { inject, injectable } from "inversify";
import {DataBaseService, GAME_FIELD, GAME_NAME_FIELD, USER_NAME_FIELD} from "../services/data-base.service";
import Types from "../types";

export const USERNAME_FORMAT_ERROR_MESSAGE: string = "ERROR: the username has the wrong format!";
export const GAME_NAME_FORMAT_ERROR_MESSAGE: string = "ERROR: the game name has the wrong format!";
export const GAME_FORMAT_ERROR_MESSAGE: string = "ERROR: the game has the wrong format!";

@injectable()
export class DataBaseController {

    public constructor(@inject(Types.DataBaseService) private dataBaseService: DataBaseService) { }

    public get router(): Router {
        const router: Router = Router();

        router.post("/add-user", async (req: Request, res: Response, next: NextFunction) => {
            try {
                this.testUserName(req);
                res.json(await this.dataBaseService.addUser(req.body[USER_NAME_FIELD]));
            } catch (error) {
                next(error);
            }

        });

        router.delete("/delete-user", async (req: Request, res: Response, next: NextFunction) => {
            try {
                this.testUserName(req);
                res.json(await this.dataBaseService.deleteUser(req.body[USER_NAME_FIELD]));
            } catch (error) {
                next(error);
            }

        });

        router.delete("/delete-game", async (req: Request, res: Response, next: NextFunction) => {
            try {
                this.testGameName(req);
                res.json(await this.dataBaseService.deleteGame(req.body[GAME_NAME_FIELD]));
            } catch (error) {
                next(error);
            }

        });

        router.post("/add-game", async (req: Request, res: Response, next: NextFunction) => {
            try {
                this.testGame(req);
                res.json(await this.dataBaseService.addGame(req.body[GAME_FIELD]));
            } catch (error) {
                next(error);
            }

        });

        router.get("/get-games", async (req: Request, res: Response, next: NextFunction) => {
            try {
                res.json(await this.dataBaseService.getGames());
            } catch (error) {
                next(error);
            }

        });

        router.get("/get-game", async (req: Request, res: Response, next: NextFunction) => {
            try {
                this.testGameName(req);
                res.json(await this.dataBaseService.getGame(req.body.gameName));
            } catch (error) {
                next(error);
            }

        });

        return router;
    }

    private testUserName(req: e.Request): void {
        if (!this.isStringFieldCorrect(USER_NAME_FIELD, req)) {
            throw new Error(USERNAME_FORMAT_ERROR_MESSAGE);
        }
    }

    private testGame(req: e.Request): void {
        this.dataBaseService.testGameStructure(req.body[GAME_FIELD]);
    }

    private testGameName(req: Request): void {
    }

    private isStringFieldCorrect(filedName: string, item: object): boolean {
        return (!(typeof item[filedName] === "undefined" ||
                  typeof item[filedName] !== "string" ||
                  item[filedName] === ""));
    }
}
