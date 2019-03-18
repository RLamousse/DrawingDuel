import {inject, injectable} from "inversify";
import {ScoreTableService} from "../services/score-table.service";
import Types from "../types";

@injectable()
export class DiffValidatorController {

    public constructor(@inject(Types.ScoreTableService) private scoreTableService: ScoreTableService) {
    }
}
