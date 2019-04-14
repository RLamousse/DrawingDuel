import Axios from "axios";
import MockAdapter from "axios-mock-adapter";
// tslint:disable-next-line:no-duplicate-imports Weird interaction between singletons and interface (olivier st-o approved)
import AxiosAdapter from "axios-mock-adapter";
import {expect} from "chai";
import * as HttpStatus from "http-status-codes";
import {IMock, Mock} from "typemoq";
import {DIFF_VALIDATOR_3D_BASE, SERVER_BASE_URL} from "../../../../../common/communication/routes";
import {
    AlreadyFoundDifferenceError,
    GameRoomError,
    NoDifferenceAtPointError,
} from "../../../../../common/errors/services.errors";
import {DEFAULT_OBJECT} from "../../../../../common/free-game-json-interface/JSONInterface/IScenesJSON";
import {IFreeGame} from "../../../../../common/model/game/free-game";
import {getOrigin3D} from "../../../../../common/model/point";
import {IFreeGameInteractionResponse} from "../../../../../common/model/rooms/interaction";
import {FreeGameRoom} from "./free-game-room";

describe("A free game room", () => {

    let axiosMock: MockAdapter;
    const DIFF_VALIDATOR_URL: string = SERVER_BASE_URL + DIFF_VALIDATOR_3D_BASE;
    const DIFF_VALIDATOR_GET_CALLS_REGEX: RegExp = new RegExp(`${DIFF_VALIDATOR_URL}/*`);

    beforeEach(() => {
        axiosMock = new AxiosAdapter(Axios);
    });

    // I hate tslint sometimes
    const initFreeGameRoom:
        (freeGameMockConfigurator?: (mockedFreeGame: IMock<IFreeGame>) => void, playerCount?: number, roomId?: string) => FreeGameRoom =
        (freeGameMockConfigurator?: (mockedFreeGame: IMock<IFreeGame>) => void, playerCount: number = 1, roomId: string = "room") => {
            const mockedFreeGame: IMock<IFreeGame> = Mock.ofType<IFreeGame>();
            if (freeGameMockConfigurator !== undefined) {
                freeGameMockConfigurator(mockedFreeGame);
            }

            return new FreeGameRoom(roomId, mockedFreeGame.object, playerCount);
        };

    describe("Interact", () => {
        it("should throw when there's no difference at point", async () => {
            const freeGameRoom: FreeGameRoom = initFreeGameRoom();
            // @ts-ignore Mock certain properties of object
            freeGameRoom["_gameState"] = {foundObjects: []};
            axiosMock.onGet(DIFF_VALIDATOR_GET_CALLS_REGEX)
                .reply(HttpStatus.NOT_FOUND);

            return freeGameRoom.interact({coord: getOrigin3D()})
                .catch((reason: Error) => {
                    expect(reason.message).to.eql(NoDifferenceAtPointError.NO_DIFFERENCE_AT_POINT_ERROR_MESSAGE);
                });
        });

        it("should throw on unexpected server response", async () => {
            const freeGameRoom: FreeGameRoom = initFreeGameRoom();
            // @ts-ignore Mock certain properties of object
            freeGameRoom["_gameState"] = {foundObjects: []};
            axiosMock.onGet(DIFF_VALIDATOR_GET_CALLS_REGEX)
                .reply(HttpStatus.INTERNAL_SERVER_ERROR);

            return freeGameRoom.interact({coord: getOrigin3D()})
                .catch((reason: Error) => {
                    expect(reason.message).not.to.eql(NoDifferenceAtPointError.NO_DIFFERENCE_AT_POINT_ERROR_MESSAGE);
                });
        });

        it("should return a 3D Object with successful call to server", async () => {
            const freeGameRoom: FreeGameRoom = initFreeGameRoom();
            // @ts-ignore Mock certain properties of object
            freeGameRoom["_game"] = DEFAULT_OBJECT;
            // @ts-ignore Mock certain properties of object
            freeGameRoom["_gameState"] = {foundObjects: []};

            axiosMock.onGet(DIFF_VALIDATOR_GET_CALLS_REGEX)
                .reply(HttpStatus.OK, DEFAULT_OBJECT);

            return freeGameRoom.interact({coord: getOrigin3D()})
                .then((response: IFreeGameInteractionResponse) => {
                    expect(response.object).to.eql(DEFAULT_OBJECT);
                });
        });

        it("should throw if an object was already found", async () => {
            const freeGameRoom: FreeGameRoom = initFreeGameRoom();
            // @ts-ignore Mock certain properties of object
            freeGameRoom["_gameState"] = {foundObjects: [DEFAULT_OBJECT]};
            axiosMock.onGet(DIFF_VALIDATOR_GET_CALLS_REGEX)
                .reply(HttpStatus.OK, DEFAULT_OBJECT);

            return freeGameRoom.interact({coord: getOrigin3D()})
                .catch((reason: Error) => {
                    expect(reason.message).to.eql(AlreadyFoundDifferenceError.ALREADY_FOUND_DIFFERENCE_ERROR_MESSAGE);
                });
        });

        it("should throw a room error if the state for a given client is not defined", async () => {
            const freeGameRoom: FreeGameRoom = initFreeGameRoom();

            axiosMock.onGet(DIFF_VALIDATOR_GET_CALLS_REGEX)
                .reply(HttpStatus.OK, DEFAULT_OBJECT);

            return freeGameRoom.interact({coord: getOrigin3D()})
                .catch((reason: Error) => {
                    expect(reason.message).to.eql(GameRoomError.GAME_ROOM_ERROR_MESSAGE);
                });
        });
    });
});
