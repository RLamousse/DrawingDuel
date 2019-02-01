import { injectable, inject } from "inversify";
import { Router, Request, Response} from "express";

import Types from "../types";
import { UserNameService } from "../services/UserName.service";

@injectable()
export class UserController {

    public constructor(@inject(Types.UserNameService) private userService: UserNameService) { }

    public get router(): Router {
        const router: Router = Router();

        router.post("/add",
            async (req: Request, res: Response) => {
                let result = await this.userService.checkAvailability(req.body);
                res.json(result);
            });

        router.post("/release",
            async (req: Request, res: Response) => {
                let response = await this.userService.releaseUsername(req.body);
                res.json(response);
            });

        return router;
    }
}
