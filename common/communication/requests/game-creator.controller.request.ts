export interface IGameCreatorControllerRequest {
    gameName: string;
    originalImage: ArrayBuffer;
    modifiedImage: ArrayBuffer;
}
export const GAME_NAME_FIELD: string = "gameName";
