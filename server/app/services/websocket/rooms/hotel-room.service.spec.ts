import {fail} from "assert";
import {assert, expect} from "chai";
import * as io from "socket.io";
import {Server, Socket} from "socket.io";
import {connect} from "socket.io-client";
import {anyString, instance, mock, when} from "ts-mockito";
import {IMock, Mock} from "typemoq";
import {PlayerCountMessage, WebsocketMessage} from "../../../../../common/communication/messages/message";
import {SocketEvent} from "../../../../../common/communication/socket-events";
import {NonExistentGameError} from "../../../../../common/errors/database.errors";
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

    const initHotelRoomService =
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

    const createRandomRooms = (roomCount: number, vacantRation: number) => {
        const rooms: IGameRoom[] = [];

        for (let i: number = 0; i < roomCount; i++) {
            const mockedRoom: IMock<IGameRoom> = Mock.ofType<IGameRoom>();

            mockedRoom.setup((room: IGameRoom) => room.gameName)
                .returns(() => `Mr. ${PITBULL_NUMBER + i} Dale!`);

            const isVacant: boolean = Math.random() <= vacantRation;
            mockedRoom.setup((room: IGameRoom) => room.vacant)
                .returns(() => isVacant);

            rooms.push(mockedRoom.object);
        }

        return rooms;
    };

    const getFromMapSafe: <T, U>(map: Map<T, U>, key: T) => U =
        <T, U>(map: Map<T, U>, key: T) => {
            const value: U | undefined = map.get(key);
            assert(value !== undefined);

            return value as U;
        };

    const testSocketCall =
        <T>(socketEvent: SocketEvent, testSuite: (socket: Socket) => void, message?: WebsocketMessage<T>) => {
            serverSocket.on(socketEvent, testSuite);
            socketClient.emit(socketEvent, message);
        };

    beforeEach(() => {
        server = io(PITBULL_NUMBER);
        server.on("connect", (socket: Socket) => serverSocket = socket);
    });

    beforeEach((done: Callback) => {
        socketClient = connect(SOCKET_URL, {
            reconnectionDelay: 0,
            forceNew: true,
        });
        socketClient.on("connect", () => done());
    });

    describe("Room fetch", () => {
        it("should return an empty response when there is no rooms", () => {
            const hotelRoomService = initHotelRoomService();

            return expect(hotelRoomService.fetchGameRooms()).to.be.empty;
        });

        it("should return every room on fetch", () => {
            const hotelRoomService = initHotelRoomService();
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

            testSocketCall(SocketEvent.CREATE, (socket: Socket) => {
                hotelRoomService.createGameRoom(socket, "You can't catch meh boy", PlayerCountMessage.SOLO)
                    .then(() => fail())
                    .catch((error: NonExistentGameError) => {
                        expect(error.message)
                            .to.eq(NonExistentGameError.NON_EXISTENT_GAME_ERROR_MESSAGE);
                        done();
                    });
            });
        });
    });

    afterEach(() => {
        socketClient.close();
        server.close();
    });
});
