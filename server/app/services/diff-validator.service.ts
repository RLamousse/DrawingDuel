import {injectable} from "inversify";
import "reflect-metadata";
import {IPoint} from "../../../common/model/IPoint";

@injectable()
export class DiffValidatorService {
    public hasDifference(gameName: string, point: IPoint): boolean {
        return true;
    }
}
