import Axios, {AxiosResponse} from "axios";
import {injectable} from "inversify";
import "reflect-metadata";
import {DB_SIMPLE_GAME, SERVER_BASE_URL} from "../../../common/communication/routes";
import {InvalidPointError, NoDifferenceAtPointError} from "../../../common/errors/services.errors";
import {
    DifferenceCluster,
    DIFFERENCE_CLUSTER_POINTS_INDEX,
    ISimpleDifferenceData,
    ISimpleGame
} from "../../../common/model/game/simple-game";
import {IPoint} from "../../../common/model/point";

@injectable()
export class DiffValidatorService {

    private static assertPoint(point: IPoint): void {
        if (point.x < 0 || point.y < 0) {
            throw new InvalidPointError();
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
            throw new NoDifferenceAtPointError();
        }

        return differenceGroup;
    }

    private async getGame(gameName: string): Promise<ISimpleGame> {
        return Axios.get<ISimpleGame>(SERVER_BASE_URL + DB_SIMPLE_GAME + gameName)
            .then((value: AxiosResponse<ISimpleGame>) => value.data)
            // tslint:disable-next-line:no-any Since Axios defines reason as `any`
            .catch((reason: any) => {
                throw new Error(reason.response.data.message);
            });
    }
}
