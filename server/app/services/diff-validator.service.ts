import Axios, {AxiosResponse} from "axios";
import {injectable} from "inversify";
import "reflect-metadata";
import {IGame} from "../../../common/model/IGame";
import {IPoint} from "../../../common/model/IPoint";
import {SimpleDifferenceData} from "./difference-evaluator.service";

@injectable()
export class DiffValidatorService {
    public async hasDifference(gameName: string, point: IPoint): Promise<boolean> {
        const game: IGame = await this.getGame(gameName);
        const diffData: SimpleDifferenceData = game.diffData;

        let it = diffData.entries();
        let result = it.next();
        while (!result.done) {
            if (result.value[1].indexOf(point) >= 0) {
                break;
            }
            result = it.next();
        }
        // TODO find way to return the array of linked points too
        return result.done;
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
