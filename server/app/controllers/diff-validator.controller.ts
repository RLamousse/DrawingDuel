import {NextFunction, Request, Response, Router} from "express";
import * as Httpstatus from "http-status-codes";
import {inject, injectable} from "inversify";
import {IDiffValidatorControllerResponse} from "../../../common/communication/responses/diff-validator-controller.response";
import {DifferenceCluster, DIFFERENCE_CLUSTER_ID_INDEX, DIFFERENCE_CLUSTER_POINTS_INDEX} from "../../../common/model/game/simple-game";
import {DiffValidatorService, NO_DIFFERENCE_AT_POINT_ERROR_MESSAGE} from "../services/diff-validator.service";
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
                               x: parseInt(req.query.coordX, 10),
                               y: parseInt(req.query.coordY, 10),
                           }).then((differenceCluster: DifferenceCluster) => {
                               const response: IDiffValidatorControllerResponse = {
                                   validDifference: true,
                                   differenceClusterId: differenceCluster[DIFFERENCE_CLUSTER_ID_INDEX],
                                   differenceClusterCoords: differenceCluster[DIFFERENCE_CLUSTER_POINTS_INDEX],
                               };

                               return res.json(response);
                           }).catch((error: Error) => {
                               if (error.message === NO_DIFFERENCE_AT_POINT_ERROR_MESSAGE) {
                                   res.status(Httpstatus.NOT_FOUND);
                               }

                               return res.json(error);
                           });
                       });
                   });

        return router;
    }

}
