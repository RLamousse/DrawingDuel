import {inject, injectable} from "inversify";
import "reflect-metadata";
import {Object3DIsNotADifference} from "../../../common/errors/services.errors";
import {Coordinate} from "../../../common/free-game-json-interface/FreeGameCreatorInterface/free-game-enum";
import {
    IJson3DObject,
    IScenesDB,
} from "../../../common/free-game-json-interface/JSONInterface/IScenesJSON";
import {IFreeGame} from "../../../common/model/game/free-game";
import Types from "../types";
import {DataBaseService} from "./data-base.service";

@injectable()
export class DiffValidator3DService {

    public constructor(@inject(Types.DataBaseService) private databaseService: DataBaseService) {}

    public async getDifferentObjects(gameName: string, center: number[]): Promise<IJson3DObject> {

       return this.getGame(gameName).then((value: IFreeGame) => {
            const diffObjs: IScenesDB = value.scenes;
            for (const obj of diffObjs.differentObjects) {
                if (obj.position[Coordinate.X] === center[Coordinate.X] &&
                    obj.position[Coordinate.Y] === center[Coordinate.Y] &&
                    obj.position[Coordinate.Z] === center[Coordinate.Z]
                ) {
                    return obj;
                }
            }
            throw new Object3DIsNotADifference();
        });
    }

    private async getGame(gameName: string): Promise<IFreeGame> {
        return this.databaseService.freeGames.getFromId(gameName);
    }
}
