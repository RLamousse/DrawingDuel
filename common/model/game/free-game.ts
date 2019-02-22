import {IGame, instanceOfGame} from "./game";
import {IScenesJSON} from "../../free-game-json-interface/JSONInterface/IScenesJSON";

export interface IFreeGame extends IGame {
    scenes: IScenesJSON;
}

export const instanceOfFreeGame = (object: any): object is IFreeGame =>
    instanceOfGame(object) &&
    'originalImage' in object &&
    'modifiedImage' in object &&
    'diffData' in object;
