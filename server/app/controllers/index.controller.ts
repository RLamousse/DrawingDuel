import { injectable, inject } from "inversify";
import { Router, Request, Response, NextFunction } from "express";
import * as multer from "multer";
import Types from "../types";
import { IndexService } from "../services/index.service";
import {Message} from "../../../common/communication/message";

//TODO change place of those and create constants to respect the requirements
const UPLOAD_PATH = 'testUploads';
const upload = multer({ dest: `${UPLOAD_PATH}/`, fileFilter: (req: Request, file: Express.Multer.File, cb: any) => {
    cb(null, file.mimetype === "text/plain");
}});

@injectable()
export class IndexController {

    public constructor(@inject(Types.IndexService) private indexService: IndexService) { }

    public get router(): Router {
        const router: Router = Router();
        
        router.get("/",
            async (req: Request, res: Response, next: NextFunction) => {
                // Send the request to the service and send the response
                const time = await this.indexService.helloWorld();
                res.json(time);
            });

        router.get("/about",
            (req: Request, res: Response, next: NextFunction) => {
                // Send the request to the service and send the response
                res.json(this.indexService.about());
            });

        router.post("/createGame",
                    upload.single("testFile"),
                    async (req: Request, res: Response, next: NextFunction) => {
            const answer: Message = await this.indexService.createGame(req);
            res.json(answer);
            });

        return router;
    }
}
