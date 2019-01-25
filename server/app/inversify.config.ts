import { Container } from "inversify";
import { Application } from "./app";
import {BitmapDiffController} from "./controllers/bitmap-diff.controller";
import { Server } from "./server";
import {BitmapDiffService} from "./services/bitmap-diff.service";
import Types from "./types";

const container: Container = new Container();

container.bind(Types.Server).to(Server);
container.bind(Types.Application).to(Application);

container.bind(Types.BitmapDiffController).to(BitmapDiffController);
container.bind(Types.BitmapDiffService).to(BitmapDiffService);

export { container };
