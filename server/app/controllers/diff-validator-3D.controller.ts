import {NextFunction, Request, Response, Router} from "express";
import * as Httpstatus from "http-status-codes";
import {inject, injectable} from "inversify";
import {Object3DIsNotADifference} from "../../../common/errors/services.errors";
import {IJson3DObject} from "../../../common/free-game-json-interface/JSONInterface/IScenesJSON";
import {IPoint3D} from "../../../common/model/point";
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
                    assertParamsOfRequest(req, "gameName", "centerX", "centerY", "centerZ");
                    const queryPoint: IPoint3D = {
                        x: parseInt(req.query.centerX, 10),
                        y: parseInt(req.query.centerY, 10),
                        z: parseInt(req.query.centerZ, 10),
                    };

                    this.diffValidator3DService.getDifferentObjects(req.query.gameName, queryPoint)
                        .then((diffObj: IJson3DObject) => res.json(diffObj))
                        .catch((error: Error) => {
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
