import Axios, {AxiosResponse} from "axios";
import {injectable} from "inversify";
import "reflect-metadata";
import {
    DifferenceCluster,
    DIFFERENCE_CLUSTER_POINTS_INDEX,
    ISimpleDifferenceData,
    ISimpleGame
} from "../../../common/model/game/simple-game";
import {IPoint} from "../../../common/model/point";

export const INVALID_POINT_ERROR_MESSAGE: string = "Invalid point: out of bounds";
export const NO_DIFFERENCE_AT_POINT_ERROR_MESSAGE: string = "There is no difference at the specified point";

@injectable()
export class DiffValidatorService {

    private static assertPoint(point: IPoint): void {
        if (point.x < 0 || point.y < 0) {
            throw new Error(INVALID_POINT_ERROR_MESSAGE);
        }
    }

    private static getDifferenceClusterOfPoint(diffData: ISimpleDifferenceData, point: IPoint): DifferenceCluster|undefined {
        for (const diffCluster of diffData) {
            if (diffCluster[DIFFERENCE_CLUSTER_POINTS_INDEX].findIndex((x: IPoint) => x.x === point.x && x.y === point.y) >= 0) {
                return diffCluster;
            }
        }

        return undefined;
    }

    public async getDifferenceCluster(gameName: string, point: IPoint): Promise<DifferenceCluster> {
        DiffValidatorService.assertPoint(point);

        const game: ISimpleGame = await this.getGame(gameName);
        const diffData: ISimpleDifferenceData = game.diffData;
        const differenceGroup: DifferenceCluster | undefined = DiffValidatorService.getDifferenceClusterOfPoint(diffData, point);

        if (differenceGroup === undefined) {
            throw new Error(NO_DIFFERENCE_AT_POINT_ERROR_MESSAGE);
        }

        return differenceGroup;
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
