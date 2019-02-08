import { Container } from "inversify";
import { Application } from "./app";
import {BitmapDiffController} from "./controllers/bitmap-diff.controller";
import {DataBaseController} from "./controllers/data-base.controller";
import { GameCreatorController } from "./controllers/game-creator.controller";
import { UserController } from "./controllers/username.controller";
import {BitmapWriter} from "./images/bitmap/bitmap-writer";
import {Server} from "./server";
import {BitmapDiffService} from "./services/bitmap-diff.service";
import {DataBaseService} from "./services/data-base.service";
import {DiffValidatorService} from "./services/diff-validator.service";
import {DifferenceEvaluatorService} from "./services/difference-evaluator.service";
import {GameCreatorService} from "./services/game-creator.service";
import { UsernameService } from "./services/username.service";
import Types from "./types";

const container: Container = new Container();

container.bind(Types.Server).to(Server);
container.bind(Types.Application).to(Application);

container.bind(Types.GameCreatorController).to(GameCreatorController);
container.bind(Types.GameCreatorService).to(GameCreatorService);

container.bind(Types.DataBaseController).to(DataBaseController);
container.bind(Types.DataBaseService).to(DataBaseService);

container.bind(Types.DifferenceEvaluatorService).to(DifferenceEvaluatorService);
container.bind(Types.DiffValidatorService).to(DiffValidatorService);

container.bind(Types.BitmapDiffController).to(BitmapDiffController);
container.bind(Types.BitmapDiffService).to(BitmapDiffService);
container.bind(Types.BitmapWriter).to(BitmapWriter);

container.bind(Types.UserNameService).to(UsernameService).inSingletonScope();
container.bind(Types.UserNameController).to(UserController);

export { container };
