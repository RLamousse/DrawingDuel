import {NextFunction, Request, Response, Router} from "express";
import * as Httpstatus from "http-status-codes";
import {inject, injectable} from "inversify";
import {Object3DIsNotADifference} from "../../../common/errors/services.errors";
import {IJson3DObject} from "../../../common/free-game-json-interface/JSONInterface/IScenesJSON";
import {DiffValidator3DService} from "../services/diff-validator-3D.service";
import Types from "../types";
import {assertParamsOfRequest, executePromiseSafely} from "./controller-utils";

@injectable()
export class DiffValidator3DController {

    public constructor(@inject(Types.DiffValidator3DService) private diffValidator3DService: DiffValidator3DService) {
    }

    public get router(): Router {
        const router: Router = Router();
        router.get("/",
                   async (req: Request, res: Response, next: NextFunction) => {
                executePromiseSafely(res, next, async () => {
                    assertParamsOfRequest(req, "gameName", "center");

                    this.diffValidator3DService.getDifferentObjects(req.query.gameName, JSON.parse(req.query.center),
                    ).then((diffObj: IJson3DObject) => {
                        const response: IJson3DObject = {
                            position: diffObj.position,
                            color: diffObj.color,
                            type: diffObj.type,
                            rotation: diffObj.rotation,
                            scale: diffObj.scale,
                            gameType: diffObj.gameType,
                        };

                        return res.json(response);
                    }).catch((error: Error) => {
                        if (error.message === Object3DIsNotADifference.OBJ_3D_NOT_A_DIFFERENCE_ERROR_MESSAGE) {
                            res.status(Httpstatus.NOT_FOUND);
                        }

                        return res.json(error);
                    });
                });
            });

        return router;
    }

}
