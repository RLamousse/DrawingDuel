import {fail} from "assert";
import {assert, expect} from "chai";
import * as io from "socket.io";
import {Server, Socket} from "socket.io";
import {connect} from "socket.io-client";
import {anyString, capture, instance, mock, spy, when} from "ts-mockito";
import {IMock, Mock} from "typemoq";
import {createWebsocketMessage, PlayerCountMessage, WebsocketMessage} from "../../../../../common/communication/messages/message";
import {SocketEvent} from "../../../../../common/communication/socket-events";
import {DatabaseError, NonExistentGameError} from "../../../../../common/errors/database.errors";
import {GameRoomCreationError, NonExistentRoomError} from "../../../../../common/errors/services.errors";
import {IRoomInfo} from "../../../../../common/model/rooms/room-info";
import {IGameRoom} from "../../../model/room/game-room";
import {DataBaseService} from "../../data-base.service";
import {FreeGamesCollectionService} from "../../db/free-games.collection.service";
import {SimpleGamesCollectionService} from "../../db/simple-games.collection.service";
import {HotelRoomService} from "./hotel-room.service";

describe("A service to manage game rooms", () => {

    type Callback = () => void;
    const EQUAL_RATIO: number = 0.5;
    const PITBULL_NUMBER: number = 305;
    const SOCKET_URL: string = `http://localhost:${PITBULL_NUMBER}`;

    let server: Server;
    let serverSocket: Socket;
    let socketClient: SocketIOClient.Socket;

    let simpleGamesCollectionService: SimpleGamesCollectionService;
    let mockedDatabaseService: DataBaseService;
    let freeGamesCollectionService: FreeGamesCollectionService;

    const initHotelRoomService:
        (mockConfigurator?: Callback) => HotelRoomService =
        (mockConfigurator?: Callback) => {
            mockedDatabaseService = mock(DataBaseService);
            simpleGamesCollectionService = mock(SimpleGamesCollectionService);
            freeGamesCollectionService = mock(FreeGamesCollectionService);

            if (mockConfigurator !== undefined) {
                mockConfigurator();
            }

            when(mockedDatabaseService.simpleGames)
                .thenReturn(instance(simpleGamesCollectionService));
            when(mockedDatabaseService.freeGames)
                .thenReturn(instance(freeGamesCollectionService));

            return new HotelRoomService(instance(mockedDatabaseService));
        };

    const createSimpleGameMock = (gameName: string) => {
        return {
            diffData: [],
            gameName: gameName,
            bestMultiTimes: [],
            bestSoloTimes: [],
            modifiedImage: "",
            originalImage: "",
            toBeDeleted: false,
        };
    };

    const createFreeGameMock = (gameName: string) => {
        return {
            gameName: gameName,
            bestMultiTimes: [],
            bestSoloTimes: [],
            toBeDeleted: false,
            scenes: {
                differentObjects: [],
                modifiedObjects: [],
                originalObjects: [],
            },
        };
    };

    const createRoom:
        (gameName: string, vacant: boolean) => IGameRoom =
        (gameName: string, vacant: boolean) => {
            const mockedRoom: IMock<IGameRoom> = Mock.ofType<IGameRoom>();

            mockedRoom.setup((room: IGameRoom) => room.gameName)
                .returns(() => gameName);

            mockedRoom.setup((room: IGameRoom) => room.vacant)
                .returns(() => vacant);

            return mockedRoom.object;
        };

    const createRandomRooms:
        (roomCount: number, vacantRatio: number) => IGameRoom[] =
        (roomCount: number, vacantRatio: number) => {
            const rooms: IGameRoom[] = [];

            for (let i: number = 0; i < roomCount; i++) {
                rooms.push(
                    createRoom(
                        `Mr. ${PITBULL_NUMBER + i} Dale!`,
                        Math.random() <= vacantRatio,
                    ),
                );
            }

            return rooms;
    };

    const getFromMapSafe:
        <T, U>(map: Map<T, U>, key: T) => U =
        <T, U>(map: Map<T, U>, key: T) => {
            const value: U | undefined = map.get(key);
            assert(value !== undefined);

            return value as U;
        };

    const testSocketCall:
        <T>(socketEvent: SocketEvent, testSuite: () => void, message?: WebsocketMessage<T>) => void =
        <T>(socketEvent: SocketEvent, testSuite: () => void, message?: WebsocketMessage<T>) => {
            serverSocket.on(socketEvent, testSuite);
            socketClient.emit(socketEvent, message);
        };

    const createGameRoom:
        (hotelRoomService: HotelRoomService, gameName: string) => Promise<IGameRoom> =
        (hotelRoomService: HotelRoomService, gameName: string) => {
            const hotelRoomServiceSpy: HotelRoomService = spy(hotelRoomService);

            // TODO check room assert.isNotEmpty(serverSocket.rooms);
            return new Promise((resolve: (gameRoom: IGameRoom) => void) => {
                testSocketCall(
                    SocketEvent.CREATE,
                    () => {
                        hotelRoomService.createGameRoom(serverSocket, gameName, PlayerCountMessage.SOLO)
                            .then(() => {
                                const createdRoom: IGameRoom | undefined = Array.from(hotelRoomService["_rooms"].values())
                                    .find((room: IGameRoom) => room.gameName === gameName);
                                assert.exists(createdRoom);
                                assertCheckin(hotelRoomService, hotelRoomServiceSpy);
                                resolve(createdRoom as IGameRoom);
                            });
                    },
                    createWebsocketMessage(PlayerCountMessage.SOLO),
                );
            });
        };

    const assertCheckin:
        (hotelRoomService: HotelRoomService, hotelRoomServiceSpy: HotelRoomService) => void =
        (hotelRoomService: HotelRoomService, hotelRoomServiceSpy: HotelRoomService) => {
            expect(Array.from(hotelRoomService["_sockets"].keys()))
                .to.contain(serverSocket);
            assert.isNotEmpty(capture(hotelRoomServiceSpy["registerGameRoomHandlers"]).first());
            assert.isNotEmpty(capture(hotelRoomServiceSpy["pushRoomsToClients"]).first());
        };

    beforeEach(() => {
        server = io(PITBULL_NUMBER);
        server.on("connect", (socket: Socket) => serverSocket = socket);
    });

    beforeEach((done: Callback) => {
        socketClient = connect(SOCKET_URL);
        socketClient.on("connect", () => done());
    });

    describe("Room fetch", () => {
        it("should return an empty response when there is no rooms", () => {
            const hotelRoomService: HotelRoomService = initHotelRoomService();

            return expect(hotelRoomService.fetchGameRooms()).to.be.empty;
        });

        it("should return every room on fetch", () => {
            const hotelRoomService: HotelRoomService = initHotelRoomService();
            const roomCount: number = Math.floor(Math.random() * 10) + 1;
            const roomData: Map<string, IGameRoom> = new Map<string, IGameRoom>();

            createRandomRooms(roomCount, EQUAL_RATIO)
                .forEach((gameRoom: IGameRoom) => roomData.set(gameRoom.gameName, gameRoom));

            // @ts-ignore Mock certain properties of object
            hotelRoomService["_rooms"] = roomData;

            hotelRoomService.fetchGameRooms()
                .forEach((roomInfo: IRoomInfo) => {
                    const vacant: boolean = getFromMapSafe(roomData, roomInfo.gameName).vacant;
                    expect(vacant).to.be.eql(roomInfo.vacant);
                });
        });
    });

    describe("Game room creation", () => {
        it("should throw an NonExistentGameError when the specified game doesn't exist", (done: Callback) => {
            const hotelRoomService: HotelRoomService = initHotelRoomService(() => {
                when(simpleGamesCollectionService.contains(anyString()))
                    .thenResolve(false);
                when(freeGamesCollectionService.contains(anyString()))
                    .thenResolve(false);
            });

            testSocketCall(SocketEvent.CREATE, () => {
                hotelRoomService.createGameRoom(serverSocket, "You can't catch meh boy", PlayerCountMessage.SOLO)
                    .then(() => fail())
                    .catch((error: NonExistentGameError) => {
                        expect(error.message)
                            .to.eq(NonExistentGameError.NON_EXISTENT_GAME_ERROR_MESSAGE);
                        done();
                    });
            });
        });

        it("should create a simpleGameRoom and check in the client", async () => {
            const gameName: string = "Motel";
            const hotelRoomService: HotelRoomService = initHotelRoomService(() => {
                when(simpleGamesCollectionService.contains(gameName))
                    .thenResolve(true);
                when(simpleGamesCollectionService.getFromId(anyString()))
                    .thenResolve(createSimpleGameMock(gameName));
                when(freeGamesCollectionService.contains(anyString()))
                    .thenResolve(false);
            });

            return createGameRoom(hotelRoomService, gameName);
        });

        it("should create a freeGameRoom and check in the client", async () => {
            const gameName: string = "Holiday Inn";
            const hotelRoomService: HotelRoomService = initHotelRoomService(() => {
                when(simpleGamesCollectionService.contains(gameName))
                    .thenResolve(false);
                when(freeGamesCollectionService.contains(anyString()))
                    .thenResolve(true);
                when(freeGamesCollectionService.getFromId(anyString()))
                    .thenResolve(createFreeGameMock(gameName));
            });

            return createGameRoom(hotelRoomService, gameName);
        });

        it("should reject with a GameRoomCreationError on DB error", (done) => {
            const gameName: string = "This DB is a... fireball🎺🎺🎺";
            const hotelRoomService: HotelRoomService = initHotelRoomService(() => {
                when(simpleGamesCollectionService.contains(gameName))
                    .thenThrow(new DatabaseError());
            });

            testSocketCall(SocketEvent.CREATE, () => {
                hotelRoomService.createGameRoom(serverSocket, gameName, PlayerCountMessage.SOLO)
                    .then(() => fail())
                    .catch((error: GameRoomCreationError) => {
                        expect(error.message)
                            .to.eq(GameRoomCreationError.GAME_ROOM_CREATION_ERROR_MESSAGE);
                        done();
                    });
            });
        });
    });

    describe("Room check in", () => {
        it("should throw an NonExistentRoomError when no room are available for a game", (done: Callback) => {
            const gameName: string = "Mr. Worldwide to infinity!";
            const hotelRoomService: HotelRoomService = initHotelRoomService();
            testSocketCall(SocketEvent.CHECK_IN, () => {
                expect(() => hotelRoomService.checkInGameRoom(serverSocket, gameName))
                    .to.throw(NonExistentRoomError);
                done();
            });
        });

        it("should check in the client", (done: Callback) => {
            const gameName: string = "Give me everything tonight!!";
            const hotelRoomService: HotelRoomService = initHotelRoomService();
            hotelRoomService["_rooms"].set("roomId", createRoom(gameName, true));
            const hotelRoomServiceSpy: HotelRoomService = spy(hotelRoomService);

            testSocketCall(
                SocketEvent.CHECK_IN,
                () => {
                    expect(() => hotelRoomService.checkInGameRoom(serverSocket, gameName))
                        .not.to.throw(NonExistentRoomError);
                    assertCheckin(hotelRoomService, hotelRoomServiceSpy);
                    done();
                });
        });
    });

    afterEach(() => {
        if (socketClient.connected) {
            socketClient.close();
        }
        server.close();
    });
});
