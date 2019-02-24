import { instanceOfGame } from "./game";
import { IFreeGame, instanceOfFreeGame} from "./free-game";

export interface IExtendedFreeGame extends IFreeGame {
    thumbnail: string;
}

export const instanceOfExtendedFreeGame = (object: any): object is IExtendedFreeGame =>
    instanceOfGame(object) &&
    instanceOfFreeGame(object) &&
    'thumbnail' in object;  