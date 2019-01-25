import { injectable, inject } from "inversify";
import { Router, Request, Response} from "express";

import Types from "../types";
import { UserNameService } from "../services/UserName.service";

@injectable()
export class UserController {

    public constructor(@inject(Types.UserNameService) private userService: UserNameService) { }

    public get router(): Router {
        const router: Router = Router();

        router.post("/",
            async (req: Request, res: Response) => {
                // Send the request to the service and send the response
                let result = await this.userService.checkAvailability(req.body);
                res.json(result);
            });

        return router;
    }
}
