import Axios, {AxiosResponse} from "axios";
import {injectable} from "inversify";
import "reflect-metadata";
import {IGame} from "../../../common/model/IGame";
import {IPoint} from "../../../common/model/IPoint";
import {IDiffZonesMap} from "./difference-evaluator.service";

@injectable()
export class DiffValidatorService {
    public async hasDifference(gameName: string, point: IPoint): Promise<boolean> {
        const game: IGame = await this.getGame(gameName);
        const diffData: IDiffZonesMap = game.diffData;

        return diffData.has(point);
    }

    private async getGame(gameName: string): Promise<IGame> {
        return Axios.get<IGame>(`http://localhost:3000/api/data-base/games/${gameName}`)
            .then((value: AxiosResponse<IGame>) => value.data)
            // tslint:disable-next-line:no-any Since Axios defines reason as `any`
            .catch((reason: any) => {
                throw new Error(reason);
            });
    }
}
