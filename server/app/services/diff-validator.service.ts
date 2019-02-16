import Axios, {AxiosResponse} from "axios";
import {injectable} from "inversify";
import "reflect-metadata";
import {ISimpleDifferenceData} from "../../../common/model/game/differences/simple-difference-data";
import {Game} from "../../../common/model/game/game";
import {SimpleGame} from "../../../common/model/game/simple-game";
import {IPoint} from "../../../common/model/point";

@injectable()
export class DiffValidatorService {
    public async hasDifference(gameName: string, point: IPoint): Promise<boolean> {
        const game: Game = await this.getGame(gameName);
        let diffData: ISimpleDifferenceData ;
        if (game instanceof SimpleGame) {
            diffData = game.diffData;
        } else {
            throw new Error("DiffValidatorService: Not implemented");
        }

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

    private async getGame(gameName: string): Promise<Game> {
        return Axios.get<Game>(`http://localhost:3000/api/data-base/games/${gameName}`)
            .then((value: AxiosResponse<Game>) => value.data)
            // tslint:disable-next-line:no-any Since Axios defines reason as `any`
            .catch((reason: any) => {
                throw new Error(reason);
            });
    }
}
