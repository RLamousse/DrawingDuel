import {expect} from "chai";
import {anything, instance, mock, when} from "ts-mockito";
import {NonExistentGameError} from "../../../common/errors/database.errors";
import {Object3DIsNotADifference} from "../../../common/errors/services.errors";
import {Themes} from "../../../common/free-game-json-interface/FreeGameCreatorInterface/free-game-enum";
import {IJson3DObject} from "../../../common/free-game-json-interface/JSONInterface/IScenesJSON";
import {IFreeGame} from "../../../common/model/game/free-game";
import {getOrigin3D} from "../../../common/model/point";
import {DataBaseService} from "./data-base.service";
import {FreeGamesCollectionService} from "./db/free-games.collection.service";
import {DiffValidator3DService} from "./diff-validator-3D.service";

describe("A service validating if there is a difference at a coord for a free game", () => {

    const mockedFreeGame: IFreeGame = {
        gameName: "freeGame",
        scenes : {
            originalObjects: [],
            modifiedObjects: [],
            differentObjects: [{
                position: getOrigin3D(),
                rotation: getOrigin3D(),
                type: 0,
                color: 0xFFFFFF,
                gameType: Themes.Geometry,
                scale: 1,
            }],
        },
        bestSoloTimes: [],
        bestMultiTimes: [],
        toBeDeleted: false,
    };

    let mockedDataBaseService: DataBaseService;
    let mockedFreeGames: FreeGamesCollectionService;
    const initDiffValidatorService: () => DiffValidator3DService = () => {
        when(mockedDataBaseService.freeGames).thenReturn(instance(mockedFreeGames));

        return new DiffValidator3DService(instance(mockedDataBaseService));
    };
    beforeEach(() => {
        mockedDataBaseService = mock(DataBaseService);
        mockedFreeGames = mock(FreeGamesCollectionService);
        when(mockedFreeGames.getFromId(anything())).thenResolve(mockedFreeGame);
    });

    it("should throw when an invalid gameName is entered", async () => {

        when(mockedFreeGames.getFromId(anything())).thenReject(new NonExistentGameError());

        return initDiffValidatorService().getDifferentObjects("notAValidGame", getOrigin3D())
            .catch((reason: Error) => {
                expect(reason.message).to.equal(NonExistentGameError.NON_EXISTENT_GAME_ERROR_MESSAGE);
            });
    });

    it("should return an object corresponding to the center", async () => {

        return initDiffValidatorService().getDifferentObjects("game", getOrigin3D())
            .then((value: IJson3DObject) => {
                return expect(value).to.eql(mockedFreeGame.scenes.differentObjects[0]);
            });
    });

    it("should throw an Object3DIsNotADifference error when passed bad coordinates", async () => {

        // tslint:disable-next-line:no-magic-numbers
        return initDiffValidatorService().getDifferentObjects("game", {x: 12, y: 23, z: 45})
            .catch((reason: Error) => {
                expect(reason.message).to.equal(Object3DIsNotADifference.OBJ_3D_NOT_A_DIFFERENCE_ERROR_MESSAGE);
            });
    });

});
