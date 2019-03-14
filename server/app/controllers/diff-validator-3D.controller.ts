import {NextFunction, Request, Response, Router} from "express";
import * as Httpstatus from "http-status-codes";
import {inject, injectable} from "inversify";
import {IScenesDB} from "../../../common/free-game-json-interface/JSONInterface/IScenesJSON";
import Types from "../types";
import {assertParamsOfRequest, executePromiseSafely} from "./controller-utils";

@injectable()
export class DiffValidatorController {

    public constructor(@inject(Types.DiffValidatorService) private diffValidatorService: DiffValidatorService) {
    }

    public get router(): Router {
        const router: Router = Router();
        router.get("/",
            async (req: Request, res: Response, next: NextFunction) => {
                executePromiseSafely(res, next, async () => {
                    assertParamsOfRequest(req, "gameName", "coordX", "coordY");

                    this.diffValidatorService.getDifferenceCluster(req.query.gameName, {
                       
                    }).then((differenceCluster: DifferenceCluster) => {
                        const response: IDiffValidatorControllerResponse = {

                        };

                        return res.json(response);
                    }).catch((error: Error) => {
                        if (error.message === NoDifferenceAtPointError.NO_DIFFERENCE_AT_POINT_ERROR_MESSAGE) {
                            res.status(Httpstatus.NOT_FOUND);
                        }

                        return res.json(error);
                    });
                });
            });

        return router;
    }

}
