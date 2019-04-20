import {IGame, instanceOfGame} from "./game";
import {IScenesDB} from "../../free-game-json-interface/JSONInterface/IScenesJSON";

export interface IFreeGame extends IGame {
    scenes: IScenesDB;
    thumbnail: string;
}

export const instanceOfFreeGame = (object: any): object is IFreeGame =>
    instanceOfGame(object) &&
    'scenes' in object;
    
