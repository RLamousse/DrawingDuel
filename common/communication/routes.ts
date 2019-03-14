export const SERVER_BASE_URL: string = "http://localhost:3000";

export const USERNAME_BASE: string = "/api/usernames/";
export const DIFF_VALIDATOR_BASE: string = "/api/diff-validator/";
export const DIFF_CREATOR_BASE: string = "/api/image-diff/";
export const GAME_CREATOR_BASE: string = "/api/game-creator/";
export const DB_BASE: string = "/api/data-base/";

export const SIMPLE_GAME_CREATION_ROUTE: string = GAME_CREATOR_BASE + "create-simple-game/";
export const FREE_GAME_CREATION_ROUTE: string = GAME_CREATOR_BASE + "create-free-game/";

export const DB_SIMPLE_GAME: string = DB_BASE + "games/simple/";
export const DB_FREE_GAME: string = DB_BASE + "games/free/";
export const DB_USERS: string = DB_BASE + "users/";

export const USERNAME_ADD: string = USERNAME_BASE + "add/";
export const USERNAME_RELEASE: string = USERNAME_BASE + "release/";

export const DIFF_VALIDATOR_3D_BASE: string = "/api/3d-diff-validator/";
