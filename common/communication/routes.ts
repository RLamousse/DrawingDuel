export const SERVER_BASE_URL: string = "http://localhost:3000";

export const USERNAME_BASE: string = "/api/usernames/";
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

export const GAME_MANAGER_GET_REQUEST: string = "get/";
export const GAME_MANAGER_GET_ALL_REQUEST: string = "get-all/";
export const GAME_MANAGER_GET_NOT_DELETED_REQUEST: string = "get-not-deleted/";
export const GAME_MANAGER_UPDATE_REQUEST: string = "update/";

export const USERNAME_ADD: string = USERNAME_BASE + "add/";
export const USERNAME_RELEASE: string = USERNAME_BASE + "release/";

export const DIFF_VALIDATOR_3D_BASE: string = "/api/3d-diff-validator/";
