
// Client routes
export const HOME_ROUTE: string = "";
export const GAMES_ROUTE: string = "games";
export const ADMIN_ROUTE: string = "admin";
export const PLAY_ROUTE: string = "play";
export const PLAY_3D_ROUTE: string = "3d-play";
export const LOADING_ROUTE: string = "loading";


// Server routes
export const SERVER_BASE_URL: string = "http://localhost:3000";

export const DIFF_VALIDATOR_BASE: string = "/api/diff-validator/";
export const DIFF_CREATOR_BASE: string = "/api/image-diff/";
export const GAME_CREATOR_BASE: string = "/api/game-creator/";
export const GAME_MANAGER_BASE: string = "/api/game-manager/";
export const SCORE_TABLE_UPDATE: string = "/api/score-table/";

export const MODIFY_SCORES: string = SCORE_TABLE_UPDATE + "modify-scores/";
export const RESET_SCORES: string = SCORE_TABLE_UPDATE + "reset-scores/";

export const SIMPLE_GAME_CREATION_ROUTE: string = GAME_CREATOR_BASE + "create-simple-game/";
export const FREE_GAME_CREATION_ROUTE: string = GAME_CREATOR_BASE + "create-free-game/";

export const GAME_MANAGER_SIMPLE: string = GAME_MANAGER_BASE + "simple/";
export const GAME_MANAGER_FREE: string = GAME_MANAGER_BASE + "free/";

export const DIFF_VALIDATOR_3D_BASE: string = "/api/3d-diff-validator/";

export const BACKGROUND_IMAGE: string = "url(../../assets/images/space.jpg)";
export const BACKGROUND_IMAGE_TEST: string = 'url("../../assets/images/space.jpg")';
export const LOADING_GIF: string = "assets/images/loadingScreen.gif";
