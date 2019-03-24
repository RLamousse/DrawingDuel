import {Request, Response, Router} from "express";
import * as HttpStatus from "http-status-codes";
import {inject, injectable} from "inversify";
import {UserValidationMessage} from "../../../common/communication/messages/user-validation-message";
import {NoUsernameInRequestError} from "../../../common/errors/controller.errors";
import {UsernameService} from "../services/username.service";
import Types from "../types";

@injectable()
export class UserController {

    public constructor(@inject(Types.UserNameService) private userService: UsernameService) {
    }

    public get router(): Router {
        const router: Router = Router();

        router.post("/add", async (req: Request, res: Response) => {
            try {
                if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
                    throw new NoUsernameInRequestError();
                }
                const result: UserValidationMessage = this.userService.checkAvailability(req.body);
                res.json(result);
            } catch (error) {
                UserController.answerWithError(error, res);

                return;
            }
        });

        router.post("/release", async (req: Request, res: Response) => {
            try {
                if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
                    throw new NoUsernameInRequestError();
                }
                const response: UserValidationMessage = this.userService.releaseUsername(req.body);
                res.json(response);
            } catch (error) {
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
