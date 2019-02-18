import {IGame, instanceOfGame} from "./game";

export interface IFreeGame extends IGame {

}

export const instanceOfFreeGame = (object: any): object is IFreeGame =>
    instanceOfGame(object) &&
    'originalImage' in object &&
    'modifiedImage' in object &&
    'diffData' in object;
