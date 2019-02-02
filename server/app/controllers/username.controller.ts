import { injectable, inject } from "inversify";
import { Router, Request, Response} from "express";
import * as HttpStatus from "http-status-codes";
import Types from "../types";
import { UserNameService } from "../services/UserName.service";
import { UserValidationMessage } from "../../../common/communication/UserValidationMessage";

@injectable()
export class UserController {

    public constructor(@inject(Types.UserNameService) private userService: UserNameService) { }

    public get router(): Router {
        const router: Router = Router();

        router.post("/add",
            async (req: Request, res: Response) => {
                try {
                    if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
                        throw new Error("Error: no username to add was included in the request");
                    }
                    let result: UserValidationMessage = await this.userService.checkAvailability(req.body);
                    res.json(result);
                }
                catch (error) {
                    UserController.answerWithError(error, res);

                    return;
                }
            });

        router.post("/release",
            async (req: Request, res: Response) => {
                try {
                    if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
                        throw new Error("Error: no username to release included in the request");
                    }
                    let response = await this.userService.releaseUsername(req.body);
                    res.json(response);
                }
                catch (error) {
                    UserController.answerWithError(error, res);

                    return;
                }
                
            });

        return router;
    }

    private static answerWithError(error: Error, res: Response): void {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR);
        res.json({
            status: "error",
            error: error.message,
        });
    }
}
