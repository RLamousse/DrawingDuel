import Axios, {AxiosResponse} from "axios";
import {injectable} from "inversify";
import "reflect-metadata";
import ISimpleGame, {ISimpleDifferenceData} from "../../../common/model/game/simple-game";
import {IPoint} from "../../../common/model/point";

export const INVALID_POINT_ERROR_MESSAGE: string = "Invalid point: out of bounds";

@injectable()
export class DiffValidatorService {

    private static assertPoint(point: IPoint): void {
        if (point.x < 0 || point.y < 0) {
            throw new Error(INVALID_POINT_ERROR_MESSAGE);
        }
    }

    private static getDifferenceGroup(diffData: ISimpleDifferenceData, point: IPoint): number|undefined {
        return undefined;
    }

    public async hasDifference(gameName: string, point: IPoint): Promise<boolean> {
        DiffValidatorService.assertPoint(point);

        const game: ISimpleGame = await this.getGame(gameName);
        const diffData: ISimpleDifferenceData = game.diffData;
        const differenceGroup: number | undefined = DiffValidatorService.getDifferenceGroup(diffData, point);

        return differenceGroup !== undefined;
    }

    private async getGame(gameName: string): Promise<ISimpleGame> {
        return Axios.get<ISimpleGame>(`http://localhost:3000/api/data-base/games/simple/${gameName}`)
            .then((value: AxiosResponse<ISimpleGame>) => value.data)
            // tslint:disable-next-line:no-any Since Axios defines reason as `any`
            .catch((reason: any) => {
                throw new Error(reason.response.data.message);
            });
    }
}
