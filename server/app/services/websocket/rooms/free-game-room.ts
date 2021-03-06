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

    public constructor(id: string, gameName: string, gameLoader: () => Promise<IFreeGame>, playerCount: number = 1) {
        super(id, gameName, gameLoader, playerCount, {
            foundObjects: [],
        });
    }

    public async interact(interactionData: IFreeGameInteractionData): Promise<IFreeGameInteractionResponse> {
        return this.validateDifference(interactionData.coord)
            .then((object: IJson3DObject) => {
                return {object: object} as IFreeGameInteractionResponse;
            })
            .catch((error: Error) => {
                throw error;
            });
    }

    private async validateDifference(point: IPoint3D): Promise<IJson3DObject> {
        const {x, y, z} = point;
        const queryParams: I3DDiffValidatorControllerRequest = {
            gameName: this.gameName, centerX: x, centerY: y, centerZ: z,
        };

        return Axios.get<IJson3DObject>(SERVER_BASE_URL + DIFF_VALIDATOR_3D_BASE, {params: queryParams})
            .then((response: AxiosResponse<IJson3DObject>) => {
                const object: IJson3DObject = response.data;
                this.assertAlreadyFoundDifference(object);

                return this.updateGameState(object);
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

    private updateGameState(object: IJson3DObject): IJson3DObject {
        this._gameState.foundObjects.push(object);
        this._ongoing = this._gameState.foundObjects.length < this.getDifferenceThreshold();

        return object;
    }

    private assertAlreadyFoundDifference(object: IJson3DObject): void {

        const alreadyFound: boolean = this._gameState.foundObjects
            .some(((foundDifference: IJson3DObject) => deepCompare(foundDifference, object)));

        if (alreadyFound) {
            throw new AlreadyFoundDifferenceError();
        }
    }
}
