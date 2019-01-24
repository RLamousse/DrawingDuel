import { injectable, inject } from "inversify";
import { Router, Request, Response, NextFunction } from "express";

import Types from "../types";
import { UserNameService } from "../services/UserName.service";

@injectable()
export class UserController {

    public constructor(@inject(Types.UserNameService) private userService: UserNameService) { }

    public get router(): Router {
        const router: Router = Router();

        router.post("/",
            async (req: Request, res: Response, next: NextFunction) => {
                if (req.method === "POST")
                    console.log("POST REQUEST");
                console.log(req.method);
                // Send the request to the service and send the response
                let available: boolean = await this.userService.checkAvailability(req.body);
                res.json(available);
            });

        return router;
    }
}
