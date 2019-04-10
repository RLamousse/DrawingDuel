import {TIMES_ARRAY_SIZE} from "../../../common/model/game/game";
import {IRecordTime} from "../../../common/model/game/record-time";
import {getRandomValue} from "../../../common/util/util";

const MIN_GENERATED_SCORE: number = 120;
const MAX_GENERATED_SCORE: number = 360;
const GENERATED_NAMES: string[] = ["normie",
                                   "hardTryer4269",
                                   "xXx_D4B0W5_xXx",
                                   "spongebob",
                                   "pikatchu",
                                   "sanic",
                                   "Donald J. Trump",
                                   "some aliens",
                                   "ur mom",
                                   "Som Ting Wong"];

const generateRandomNames: () => string[] = (): string[]  =>  {
    const randomNamesIndex: number[] = [];
    while (randomNamesIndex.length < TIMES_ARRAY_SIZE) {
        const randomNumber: number = getRandomValue(0, GENERATED_NAMES.length);
        if (randomNamesIndex.indexOf(randomNumber) < 0) {
            randomNamesIndex.push(randomNumber);
        }
    }

    return [GENERATED_NAMES[randomNamesIndex[0]],
            GENERATED_NAMES[randomNamesIndex[1]],
            GENERATED_NAMES[randomNamesIndex[2]]];
};

export const createRandomScores: () => IRecordTime[] = (): IRecordTime[]  => {

    const scoreArray: number[] = new Array(TIMES_ARRAY_SIZE);
    for (let i: number = 0; i < TIMES_ARRAY_SIZE; i++) {
        scoreArray[i] = Number(getRandomValue(MIN_GENERATED_SCORE, MAX_GENERATED_SCORE).toFixed(0));
    }

    scoreArray.sort((a: number, b: number) => b - a);
    const randomNames: string[] = generateRandomNames();

    return [{name: randomNames[2], time: scoreArray[2]},
            {name: randomNames[1], time: scoreArray[1]},
            {name: randomNames[0], time: scoreArray[0]}];
};
