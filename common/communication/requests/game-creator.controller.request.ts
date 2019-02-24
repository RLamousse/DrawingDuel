import {ModificationType, Themes} from "../../free-game-json-interface/FreeGameCreatorInterface/free-game-enum";

export interface ICreateFreeGameRequest {
    gameName: string;
    objectQuantity: number;
    theme: Themes;
    modificationTypes: ModificationType[];
}
export const GAME_NAME_FIELD: string = "gameName";
