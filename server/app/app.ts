import * as bodyParser from "body-parser";
import * as cookieParser from "cookie-parser";
import * as cors from "cors";
import * as express from "express";
import {inject, injectable} from "inversify";
import * as logger from "morgan";
import {
    DB_BASE, DIFF_CREATOR_BASE,
    DIFF_VALIDATOR_BASE,
    GAME_CREATOR_BASE,
    SCORE_TABLE_UPDATE,
    USERNAME_BASE
    
} from "../../common/communication/routes";
import {BitmapDiffController} from "./controllers/bitmap-diff.controller";
import {DataBaseController} from "./controllers/data-base.controller";
import {DiffValidator3DController} from "./controllers/diff-validator-3D.controller";
import {DiffValidatorController} from "./controllers/diff-validator.controller";
import {GameCreatorController} from "./controllers/game-creator.controller";
import {ScoreTableController} from "./controllers/score-table.controller";
import {UserController} from "./controllers/username.controller";
import Types from "./types";

@injectable()
export class Application {

    private readonly internalError: number = 500;
    public app: express.Application;

    public constructor(@inject(Types.GameCreatorController) private gameCreatorController: GameCreatorController,
                       @inject(Types.DataBaseController) private dataBaseController: DataBaseController,
                       @inject(Types.UserNameController) private userController: UserController,
                       @inject(Types.ScoreTableController) private scoreTableController: ScoreTableController,
                       @inject(Types.BitmapDiffController) private bitmapDiffController: BitmapDiffController,
                       @inject(Types.DiffValidatorController) private diffValidatorController: DiffValidatorController,
                       @inject(Types.DiffValidator3DController) private diffValidator3DController: DiffValidator3DController) {

        this.app = express();

        this.config();

        this.bindRoutes();
    }

    private config(): void {
        // Middlewares configuration
        this.app.use(logger("dev"));
        this.app.use(express.static("public"));
        this.app.use(bodyParser.json({limit: "1 mb"}));
        this.app.use(bodyParser.urlencoded({ extended: true}));
        this.app.use(cookieParser());
        this.app.use(cors());
    }

    public bindRoutes(): void {
        this.app.use(USERNAME_BASE, this.userController.router);
        this.app.use(SCORE_TABLE_UPDATE, this.scoreTableController.router);
        this.app.use(DIFF_CREATOR_BASE, this.bitmapDiffController.router);
        this.app.use(GAME_CREATOR_BASE, this.gameCreatorController.router);
        this.app.use(DB_BASE, this.dataBaseController.router);
        this.app.use(DIFF_VALIDATOR_BASE, this.diffValidatorController.router);
        this.app.use(DIFF_VALIDATOR_3D_BASE, this.diffValidator3DController.router);
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
