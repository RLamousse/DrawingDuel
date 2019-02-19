import * as bodyParser from "body-parser";
import * as cookieParser from "cookie-parser";
import * as cors from "cors";
import * as express from "express";
import { inject, injectable } from "inversify";
import * as logger from "morgan";
import {BitmapDiffController} from "./controllers/bitmap-diff.controller";
import {DataBaseController} from "./controllers/data-base.controller";
import {GameCreatorController} from "./controllers/game-creator.controller";
import { UserController } from "./controllers/username.controller";
import Types from "./types";

@injectable()
export class Application {

    private readonly internalError: number = 500;
    public app: express.Application;

    public constructor(@inject(Types.GameCreatorController) private gameCreatorController: GameCreatorController,
                       @inject(Types.DataBaseController) private dataBaseController: DataBaseController,
                       @inject(Types.UserNameController) private userController: UserController,
                       @inject(Types.BitmapDiffController) private bitmapDiffController: BitmapDiffController) {

        this.app = express();

        this.config();

        this.bindRoutes();
    }

    private config(): void {
        // Middlewares configuration
        this.app.use(logger("dev"));
        this.app.use(express.static("public"));
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: true}));
        this.app.use(cookieParser());
        this.app.use(cors());
    }

    public bindRoutes(): void {
        this.app.use("/api/usernames", this.userController.router);
        this.app.use("/api/image-diff", this.bitmapDiffController.router);
        this.app.use("/api/game-creator", this.gameCreatorController.router);
        this.app.use("/api/data-base", this.dataBaseController.router);
        this.errorHandeling();
    }

    private errorHandeling(): void {
        // Gestion des erreurs
        this.app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
            const err: Error = new Error("Not Found");
            next(err);
        });

        // development error handler
        // will print stacktrace
        if (this.app.get("env") === "development") {
            // tslint:disable-next-line:no-any
            this.app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
                res.status(err.status || this.internalError);
                res.send({
                    message: err.message,
                    error: err,
                });
            });
        }

        // production error handler
        // no stacktraces leaked to user (in production env only)
        // tslint:disable-next-line:no-any
        this.app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
            res.status(err.status || this.internalError);
            res.send({
                message: err.message,
                error: {},
            });
        });
    }
}
