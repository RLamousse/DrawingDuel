import {IGame, instanceOfGame} from "./game";

export interface IFreeGame extends IGame {
    // feature still in progress
}

export const instanceOfFreeGame = (object: any): object is IFreeGame =>
    instanceOfGame(object) &&
    'originalImage' in object &&
    'modifiedImage' in object &&
    'diffData' in object;
