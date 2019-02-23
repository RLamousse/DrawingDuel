import {IGame, instanceOfGame} from "./game";
import { IScenesJSON } from "../../../common/free-game-json-interface/JSONInterface/IScenesJSON";

export interface IFreeGame extends IGame {
    scenesTable: IScenesJSON;
    thumbnail: string;
}

export const instanceOfFreeGame = (object: any): object is IFreeGame =>
    instanceOfGame(object) &&
    'originalImage' in object &&
    'modifiedImage' in object &&
    'diffData' in object;
