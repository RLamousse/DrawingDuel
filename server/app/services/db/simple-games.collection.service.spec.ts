import {fail} from "assert";
import {expect} from "chai";
import {Collection, FilterQuery} from "mongodb";
import * as TypeMoq from "typemoq";
// tslint:disable-next-line:no-duplicate-imports Weird interaction between singletons and interface (olivier st-o approved)
import {IMock} from "typemoq";
import {Message} from "../../../../common/communication/messages/message";
import {AlreadyExistentGameError, InvalidGameError} from "../../../../common/errors/database.errors";
import {ISimpleGame} from "../../../../common/model/game/simple-game";
import {GAME_NAME_FIELD, SimpleGamesCollectionService} from "./simple-games.collection.service";

describe("A db service for simple games", () => {

    const sampleGame: ISimpleGame = {
        diffData: [],
        bestMultiTimes: [],
        bestSoloTimes: [],
        originalImage: "originalImage",
        modifiedImage: "modifiedImage",
        gameName: "sampleGame",
    };

    let simpleGamesCollectionService: SimpleGamesCollectionService;
    let mockedCollection: IMock<Collection<ISimpleGame>>;

    const createGameQueryForId: (id: string) => FilterQuery<ISimpleGame> =
        (id: string): FilterQuery<ISimpleGame> => ({[GAME_NAME_FIELD]: {$eq: id}});

    beforeEach(() => {
        mockedCollection = TypeMoq.Mock.ofType<Collection<ISimpleGame>>();
    });

    describe("Game creation", () => {

        it("should not create an invalid game", () => {
            const invalidGame: ISimpleGame = {
                diffData: [],
                bestMultiTimes: [],
                bestSoloTimes: [],
                originalImage: "",
                modifiedImage: "",
                gameName: "",
            };

            simpleGamesCollectionService = new SimpleGamesCollectionService(mockedCollection.object);

            return simpleGamesCollectionService.create(invalidGame)
                .catch((invalidGameError: InvalidGameError) => {
                    expect(invalidGameError.message)
                        .to.eql(InvalidGameError.GAME_FORMAT_ERROR_MESSAGE);
                });
        });

        it("should not create a game that already exists", () => {
            const query: FilterQuery<ISimpleGame> = createGameQueryForId("sampleGame");
            mockedCollection.setup((collection: Collection<ISimpleGame>) => collection.countDocuments(query))
                .returns(() => Promise.resolve(1));

            simpleGamesCollectionService = new SimpleGamesCollectionService(mockedCollection.object);

            return simpleGamesCollectionService.create(sampleGame)
                .catch((alreadyExistentGameError: AlreadyExistentGameError) => {
                    expect(alreadyExistentGameError.message)
                        .to.eql(AlreadyExistentGameError.ALREADY_EXISTENT_GAME_ERROR_MESSAGE);
                });
        });

        it("should create a game", () => {
            const query: FilterQuery<ISimpleGame> = createGameQueryForId("sampleGame");
            mockedCollection.setup((collection: Collection<ISimpleGame>) => collection.countDocuments(query))
                .returns(() => Promise.resolve(0));

            mockedCollection.setup((collection: Collection<ISimpleGame>) => collection.insertOne(sampleGame))
            // @ts-ignore Spoof InsertOneWriteOpResult for DB insert promise
                .returns(() => Promise.resolve({}));

            simpleGamesCollectionService = new SimpleGamesCollectionService(mockedCollection.object);

            return simpleGamesCollectionService.create(sampleGame)
                .then((message: Message) => {
                    expect(message)
                        .to.eql(simpleGamesCollectionService["creationSuccessMessage"](sampleGame));
                });
        });
    });

    describe("Game deletion", () => {
        it("should throw if a game ID is empty on deletion", () => {
            fail();
        });

        it("should throw if the specified game does not exist on deletion", () => {
            fail();
        });

        it("should delete a game", () => {
            fail();
        });
    });

    describe("Game retrieval (get)", () => {
        it("should throw if a game ID is empty on get", () => {
            fail();
        });

        it("should get a game from an ID", () => {
            fail();
        });
    });
});
