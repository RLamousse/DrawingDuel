import { expect } from "chai";
// import * as fs from "fs";
import { DifferenceEvaluatorService } from "./difference-evaluator.service";

const DIFFERENCE_EVALUATOR_SERVICE: DifferenceEvaluatorService = new DifferenceEvaluatorService();
// const FILES_TO_COPY: String[] = ["test1.bmp", "test2.bmp", "test3.bmp", "test4.bmp"];

describe("Difference evaluator service", () => {

    // before(() => {
    //     for (const FILE of FILES_TO_COPY) {
    //         fs.createReadStream("./test/test_files_for_game_creator_service/" + FILE)
    //             .pipe(fs.createWriteStream("./tmp/" + FILE));
    //     }
    // });

    it("should calculate 1 difference", () => {
        expect(DIFFERENCE_EVALUATOR_SERVICE.getNDifferences( "img"))
            .to.equal(1);
    });

    // after(() => {
    //     for (const FILE of FILES_TO_COPY) {
    //         fs.unlink("./tmp/" + FILE, (error: Error) => {
    //             if (error) { throw error; }
    //         });
    //     }
    // });
});
