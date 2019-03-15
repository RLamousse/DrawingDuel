import Axios, {AxiosResponse} from "axios";
import {injectable} from "inversify";
import "reflect-metadata";
import {DB_FREE_GAME, SERVER_BASE_URL} from "../../../common/communication/routes";
import {Object3DIsNotADifference} from "../../../common/errors/services.errors";
import {IJson3DObject, IScenesDB} from "../../../common/free-game-json-interface/JSONInterface/IScenesJSON";

@injectable()
export class DiffValidator3DService {
    public async getDifferentObjects(gameName: string, center: number[]): Promise<IJson3DObject> {

        const game: IScenesDB = await this.getGame(gameName);
        const diffObjs: IJson3DObject[] = game.differentObjects;
        for (const obj of diffObjs) {
           if (obj.position === center) {
               return obj;
           }
        }
        throw new Object3DIsNotADifference();
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
