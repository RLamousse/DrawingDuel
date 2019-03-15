import Axios, {AxiosResponse} from "axios";
import {injectable} from "inversify";
import "reflect-metadata";
import {DB_FREE_GAME, SERVER_BASE_URL} from "../../../common/communication/routes";
import {Object3DIsNotADifference} from "../../../common/errors/services.errors";
import {Coordinate} from "../../../common/free-game-json-interface/FreeGameCreatorInterface/free-game-enum";
import {IJson3DObject, IScenesDB} from "../../../common/free-game-json-interface/JSONInterface/IScenesJSON";

@injectable()
export class DiffValidator3DService {
    public async getDifferentObjects(gameName: string, center: number[]): Promise<IJson3DObject> {

       return this.getGame(gameName).then((value: IScenesDB) => {
            const diffObjs: IJson3DObject[] = value.differentObjects;
            console.log(value);
            console.log(value.differentObjects[0]);
            for (const obj of diffObjs) {
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

    private async getGame(gameName: string): Promise<IScenesDB> {
        return Axios.get<IScenesDB>(SERVER_BASE_URL + DB_FREE_GAME + gameName)
            .then((value: AxiosResponse<IScenesDB>) => value.data)
            // tslint:disable-next-line:no-any Since Axios defines reason as `any`
            .catch((reason: any) => {
                throw new Error(reason.response.data.message);
            });
    }
}
