import {injectable} from "inversify";
import "reflect-metadata";
import {Point} from "../../../common/model/point";

@injectable()
export class DiffValidatorService {
    public hasDifference(gameName: string, point: Point): boolean {
        return true;
    }
}
