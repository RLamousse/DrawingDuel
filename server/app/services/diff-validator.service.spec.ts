import {fail} from "assert";
import {expect} from "chai";
import {anything, instance, mock, when} from "ts-mockito";
import {InvalidPointError} from "../../../common/errors/services.errors";
import {DataBaseService} from "./data-base.service";
import {SimpleGamesCollectionService} from "./db/simple-games.collection.service";
import {DiffValidatorService} from "./diff-validator.service";

describe("A service validating if there is a difference at a coord for a game", () => {

    let mockedDataBaseService: DataBaseService;
    let mockedSimpleGames: SimpleGamesCollectionService;

    const initDiffValidatorService: (mockConfigurator?: () => void) => DiffValidatorService = (mockConfigurator?: () => void) => {
        mockedDataBaseService = mock(DataBaseService);
        mockedSimpleGames = mock(SimpleGamesCollectionService);
        when(mockedDataBaseService.simpleGames).thenReturn(instance(mockedSimpleGames));
        if (mockConfigurator !== undefined) {
            mockConfigurator();
        }
        const mockedSimpleGamesCollectionService: DataBaseService = instance(mockedDataBaseService);

        return new DiffValidatorService(mockedSimpleGamesCollectionService);
    };

    beforeEach(() => {
        mockedDataBaseService = mock(DataBaseService);
    });

    it("should throw if the point is out of bounds (x < 0)", async () => {
        const diffValidatorService: DiffValidatorService = initDiffValidatorService();

        return diffValidatorService.validatePoint("game", {x: -1, y: 0})
            .catch((reason: Error) => {
                expect(reason.message).to.equal(InvalidPointError.INVALID_POINT_ERROR_MESSAGE);
            });
    });
    it("should throw if the point is out of bounds (y < 0)", async () => {
        const diffValidatorService: DiffValidatorService = initDiffValidatorService();

        return diffValidatorService.validatePoint("game", {x: 0, y: -1})
            .catch((reason: Error) => {
                expect(reason.message).to.equal(InvalidPointError.INVALID_POINT_ERROR_MESSAGE);
            });
    });
    it("should signal that there is no difference at the specified point", async () => {
        const diffValidatorService: DiffValidatorService = initDiffValidatorService(() => {
            when(mockedSimpleGames.documentCountWithQuery(anything()))
                .thenResolve(0);
        });

        return diffValidatorService.validatePoint("game", {x: 42, y: 42})
            .then((hasDifference: boolean) => expect(hasDifference).to.be.false)
            .catch((error: Error) => fail(error));
    });
    it("should signal that there is a difference at the specified point", async () => {
        const diffValidatorService: DiffValidatorService = initDiffValidatorService(() => {
            when(mockedSimpleGames.documentCountWithQuery(anything()))
                .thenResolve(1);
        });

        return diffValidatorService.validatePoint("game", {x: 0, y: 0})
            .then((validate: boolean) => expect(validate).to.be.true)
            .catch((error: Error) => fail(error));
    });
});
