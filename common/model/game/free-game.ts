import {IGame, instanceOfGame} from "./game";
import { IScenesJSON } from "../../../common/free-game-json-interface/JSONInterface/IScenesJSON";

export interface IFreeGame extends IGame {
    scenes: IScenesJSON;
}

export const instanceOfFreeGame = (object: any): object is IFreeGame =>
    instanceOfGame(object) &&
    'scenesTable' in object;
    
