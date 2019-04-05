import {fail} from "assert";
import {assert, expect} from "chai";
import * as io from "socket.io";
import {Server, Socket} from "socket.io";
import {connect} from "socket.io-client";
import {anything, anyString, instance, mock, reset, spy, verify, when} from "ts-mockito";
import {IMock, Mock} from "typemoq";
import {
    createWebsocketMessage,
    PlayerCountMessage,
    RoomInteractionMessage,
} from "../../../../../common/communication/messages/message";
import {SocketEvent} from "../../../../../common/communication/socket-events";
import {DatabaseError, NonExistentGameError} from "../../../../../common/errors/database.errors";
import {GameRoomCreationError, NonExistentRoomError, NoDifferenceAtPointError} from "../../../../../common/errors/services.errors";
import {IFreeGame} from "../../../../../common/model/game/free-game";
import {ISimpleGame} from "../../../../../common/model/game/simple-game";
import {ORIGIN} from "../../../../../common/model/point";
import {ISimpleGameInteractionData, ISimpleGameInteractionResponse} from "../../../../../common/model/rooms/interaction";
import {IRoomInfo} from "../../../../../common/model/rooms/room-info";
import {IGameRoom} from "../../../model/room/game-room";
import {DataBaseService} from "../../data-base.service";
import {FreeGamesCollectionService} from "../../db/free-games.collection.service";
import {SimpleGamesCollectionService} from "../../db/simple-games.collection.service";
import {RadioTowerService} from "../radio-tower.service";
import {HotelRoomService} from "./hotel-room.service";
import {SimpleGameRoom} from "./simple-game-room";

describe("A service to manage game rooms", () => {

    type Callback = () => void;
    const EQUAL_RATIO: number = 0.5;
    const PITBULL_NUMBER: number = 30569; // MR 305 😏
    const SOCKET_URL: string = `http://localhost:${PITBULL_NUMBER}`;

    let server: Server;
    let serverSocket: Socket;
    let socketClient: SocketIOClient.Socket;

    let simpleGamesCollectionService: SimpleGamesCollectionService;
    let mockedDatabaseService: DataBaseService;
    let freeGamesCollectionService: FreeGamesCollectionService;
    let radioTowerService: RadioTowerService;

    const initHotelRoomService:
        (mockConfigurator?: Callback) => HotelRoomService =
        (mockConfigurator?: Callback) => {
            mockedDatabaseService = mock(DataBaseService);
            simpleGamesCollectionService = mock(SimpleGamesCollectionService);
            freeGamesCollectionService = mock(FreeGamesCollectionService);
            radioTowerService = mock(RadioTowerService);

            if (mockConfigurator !== undefined) {
                mockConfigurator();
            }

            when(mockedDatabaseService.simpleGames)
                .thenReturn(instance(simpleGamesCollectionService));
            when(mockedDatabaseService.freeGames)
                .thenReturn(instance(freeGamesCollectionService));

            return new HotelRoomService(instance(mockedDatabaseService), instance(radioTowerService));
        };

    const createSimpleGameMock:
        (gameName: string) => ISimpleGame =
        (gameName: string) => {
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

    const createFreeGameMock:
        (gameName: string) => IFreeGame =
        (gameName: string) => {
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

    const createRoomMock:
        (gameName: string, vacant: boolean) => IMock<IGameRoom> =
        (gameName: string, vacant: boolean) => {
            const mockedRoom: IMock<IGameRoom> = Mock.ofType<IGameRoom>();

            mockedRoom.setup((room: IGameRoom) => room.id)
                .returns(() => gameName);

            mockedRoom.setup((room: IGameRoom) => room.gameName)
                .returns(() => gameName);

            mockedRoom.setup((room: IGameRoom) => room.vacant)
                .returns(() => vacant);

            return mockedRoom;
        };

    const createRandomRooms:
        (roomCount: number, vacantRatio: number) => IGameRoom[] =
        (roomCount: number, vacantRatio: number) => {
            const rooms: IGameRoom[] = [];

            for (let i: number = 0; i < roomCount; i++) {
                rooms.push(
                    createRoomMock(
                        `Mr. ${PITBULL_NUMBER + i} Dale!`,
                        Math.random() <= vacantRatio,
                    ).object,
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

    const createGameRoom:
        (hotelRoomService: HotelRoomService, gameName: string, gameType?: PlayerCountMessage) => Promise<IGameRoom> =
        (hotelRoomService: HotelRoomService, gameName: string, gameType: PlayerCountMessage = PlayerCountMessage.SOLO) => {
            const hotelRoomServiceSpy: HotelRoomService = spy(hotelRoomService);

            // TODO check room assert.isNotEmpty(serverSocket.rooms);
            return new Promise((resolve: (gameRoom: IGameRoom) => void) => {
                hotelRoomService.createGameRoom(serverSocket, gameName, gameType)
                    .then(() => {
                        const createdRoom: IGameRoom | undefined = Array.from(hotelRoomService["_rooms"].values())
                            .find((room: IGameRoom) => room.gameName === gameName);
                        assert.exists(createdRoom);
                        assertCheckin(hotelRoomService, hotelRoomServiceSpy);
                        resolve(createdRoom as IGameRoom);
                    });
            });
        };

    const assertCheckin:
        (hotelRoomService: HotelRoomService, hotelRoomServiceSpy: HotelRoomService) => void =
        (hotelRoomService: HotelRoomService, hotelRoomServiceSpy: HotelRoomService) => {
            expect(Array.from(hotelRoomService["_sockets"].keys()))
                .to.contain(serverSocket);
            verify(hotelRoomServiceSpy["registerGameRoomHandlers"](serverSocket, anything())).once();
            verify(hotelRoomServiceSpy["pushRoomsToClients"]()).once();
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

            hotelRoomService.createGameRoom(serverSocket, "You can't catch meh boy", PlayerCountMessage.SOLO)
                .then(() => fail())
                .catch((error: NonExistentGameError) => {
                    expect(error.message)
                        .to.eq(NonExistentGameError.NON_EXISTENT_GAME_ERROR_MESSAGE);
                    done();
                });
            serverSocket.emit(SocketEvent.CREATE);
        });

        it("should create a simpleGameRoom and check in the client", async () => {
            const gameName: string = "Motel";
            const hotelRoomService: HotelRoomService = initHotelRoomService(() => {
                when(simpleGamesCollectionService.contains(gameName))
                    .thenResolve(true);
                when(simpleGamesCollectionService.getFromId(gameName))
                    .thenResolve(createSimpleGameMock(gameName));
                when(freeGamesCollectionService.contains(gameName))
                    .thenResolve(false);
            });

            return createGameRoom(hotelRoomService, gameName);
        });

        it("should create a freeGameRoom and check in the client", async () => {
            const gameName: string = "Holiday Inn";
            const hotelRoomService: HotelRoomService = initHotelRoomService(() => {
                when(simpleGamesCollectionService.contains(gameName))
                    .thenResolve(false);
                when(freeGamesCollectionService.contains(gameName))
                    .thenResolve(true);
                when(freeGamesCollectionService.getFromId(gameName))
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

            hotelRoomService.createGameRoom(serverSocket, gameName, PlayerCountMessage.SOLO)
                .then(() => fail())
                .catch((error: GameRoomCreationError) => {
                    expect(error.message)
                        .to.eq(GameRoomCreationError.GAME_ROOM_CREATION_ERROR_MESSAGE);
                    done();
                });
        });
    });

    describe("Room check in", () => {
        it("should throw an NonExistentRoomError when no room are available for a game", () => {
            const gameName: string = "Mr. Worldwide to infinity!";
            const hotelRoomService: HotelRoomService = initHotelRoomService();
            expect(() => hotelRoomService.checkInGameRoom(serverSocket, gameName))
                .to.throw(NonExistentRoomError);
        });

        it("should check in the client in an empty room", () => {
            const gameName: string = "Give me everything tonight!!";
            const hotelRoomService: HotelRoomService = initHotelRoomService();
            hotelRoomService["_rooms"].set("roomId", createRoomMock(gameName, true).object);
            const hotelRoomServiceSpy: HotelRoomService = spy(hotelRoomService);

            expect(() => hotelRoomService.checkInGameRoom(serverSocket, gameName))
                .not.to.throw(NonExistentRoomError);
            assertCheckin(hotelRoomService, hotelRoomServiceSpy);
        });
    });

    describe("Socket event handlers", () => {
        describe("Socket ready handler", () => {
            it("should notify the room on client ready", (done: Callback) => {
                const gameName: string = "It's going down, I'm yelling timber!";
                const hotelRoomService: HotelRoomService = initHotelRoomService();
                const simpleGameRoom: SimpleGameRoom = new SimpleGameRoom("room", createSimpleGameMock(gameName));
                const roomSpy: SimpleGameRoom = spy(simpleGameRoom);

                hotelRoomService["registerGameRoomHandlers"](serverSocket, simpleGameRoom);
                serverSocket.join(simpleGameRoom.id);

                socketClient.emit(SocketEvent.READY);
                when(roomSpy.handleReady(serverSocket.id))
                    .thenCall(() => done());
            });

            it.skip("should notify the (socket) room on (game) room ready", (done: Callback) => {
                const gameName: string = "It's going down, I'm yelling timber!";
                const hotelRoomService: HotelRoomService = initHotelRoomService();
                const simpleGameRoom: SimpleGameRoom = new SimpleGameRoom("room", createSimpleGameMock(gameName));

                hotelRoomService["registerGameRoomHandlers"](serverSocket, simpleGameRoom);
                simpleGameRoom["_onReady"]();
                fail();
            });
        });

        describe("Socket leave/disconnect handlers", () => {
            it("should delete the game room on checkout", (done: Callback) => {
                const gameName: string = "Let it rain over me";
                const roomId: string = "room";
                const hotelRoomService: HotelRoomService = initHotelRoomService();
                const serviceSpy: HotelRoomService = spy(hotelRoomService);
                const simpleGameRoom: SimpleGameRoom = new SimpleGameRoom(roomId, createSimpleGameMock(gameName));
                const roomSpy: SimpleGameRoom = spy(simpleGameRoom);

                hotelRoomService["registerGameRoomHandlers"](serverSocket, simpleGameRoom);

                when(serviceSpy["pushRoomsToClients"]())
                    .thenCall(() => {
                        verify(roomSpy.checkOut(serverSocket.id)).once();
                        verify(serviceSpy["deleteRoom"](simpleGameRoom)).once();
                        reset(serviceSpy);
                        done();
                    });

                socketClient.emit(SocketEvent.CHECK_OUT);
            });

            it("should delete the game room on disconnect", (done: Callback) => {
                const gameName: string = "Let it rain over me";
                const hotelRoomService: HotelRoomService = initHotelRoomService();
                const serviceSpy: HotelRoomService = spy(hotelRoomService);
                const simpleGameRoom: SimpleGameRoom = new SimpleGameRoom("room", createSimpleGameMock(gameName));
                const roomSpy: SimpleGameRoom = spy(simpleGameRoom);

                hotelRoomService["registerGameRoomHandlers"](serverSocket, simpleGameRoom);

                when(serviceSpy["pushRoomsToClients"]())
                    .thenCall(() => {
                        verify(roomSpy.checkOut(serverSocket.id)).once();
                        verify(serviceSpy["deleteRoom"](simpleGameRoom)).once();
                        done();
                    });

                socketClient.close();
            });

            it("should delete and kick multi game room on disconnect", (done: Callback) => {
                const gameName: string = "Let it rain over me";
                const roomId: string = "room";
                const hotelRoomService: HotelRoomService = initHotelRoomService();
                const serviceSpy: HotelRoomService = spy(hotelRoomService);
                const simpleGameRoom: SimpleGameRoom = new SimpleGameRoom(roomId, createSimpleGameMock(gameName), 2);
                simpleGameRoom["_ongoing"] = true;
                const roomSpy: SimpleGameRoom = spy(simpleGameRoom);

                hotelRoomService["checkInClient"](serverSocket, simpleGameRoom);
                hotelRoomService["registerGameRoomHandlers"](serverSocket, simpleGameRoom);

                when(serviceSpy["pushRoomsToClients"]())
                    .thenCall(() => {
                        verify(roomSpy.checkOut(serverSocket.id)).once();
                        verify(serviceSpy["kickClients"](simpleGameRoom.id)).once();
                        verify(serviceSpy["deleteRoom"](simpleGameRoom)).once();
                        reset(serviceSpy);
                        done();
                    });

                socketClient.close();
            });
        });

        describe("Socket interact handler", () => {
            it("should send interaction response to room", (done: Callback) => {
                const gameName: string = "It's Mr. 305 checkin' in for the remix";
                const interactionData: ISimpleGameInteractionData = {coord: ORIGIN};
                const interactionMessage: RoomInteractionMessage<ISimpleGameInteractionData> = {
                    gameName: gameName,
                    interactionData: interactionData,
                };
                const interactionResponse: ISimpleGameInteractionResponse = {differenceCluster: [0, [ORIGIN]]};
                const roomMock: IMock<IGameRoom> = createRoomMock(gameName, true);
                roomMock.setup((room: IGameRoom) => room.interact(serverSocket.id, interactionData))
                    .returns(() => Promise.resolve(interactionResponse));
                const hotelRoomService: HotelRoomService = initHotelRoomService(() => {
                    when(radioTowerService.sendToRoom(SocketEvent.INTERACT, interactionResponse, roomMock.object.id))
                        .thenCall(() => done());
                });

                hotelRoomService["checkInClient"](serverSocket, roomMock.object);
                socketClient.emit(SocketEvent.INTERACT, createWebsocketMessage(interactionMessage));
            });

            it.skip("should emit an interaction error to client", (done: Callback) => {
                const gameName: string = "It's Mr. 305 checkin' in for the remix";
                const interactionData: ISimpleGameInteractionData = {coord: ORIGIN};
                const interactionMessage: RoomInteractionMessage<ISimpleGameInteractionData> = {
                    gameName: gameName,
                    interactionData: interactionData,
                };
                const roomMock: IMock<IGameRoom> = createRoomMock(gameName, true);
                roomMock.setup((room: IGameRoom) => room.interact(serverSocket.id, interactionData))
                    .returns(() => Promise.reject(new NoDifferenceAtPointError()));
                const hotelRoomService: HotelRoomService = initHotelRoomService();
                hotelRoomService["checkInClient"](serverSocket, roomMock.object);
                socketClient.once(SocketEvent.INTERACT, () => {
                    done();
                });
                socketClient.emit(SocketEvent.INTERACT, createWebsocketMessage(interactionMessage));

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
