import {NextFunction, Request, Response, Router} from "express";
import * as Httpstatus from "http-status-codes";
import {inject, injectable} from "inversify";
import {NoDifferenceAtPointError} from "../../../common/errors/services.errors";
import {DiffValidatorService} from "../services/diff-validator.service";
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

                           // TODO: console.time("valid");

                           assertParamsOfRequest(req, "gameName", "coordX", "coordY");

                           this.diffValidatorService.validatePoint(req.query.gameName, {
                               x: parseInt(req.query.coordX, 10),
                               y: parseInt(req.query.coordY, 10),
                           }).then((hasDifference: boolean) => {
                               if (!hasDifference) {
                                   res.status(Httpstatus.NOT_FOUND);

                                   return res.json(new NoDifferenceAtPointError());
                               }

                               // TODO: console.timeEnd("valid");

                               return res.end();
                           }).catch((error: Error) => {
                               return res.json(error);
                           });
                       });
                   });

        return router;
    }

}
