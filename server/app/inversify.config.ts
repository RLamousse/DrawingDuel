import {Container} from "inversify";
import {Application} from "./app";
import {BitmapDiffController} from "./controllers/bitmap-diff.controller";
import {DiffValidator3DController} from "./controllers/diff-validator-3D.controller";
import {DiffValidatorController} from "./controllers/diff-validator.controller";
import {GameCreatorController} from "./controllers/game-creator.controller";
import {GameManagerController} from "./controllers/game-manager.controller";
import {ScoreTableController} from "./controllers/score-table.controller";
import {WebsocketController} from "./controllers/websocket.controller";
import {BitmapWriter} from "./images/bitmap/bitmap-writer";
import {Server} from "./server";
import {BitmapDiffService} from "./services/bitmap-diff.service";
import {DataBaseService} from "./services/data-base.service";
import {DiffValidator3DService} from "./services/diff-validator-3D.service";
import {DiffValidatorService} from "./services/diff-validator.service";
import {DifferenceEvaluatorService} from "./services/difference-evaluator.service";
import {FreeGameCreatorService} from "./services/free-game-creator.service";
import {GameCreatorService} from "./services/game-creator.service";
import {ImageUploadService} from "./services/image-upload.service";
import {Object3DCreatorService} from "./services/object3D-creator.service";
import {ScoreTableService} from "./services/score-table.service";
import {UsernameService} from "./services/username.service";
import {ChatWebsocketActionService} from "./services/websocket/chat-websocket-action.service";
import {CheckUserWebsocketActionService} from "./services/websocket/check-user-websocket-action.service";
import {DeleteWebsocketActionService} from "./services/websocket/delete-websocket-action.service";
import {DummyWebsocketActionService} from "./services/websocket/dummy-websocket-action.service";
import {RadioTowerService} from "./services/websocket/radio-tower.service";
import {HotelRoomService} from "./services/websocket/rooms/hotel-room.service";
import {UpdateGameScoresWebsocketActionService} from "./services/websocket/update-game-scores-websocket-action.service";
import Types from "./types";

const container: Container = new Container();

container.bind(Types.Server).to(Server);
container.bind(Types.Application).to(Application);

container.bind(Types.GameCreatorController).to(GameCreatorController);
container.bind(Types.GameCreatorService).to(GameCreatorService);
container.bind(Types.ImageUploadService).to(ImageUploadService);

container.bind(Types.GameManagerController).to(GameManagerController);
container.bind(Types.DataBaseService).to(DataBaseService).inSingletonScope();

container.bind(Types.DifferenceEvaluatorService).to(DifferenceEvaluatorService);
container.bind(Types.DiffValidatorService).to(DiffValidatorService);
container.bind(Types.DiffValidatorController).to(DiffValidatorController);

container.bind(Types.BitmapDiffController).to(BitmapDiffController);
container.bind(Types.BitmapDiffService).to(BitmapDiffService);
container.bind(Types.BitmapWriter).to(BitmapWriter);

container.bind(Types.UserNameService).to(UsernameService).inSingletonScope();

container.bind(Types.FreeGameCreatorService).to(FreeGameCreatorService);
container.bind(Types.Object3DCreatorService).to(Object3DCreatorService);

container.bind(Types.ScoreTableService).to(ScoreTableService);
container.bind(Types.ScoreTableController).to(ScoreTableController);

container.bind(Types.WebsocketController).to(WebsocketController);
container.bind(Types.DummyWebsocketActionService).to(DummyWebsocketActionService);
container.bind(Types.ChatWebsocketActionService).to(ChatWebsocketActionService);
container.bind(Types.CheckUserWebsocketActionService).to(CheckUserWebsocketActionService);
container.bind(Types.UpdateGameScoresWebsocketActionService).to(UpdateGameScoresWebsocketActionService);
container.bind(Types.DeleteWebsocketActionService).to(DeleteWebsocketActionService);
container.bind(Types.HotelRoomService).to(HotelRoomService).inSingletonScope();
container.bind(Types.RadioTowerService).to(RadioTowerService).inSingletonScope();

container.bind(Types.DiffValidator3DController).to(DiffValidator3DController);
container.bind(Types.DiffValidator3DService).to(DiffValidator3DService);

export { container };
