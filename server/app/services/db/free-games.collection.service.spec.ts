import {expect} from "chai";
import {Collection, FilterQuery, UpdateQuery} from "mongodb";
import * as TypeMoq from "typemoq";
// tslint:disable-next-line:no-duplicate-imports Weird interaction between singletons and interface (olivier st-o approved)
import {IMock} from "typemoq";
import {Message} from "../../../../common/communication/messages/message";
import {
    AlreadyExistentGameError,
    DatabaseError,
    EmptyIdError,
    InvalidGameError, InvalidGameInfoError,
    NonExistentGameError
} from "../../../../common/errors/database.errors";
import {IFreeGame} from "../../../../common/model/game/free-game";
import {FreeGamesCollectionService} from "./free-games.collection.service";
import {GAME_NAME_FIELD} from "./simple-games.collection.service";

describe("A db service for free games", () => {

    const sampleGame: IFreeGame = {
        scenes: {
            originalObjects: [],
            modifiedObjects: [],
        },
        bestMultiTimes: [],
        bestSoloTimes: [],
        gameName: "sampleGame",
        toBeDeleted: false,
    };

    let freeGamesCollectionService: FreeGamesCollectionService;
    let mockedCollection: IMock<Collection<IFreeGame>>;

    const createGameQueryForId: (id: string) => FilterQuery<IFreeGame> =
        (id: string): FilterQuery<IFreeGame> => ({[GAME_NAME_FIELD]: {$eq: id}});

    const createGameQueryForUpdate: (data: Partial<IFreeGame>) => UpdateQuery<IFreeGame> =
        (data: Partial<IFreeGame>): UpdateQuery<IFreeGame> => ({$set: data});

    beforeEach(() => {
        mockedCollection = TypeMoq.Mock.ofType<Collection<IFreeGame>>();
    });

    describe("Game creation", () => {

        it("should not create an invalid game", async () => {
            const invalidGame: IFreeGame = {
                scenes: {
                    originalObjects: [],
                    modifiedObjects: [],
                },
                bestMultiTimes: [],
                bestSoloTimes: [],
                gameName: "",
                toBeDeleted: false,
            };

            freeGamesCollectionService = new FreeGamesCollectionService(mockedCollection.object);

            return freeGamesCollectionService.create(invalidGame)
                .catch((invalidGameError: InvalidGameError) => {
                    expect(invalidGameError.message)
                        .to.eql(InvalidGameError.GAME_FORMAT_ERROR_MESSAGE);
                });
        });

        it("should not create a game that already exists", async () => {
            const query: FilterQuery<IFreeGame> = createGameQueryForId("sampleGame");
            mockedCollection.setup(async (collection: Collection<IFreeGame>) => collection.countDocuments(query))
                .returns(async () => Promise.resolve(1));

            freeGamesCollectionService = new FreeGamesCollectionService(mockedCollection.object);

            return freeGamesCollectionService.create(sampleGame)
                .catch((alreadyExistentGameError: AlreadyExistentGameError) => {
                    expect(alreadyExistentGameError.message)
                        .to.eql(AlreadyExistentGameError.ALREADY_EXISTENT_GAME_ERROR_MESSAGE);
                });
        });

        it("should create a game", async () => {
            const query: FilterQuery<IFreeGame> = createGameQueryForId("sampleGame");
            mockedCollection.setup(async (collection: Collection<IFreeGame>) => collection.countDocuments(query))
                .returns(async () => Promise.resolve(0));

            mockedCollection.setup(async (collection: Collection<IFreeGame>) => collection.insertOne(sampleGame))
            // @ts-ignore Spoof InsertOneWriteOpResult for DB insert promise
                .returns(async () => Promise.resolve({}));

            freeGamesCollectionService = new FreeGamesCollectionService(mockedCollection.object);

            return freeGamesCollectionService.create(sampleGame)
                .then((message: Message) => {
                    expect(message)
                        .to.eql(freeGamesCollectionService["creationSuccessMessage"](sampleGame));
                });
        });
    });

    describe("Game update", () => {

        it("should not update an invalid game", async () => {
            const invalidGame: Partial<IFreeGame> = {
            };

            freeGamesCollectionService = new FreeGamesCollectionService(mockedCollection.object);

            return freeGamesCollectionService.update("invalidGame", invalidGame)
                .catch((invalidGameInfoError: InvalidGameInfoError) => {
                    expect(invalidGameInfoError.message)
                        .to.eql(InvalidGameInfoError.GAME_INFO_FORMAT_ERROR_MESSAGE);
                });
        });

        it("should not update a game that does not exist", async () => {

            const partialGame: Partial<IFreeGame> = {
                scenes: {
                    originalObjects: [],
                    modifiedObjects: [],
                },
                bestMultiTimes: [],
                bestSoloTimes: [],
            };

            const query: FilterQuery<IFreeGame> = createGameQueryForId("sampleGame");
            mockedCollection.setup(async (collection: Collection<IFreeGame>) => collection.countDocuments(query))
                .returns(async () => Promise.resolve(0));

            freeGamesCollectionService = new FreeGamesCollectionService(mockedCollection.object);

            return freeGamesCollectionService.update("sampleGame", partialGame)
                .catch((nonExistentGameError: NonExistentGameError) => {
                    expect(nonExistentGameError.message)
                        .to.eql(NonExistentGameError.NON_EXISTENT_GAME_ERROR_MESSAGE);
                });
        });

        it("should update a game", async () => {

            const partialGame: Partial<IFreeGame> = {
                scenes: {
                    originalObjects: [],
                    modifiedObjects: [],
                },
                bestMultiTimes: [],
                bestSoloTimes: [],
            };

            const query: FilterQuery<IFreeGame> = createGameQueryForId("sampleGame");
            const updateQuery: UpdateQuery<IFreeGame> = createGameQueryForUpdate(partialGame);
            mockedCollection.setup(async (collection: Collection<IFreeGame>) => collection.countDocuments(query))
                .returns(async () => Promise.resolve(1));

            mockedCollection.setup(async (collection: Collection<IFreeGame>) => collection.updateOne(query, updateQuery))
            // @ts-ignore Spoof InsertOneWriteOpResult for DB insert promise
                .returns(async () => Promise.resolve({}));

            freeGamesCollectionService = new FreeGamesCollectionService(mockedCollection.object);

            return freeGamesCollectionService.update("sampleGame", partialGame)
                .then((message: Message) => {
                    expect(message)
                        .to.eql(freeGamesCollectionService["updateSuccessMessage"]("sampleGame"));
                });
        });
    });

    describe("Game deletion", () => {
        it("should throw if a game ID is empty on deletion", async () => {
            freeGamesCollectionService = new FreeGamesCollectionService(mockedCollection.object);

            return freeGamesCollectionService.delete("")
                .catch((emptyIdError: EmptyIdError) => {
                    expect(emptyIdError.message)
                        .to.eql(EmptyIdError.EMPTY_ID_ERROR_MESSAGE);
                });
        });

        it("should throw if the specified game does not exist on deletion", async () => {
            const query: FilterQuery<IFreeGame> = createGameQueryForId("unavailableGame");
            mockedCollection.setup(async (collection: Collection<IFreeGame>) => collection.countDocuments(query))
                .returns(async () => Promise.resolve(0));

            freeGamesCollectionService = new FreeGamesCollectionService(mockedCollection.object);

            return freeGamesCollectionService.delete("unavailableGame")
                .catch((nonExistentGameError: NonExistentGameError) => {
                    expect(nonExistentGameError.message)
                        .to.eql(NonExistentGameError.NON_EXISTENT_GAME_ERROR_MESSAGE);
                });
        });

        it("should delete a game", async () => {
            const query: FilterQuery<IFreeGame> = createGameQueryForId("gameToDelete");
            mockedCollection.setup(async (collection: Collection<IFreeGame>) => collection.countDocuments(query))
                .returns(async () => Promise.resolve(1));

            mockedCollection.setup(async (collection: Collection<IFreeGame>) => collection.deleteOne(query))
            // @ts-ignore Spoof DeleteWriteOpResultObject for DB insert promise
                .returns(async () => Promise.resolve({}));

            freeGamesCollectionService = new FreeGamesCollectionService(mockedCollection.object);

            return freeGamesCollectionService.delete("gameToDelete")
                .then((message: Message) => {
                    expect(message)
                        .to.eql(freeGamesCollectionService["deletionSuccessMessage"]("gameToDelete"));
                });
        });
    });

    describe("Game retrieval (get)", () => {
        it("should throw if a game ID is empty on get", async () => {
            freeGamesCollectionService = new FreeGamesCollectionService(mockedCollection.object);

            return freeGamesCollectionService.getFromId("")
                .catch((emptyIdError: EmptyIdError) => {
                    expect(emptyIdError.message)
                        .to.eql(EmptyIdError.EMPTY_ID_ERROR_MESSAGE);
                });
        });

        it("should throw an NonExistentGameError when no results where found", async () => {
            const query: FilterQuery<IFreeGame> = createGameQueryForId("unavailableGame");
            mockedCollection.setup(async (collection: Collection<IFreeGame>) => collection.findOne(query))
                .returns(async () => Promise.resolve(null));

            freeGamesCollectionService = new FreeGamesCollectionService(mockedCollection.object);

            return freeGamesCollectionService.getFromId("unavailableGame")
                .catch((nonExistentGameError: NonExistentGameError) => {
                    expect(nonExistentGameError.message)
                        .to.eql(NonExistentGameError.NON_EXISTENT_GAME_ERROR_MESSAGE);
                });
        });

        it("should throw a database error on unexpected behaviour", async () => {
            const query: FilterQuery<IFreeGame> = createGameQueryForId("errorGame");
            mockedCollection.setup(async (collection: Collection<IFreeGame>) => collection.findOne(query))
                .returns(async () => Promise.reject(new Error("Unexpected error")));

            freeGamesCollectionService = new FreeGamesCollectionService(mockedCollection.object);

            return freeGamesCollectionService.getFromId("errorGame")
                .catch((databaseError: DatabaseError) => {
                    expect(databaseError.message)
                        .to.eql(DatabaseError.DATA_BASE_MESSAGE_ERROR);
                });
        });

        it("should get a game from an ID", async () => {
            const query: FilterQuery<IFreeGame> = createGameQueryForId("sampleGame");
            mockedCollection.setup(async (collection: Collection<IFreeGame>) => collection.findOne(query))
                .returns(async () => Promise.resolve(sampleGame));

            freeGamesCollectionService = new FreeGamesCollectionService(mockedCollection.object);

            return freeGamesCollectionService.getFromId("sampleGame")
                .then((game: IFreeGame) => {
                    expect(game).to.eql(sampleGame);
                });
        });
    });
});
