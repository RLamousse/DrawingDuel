import {expect} from "chai";
import {IRecordTime} from "../../../common/model/game/record-time";
import {ScoreTableService} from "./score-table.service";

describe("ScoreTableService", () => {
    // @ts-ignore
    const emptyTime: IRecordTime = null;
    const veryHighTimeScoreBoy: IRecordTime = {name: "Rob", time: 55};
    const highTimeScoreBoy: IRecordTime = {name: "Tommy", time: 7};
    const middleTimeScoreBoy: IRecordTime = {name: "Phil", time: 3};
    const lowTimeScoreBoy: IRecordTime = {name: "Bob", time: 1};
    const sameThanFirstScore: IRecordTime = {name: "Peter", time: 2};
    const sameThanSecondScore: IRecordTime = {name: "Jane", time: 5};
    const sameThanThirdScore: IRecordTime = {name: "Anthony", time: 10};
    const initialScoreTable: IRecordTime[] = [{name: "Paul", time: 2},
                                              {name: "Jack", time: 5},
                                              {name: "Bill", time: 10}];

    // Test createCube
    it("should throw if null time inserted", () => {
        const table: IRecordTime[] = initialScoreTable;
        expect(() => ScoreTableService.insertTime(table, emptyTime)).to.throw();
    });

    it("should return the same table if the time inserted is too high", () => {
        const table: IRecordTime[] = JSON.parse(JSON.stringify(initialScoreTable));
        ScoreTableService.insertTime(table, veryHighTimeScoreBoy);
        expect(table).to.eql(initialScoreTable);
    });

    it("should return a new table with the highTimeScoreBoy at the third place if you insert it", () => {
        const table: IRecordTime[] = JSON.parse(JSON.stringify(initialScoreTable));
        ScoreTableService.insertTime(table, highTimeScoreBoy);
        expect(table[0]).to.eql(initialScoreTable[0]);
        expect(table[1]).to.eql(initialScoreTable[1]);
        expect(table[2]).to.eql(highTimeScoreBoy);
    });

    it("should return a new table with the middleTimeScoreBoy at the second place if you insert it", () => {
        const table: IRecordTime[] = JSON.parse(JSON.stringify(initialScoreTable));
        ScoreTableService.insertTime(table, middleTimeScoreBoy);
        expect(table[0]).to.eql(initialScoreTable[0]);
        expect(table[1]).to.eql(middleTimeScoreBoy);
        expect(table[2]).to.eql(initialScoreTable[1]);
    });

    it("should return a new table with the lowTimeScoreBoy at the first place if you insert it", () => {
        const table: IRecordTime[] = JSON.parse(JSON.stringify(initialScoreTable));
        ScoreTableService.insertTime(table, lowTimeScoreBoy);
        expect(table[0]).to.eql(lowTimeScoreBoy);
        expect(table[1]).to.eql(initialScoreTable[0]);
        expect(table[2]).to.eql(initialScoreTable[1]);
    });

    it("should not replace if you insert same than first", () => {
        const table: IRecordTime[] = JSON.parse(JSON.stringify(initialScoreTable));
        ScoreTableService.insertTime(table, sameThanFirstScore);
        expect(table[0]).to.eql(initialScoreTable[0]);
        expect(table[1]).to.eql(sameThanFirstScore);
        expect(table[2]).to.eql(initialScoreTable[1]);
    });

    it("should not replace if you insert same than second", () => {
        const table: IRecordTime[] = JSON.parse(JSON.stringify(initialScoreTable));
        ScoreTableService.insertTime(table, sameThanSecondScore);
        expect(table[0]).to.eql(initialScoreTable[0]);
        expect(table[1]).to.eql(initialScoreTable[1]);
        expect(table[2]).to.eql(sameThanSecondScore);
    });

    it("should not replace if you insert same than third", () => {
        const table: IRecordTime[] = JSON.parse(JSON.stringify(initialScoreTable));
        ScoreTableService.insertTime(table, sameThanThirdScore);
        expect(table).to.eql(initialScoreTable);
    });
});
