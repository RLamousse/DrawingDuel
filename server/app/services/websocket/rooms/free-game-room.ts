import Axios, {AxiosResponse} from "axios";
import * as Httpstatus from "http-status-codes";
import {I3DDiffValidatorControllerRequest} from "../../../../../common/communication/requests/diff-validator-controller.request";
import {DIFF_VALIDATOR_3D_BASE, SERVER_BASE_URL} from "../../../../../common/communication/routes";
import {
    AlreadyFoundDifferenceError,
    GameRoomError,
    NoDifferenceAtPointError
} from "../../../../../common/errors/services.errors";
import {IJson3DObject} from "../../../../../common/free-game-json-interface/JSONInterface/IScenesJSON";
import {IFreeGame} from "../../../../../common/model/game/free-game";
import {IFreeGameState} from "../../../../../common/model/game/game-state";
import {IPoint3D} from "../../../../../common/model/point";
import {IFreeGameInteractionData, IFreeGameInteractionResponse} from "../../../../../common/model/rooms/interaction";
import {deepCompare} from "../../../../../common/util/util";
import {AbstractGameRoom} from "./abstract-game-room";

export class FreeGameRoom extends AbstractGameRoom<IFreeGame, IFreeGameState> {

    public constructor(id: string, game: IFreeGame, playerCount: number = 1) {
        super(id, game, playerCount);
    }

    public checkIn(clientId: string): void {
        super.checkIn(clientId);
        this._gameStates.set(
            clientId,
            {
                foundObjects: [],
            } as IFreeGameState);
    }

    public async interact(clientId: string, interactionData: IFreeGameInteractionData): Promise<IFreeGameInteractionResponse> {
        return this.validateDifference(clientId, interactionData.coord)
            .then((object: IJson3DObject) => {
                return {object: object} as IFreeGameInteractionResponse;
            })
            .catch((error: Error) => {
                throw error;
            });
    }

    private async validateDifference(clientId: string, point: IPoint3D): Promise<IJson3DObject> {
        const {x, y, z} = point;
        const queryParams: I3DDiffValidatorControllerRequest = {
            gameName: this.gameName, centerX: x, centerY: y, centerZ: z,
        };

        return Axios.get<IJson3DObject>(SERVER_BASE_URL + DIFF_VALIDATOR_3D_BASE, {params: queryParams})
            .then((response: AxiosResponse<IJson3DObject>) => {
                const object: IJson3DObject = response.data;
                this.assertAlreadyFoundDifference(clientId, object);

                return this.updateGameState(clientId, object);
            })
            // tslint:disable-next-line:no-any Generic error response
            .catch((reason: any) => {
                if (reason.response && reason.response.status === Httpstatus.NOT_FOUND) {
                    throw new NoDifferenceAtPointError();
                } else if (reason.message === AlreadyFoundDifferenceError.ALREADY_FOUND_DIFFERENCE_ERROR_MESSAGE) {
                    throw reason;
                }

                throw new GameRoomError();
            });
    }

    private updateGameState(clientId: string, object: IJson3DObject): IJson3DObject {
        const clientGameState: IFreeGameState = this.getGameStateForClient(clientId);
        clientGameState.foundObjects.push(object);

        return object;
    }

    private assertAlreadyFoundDifference(clientId: string, object: IJson3DObject): void {
        const clientGameState: IFreeGameState = this.getGameStateForClient(clientId);

        const alreadyFound: boolean = clientGameState.foundObjects
            .some(((foundDifference: IJson3DObject) => deepCompare(foundDifference, object)));

        if (alreadyFound) {
            throw new AlreadyFoundDifferenceError();
        }
    }
}
