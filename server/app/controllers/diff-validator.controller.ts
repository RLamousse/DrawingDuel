import {NextFunction, Request, Response, Router} from "express";
import { inject, injectable } from "inversify";
import {IDiffValidatorControllerRequest} from "../../../common/communication/requests/diff-validator-controller.request";
import {IDiffValidatorControllerResponse} from "../../../common/communication/response/diff-validator-controller.response";
import {DiffValidatorService} from "../services/diff-validator.service";
import Types from "../types";
import {assertFieldsOfRequest} from "./controller-utils";

@injectable()
export class DiffValidatorController {

    public constructor(@inject(Types.DiffValidatorService) private diffValidatorService: DiffValidatorService) {}

    public get router(): Router {
        const router: Router = Router();
        router.post("/",
                    (req: Request, res: Response, next: NextFunction) => {
                    try {
                        assertFieldsOfRequest(req, "gameName", "coord");
                        const body: IDiffValidatorControllerRequest = req.body;
                        const response: IDiffValidatorControllerResponse = {
                            validDifference: this.diffValidatorService.hasDifference(body["gameName"], body["coord"]),
                        };
                        res.json(response);
                    } catch (error) {
                        return next(error);
                    }
            });

        return router;
    }

}
