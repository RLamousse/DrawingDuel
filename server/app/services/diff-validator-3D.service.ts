import {inject, injectable} from "inversify";
import "reflect-metadata";
import {Object3DIsNotADifference} from "../../../common/errors/services.errors";
import {
    IJson3DObject,
    IScenesDB,
} from "../../../common/free-game-json-interface/JSONInterface/IScenesJSON";
import {IFreeGame} from "../../../common/model/game/free-game";
import {IPoint3D} from "../../../common/model/point";
import {deepCompare} from "../../../common/util/util";
import Types from "../types";
import {DataBaseService} from "./data-base.service";

@injectable()
export class DiffValidator3DService {

    public constructor(@inject(Types.DataBaseService) private databaseService: DataBaseService) {}

    public async getDifferentObjects(gameName: string, center: IPoint3D): Promise<IJson3DObject> {

       return this.getGame(gameName).then((value: IFreeGame) => {
            const diffObjs: IScenesDB = value.scenes;
            for (const obj of diffObjs.differentObjects) {
                if (deepCompare(obj.position, center)) {
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
