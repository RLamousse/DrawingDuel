import { Container } from "inversify";
import { Application } from "./app";
import {BitmapDiffController} from "./controllers/bitmap-diff.controller";
import {BitmapWriter} from "./images/bitmap/bitmap-writer";
import { Server } from "./server";
import Types from "./types";
import {BitmapDiffService} from "./services/bitmap-diff.service";
import { UserNameService } from "./services/UserName.service";
import { UserController } from "./controllers/username.controller";

const container: Container = new Container();

container.bind(Types.Server).to(Server);
container.bind(Types.Application).to(Application);

container.bind(Types.BitmapDiffController).to(BitmapDiffController);
container.bind(Types.BitmapDiffService).to(BitmapDiffService);

container.bind(Types.BitmapWriter).to(BitmapWriter);
container.bind(Types.UserNameService).to(UserNameService).inSingletonScope();
container.bind(Types.UserNameController).to(UserController);

export { container };
