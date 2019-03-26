import {inject, injectable} from "inversify";
import "reflect-metadata";
import {DatabaseError} from "../../../common/errors/database.errors";
import {InvalidPointError} from "../../../common/errors/services.errors";
import {IPoint} from "../../../common/model/point";
import Types from "./../types";
import {DataBaseService} from "./data-base.service";

@injectable()
export class DiffValidatorService {

    public constructor(@inject(Types.DataBaseService) private databaseService: DataBaseService) {
    }

    private static assertPoint(point: IPoint): void {
        if (point.x < 0 || point.y < 0) {
            throw new InvalidPointError();
        }
    }

    public async validatePoint(gameName: string, point: IPoint): Promise<boolean> {
        DiffValidatorService.assertPoint(point);

        return this.databaseService
            .simpleGames
            .documentCountWithQuery({gameName: gameName, diffData: {$elemMatch: {$elemMatch: {$elemMatch: point}}}})
            .then((documentCount: number) => {
                return documentCount >= 1;
            }).catch((dbError: DatabaseError) => {
                throw dbError;
            });
    }
}
