import { Container } from "inversify";
import { Application } from "./app";
import {DataBaseController} from "./controllers/data-base.controller";
import { GameCreatorController } from "./controllers/game-creator.controller";
import { Server } from "./server";
import {DataBaseService} from "./services/data-base.service";
import {GameCreatorService} from "./services/game-creator.service";
import Types from "./types";

const container: Container = new Container();

container.bind(Types.Server).to(Server);
container.bind(Types.Application).to(Application);
container.bind(Types.GameCreatorController).to(GameCreatorController);
container.bind(Types.GameCreatorService).to(GameCreatorService);
container.bind(Types.DataBaseController).to(DataBaseController);
container.bind(Types.DataBaseService).to(DataBaseService);

export { container };
