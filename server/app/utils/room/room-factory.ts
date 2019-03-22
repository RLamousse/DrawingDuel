import Axios, {AxiosResponse} from "axios";
import {DB_FREE_GAME, DB_SIMPLE_GAME, SERVER_BASE_URL} from "../../../../common/communication/routes";
import {EmptyResponseError} from "../../../../common/errors/controller.errors";
import {IFreeGame} from "../../../../common/model/game/free-game";
import {ISimpleGame} from "../../../../common/model/game/simple-game";
import {IRoom, RoomType} from "./room";

export class RoomFactory {

    private static async createSimpleGameRoom(gameName: string) {
        return Axios.get<ISimpleGame>(SERVER_BASE_URL + DB_SIMPLE_GAME + gameName)
            .then((game: AxiosResponse<ISimpleGame>) => {
                if (game.data === null) {
                    throw new EmptyResponseError();
                }

            })
            .catch((error: Error) => {
                throw error;
            });
    }

    private static async createFreeGameRoom(gameName: string) {
        return Axios.get<IFreeGame>(SERVER_BASE_URL + DB_FREE_GAME + gameName)
            .then((game: AxiosResponse<IFreeGame>) => {
                if (game.data === null) {
                    throw new EmptyResponseError();
                }

            })
            .catch((error: Error) => {
                throw error;
            });
    }
}
