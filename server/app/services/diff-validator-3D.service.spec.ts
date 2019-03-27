import Axios from "axios";
import AxiosAdapter from "axios-mock-adapter";
// tslint:disable-next-line:no-duplicate-imports Weird interaction between singletons and interface (olivier st-o approved)
import MockAdapter from "axios-mock-adapter";
import {expect} from "chai";
import * as HttpStatus from "http-status-codes";
import {DB_FREE_GAME, SERVER_BASE_URL} from "../../../common/communication/routes";
import {NonExistentGameError} from "../../../common/errors/database.errors";
import {Object3DIsNotADifference} from "../../../common/errors/services.errors";
import {Themes} from "../../../common/free-game-json-interface/FreeGameCreatorInterface/free-game-enum";
import {IJson3DObject} from "../../../common/free-game-json-interface/JSONInterface/IScenesJSON";
import {IFreeGame} from "../../../common/model/game/free-game";
import {DiffValidator3DService} from "./diff-validator-3D.service";

describe("A service validating if there is a difference at a coord for a free game", () => {

    let axiosMock: MockAdapter;
    const diffValidator3DService: DiffValidator3DService = new DiffValidator3DService();

    const mockedFreeGame: IFreeGame = {
        gameName: "freeGame",
        scenes : {
            originalObjects: [],
            modifiedObjects: [],
            differentObjects: [{
                position: [0, 0, 0],
                type: 0,
                rotation: [0, 0, 0],
                color: 0xFFFFFF,
                gameType: Themes.Geometry,
                scale: 1,
            }],
        },
        bestSoloTimes: [],
        bestMultiTimes: [],
        toBeDeleted: false,
    };
    beforeEach(() => {
        axiosMock = new AxiosAdapter(Axios);
    });

    it("should throw when an invalid gameName is entered", async () => {
        axiosMock.onGet(SERVER_BASE_URL + DB_FREE_GAME + "notAValidGame")
            .reply(HttpStatus.NOT_FOUND, {message: NonExistentGameError.NON_EXISTENT_GAME_ERROR_MESSAGE});

        return diffValidator3DService.getDifferentObjects("notAValidGame", [0, 0, 0])
            .catch((reason: Error) => {
                expect(reason.message).to.equal(NonExistentGameError.NON_EXISTENT_GAME_ERROR_MESSAGE);
            });
    });

    it("should return an object corresponding to the center", async () => {
        axiosMock.onGet(SERVER_BASE_URL + DB_FREE_GAME + "game")
            .reply(HttpStatus.OK, mockedFreeGame);

        return diffValidator3DService.getDifferentObjects("game", [0, 0, 0])
            .then((value: IJson3DObject) => {
                return expect(value).to.eql(mockedFreeGame.scenes.differentObjects[0]);
            });
    });

    it("should throw an Object3DIsNotADifference error when passed bad coordinates", async () => {
        axiosMock.onGet(SERVER_BASE_URL + DB_FREE_GAME + "game")
            .reply(HttpStatus.OK, mockedFreeGame);

        // tslint:disable-next-line:no-magic-numbers
        return diffValidator3DService.getDifferentObjects("game", [12, 23, 45])
            .catch((reason: Error) => {
                expect(reason.message).to.equal(Object3DIsNotADifference.OBJ_3D_NOT_A_DIFFERENCE_ERROR_MESSAGE);
            });
    });

});
