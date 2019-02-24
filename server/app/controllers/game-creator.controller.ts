import {NextFunction, Request, Response, Router} from "express";
import e = require("express");
import {inject, injectable} from "inversify";
import * as multer from "multer";
import {GAME_NAME_FIELD} from "../../../common/communication/requests/game-creator.controller.request";
import {GameCreatorService} from "../services/game-creator.service";
import Types from "../types";
import {
    assertBodyFieldsOfRequest,
    assertRequestImageFilesFields,
    executePromiseSafely,
    BITMAP_MULTER_FILTER,
    MODIFIED_IMAGE_FIELD_NAME,
    MULTER_BMP_FIELDS,
    ORIGINAL_IMAGE_FIELD_NAME
} from "./controller-utils";

@injectable()
export class GameCreatorController {
    private readonly _multer: multer.Instance;
    private readonly _cpUpload: e.RequestHandler;

    public constructor(@inject(Types.GameCreatorService) private gameCreatorService: GameCreatorService) {
        this._multer = multer({
                                  fileFilter: BITMAP_MULTER_FILTER,
                              });
        this._cpUpload = this._multer.fields(MULTER_BMP_FIELDS);
    }

    public get router(): Router {
        const router: Router = Router();

        router.post("/create-simple-game", this._cpUpload, async (req: Request, res: Response, next: NextFunction) => {
            executePromiseSafely(res, next, async () => {
                assertBodyFieldsOfRequest(req, GAME_NAME_FIELD);
                assertRequestImageFilesFields(req);

                res.json(await this.gameCreatorService.createSimpleGame(
                    req.body[GAME_NAME_FIELD],
                    req.files[ORIGINAL_IMAGE_FIELD_NAME][0].buffer,
                    req.files[MODIFIED_IMAGE_FIELD_NAME][0].buffer));
            });
        });

        router.post("/create-free-game", async (req: Request, res: Response, next: NextFunction) => {
            try {
                assertRequestSceneFields(req);

                res.json(await this.gameCreatorService.createFreeGame(
                    req.body[GAME_NAME_FIELD],
                    req.body.objectQuantity,
                    req.body.theme,
                    req.body.modificationTypes));

            } catch (error) {
                next(error);
            }
        });

        return router;
    }
}
