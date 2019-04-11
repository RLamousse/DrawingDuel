import Axios from "axios";
import MockAdapter from "axios-mock-adapter";
// tslint:disable-next-line:no-duplicate-imports Weird interaction between singletons and interface (olivier st-o approved)
import AxiosAdapter from "axios-mock-adapter";
import {assert, expect} from "chai";
import * as HttpStatus from "http-status-codes";
import {IMock, Mock} from "typemoq";
import {DIFF_VALIDATOR_BASE, SERVER_BASE_URL} from "../../../../../common/communication/routes";
import {
    AlreadyFoundDifferenceError,
    GameRoomError,
    NoDifferenceAtPointError,
    NoVacancyGameRoomError
} from "../../../../../common/errors/services.errors";
import {DIFFERENCE_CLUSTER_POINTS_INDEX, ISimpleGame} from "../../../../../common/model/game/simple-game";
import {getOrigin, IPoint} from "../../../../../common/model/point";
import {ISimpleGameInteractionResponse} from "../../../../../common/model/rooms/interaction";
import {deepCompare} from "../../../../../common/util/util";
import {SimpleGameRoom} from "./simple-game-room";

describe("A simple game room", () => {

    let axiosMock: MockAdapter;
    const DIFF_VALIDATOR_URL: string = SERVER_BASE_URL + DIFF_VALIDATOR_BASE;
    const DIFF_VALIDATOR_GET_CALLS_REGEX: RegExp = new RegExp(`${DIFF_VALIDATOR_URL}/*`);

    beforeEach(() => {
        axiosMock = new AxiosAdapter(Axios);
    });

    // I hate tslint sometimes
    const initSimpleGameRoom:
        (simpleGameMockConfigurator?: (mockedSimpleGame: IMock<ISimpleGame>) => void, playerCount?: number, roomId?: string)
            => SimpleGameRoom =
        (simpleGameMockConfigurator?: (mockedSimpleGame: IMock<ISimpleGame>) => void, playerCount: number = 1, roomId: string = "room") => {
            const mockedSimpleGame: IMock<ISimpleGame> = Mock.ofType<ISimpleGame>();
            if (simpleGameMockConfigurator !== undefined) {
            simpleGameMockConfigurator(mockedSimpleGame);
        }

            return new SimpleGameRoom(roomId, mockedSimpleGame.object, playerCount);
    };

    describe("Check-in", () => {
        it("should create a game state when a player checks-in", () => {
            const simpleGameRoom: SimpleGameRoom = initSimpleGameRoom();
            const clientId: string = "Mr. Worldwide";
            simpleGameRoom.checkIn(clientId);

            assert(simpleGameRoom["_connectedPlayers"].has(clientId));
            expect(simpleGameRoom["_gameStates"].size)
                .to.equal(1);
            expect(Array.from(simpleGameRoom["_gameStates"].keys()))
                .to.contain(clientId);
        });

        it("should throw when a room has no vacancy", () => {
            const simpleGameRoom: SimpleGameRoom = initSimpleGameRoom();
            const clientId1: string = "Mr. Worldwide";
            const clientId2: string = "Mr. 305";
            simpleGameRoom.checkIn(clientId1);

            expect(() => simpleGameRoom.checkIn(clientId2))
                .to.throw(NoVacancyGameRoomError.NO_VACANCY_GAME_ROOM_ERROR_MESSAGE);
        });

        it("should contain a state for every player connected", () => {
            // tslint:disable-next-line:no-magic-numbers Random room size
            const roomSize: number = Math.floor(Math.random() * 10) + 2;
            const simpleGameRoom: SimpleGameRoom = initSimpleGameRoom(undefined, roomSize);

            for (let i: number = 0; i < roomSize; i++) {
                simpleGameRoom.checkIn(i.toString());
            }

            expect(simpleGameRoom["_gameStates"].size)
                .to.equal(roomSize);

            for (let i: number = 0; i < roomSize; i++) {
                assert(simpleGameRoom["_connectedPlayers"].has(i.toString()));
                expect(Array.from(simpleGameRoom["_gameStates"].keys()))
                    .to.contain(i.toString());
            }
        });
    });

    describe("Check out", () => {
        it("should empty a room on leave", () => {
            const youCan: SimpleGameRoom = initSimpleGameRoom();
            const clientId: string = "any time you like but you can never leave... [Guitar solo]";
            youCan.checkIn(clientId);

            // Yes... I didn't extract the string only for the pun
            youCan.checkOut("any time you like but you can never leave... [Guitar solo]");

            expect(Array.from(youCan["_gameStates"].keys()))
                .not.to.contain(clientId);

            assert(youCan.empty);

            return expect(youCan["_connectedPlayers"]).to.be.empty;
        });

        it("should remove a client on check out", () => {
            const simpleGameRoom: SimpleGameRoom = initSimpleGameRoom();
            simpleGameRoom.checkIn("client");

            simpleGameRoom.checkOut("client");

            expect(Array.from(simpleGameRoom["_gameStates"].keys()))
                .not.to.contain("client");

            expect(simpleGameRoom["_connectedPlayers"])
                .not.to.contain("client");
        });

        it("should not do anything when an unknown client checks out", () => {
            const simpleGameRoom: SimpleGameRoom = initSimpleGameRoom();
            simpleGameRoom.checkIn("client");

            simpleGameRoom.checkOut("stranger");

            expect(Array.from(simpleGameRoom["_gameStates"].keys()))
                .to.contain("client");
            assert(!simpleGameRoom.empty);

            return expect(simpleGameRoom["_connectedPlayers"]).not.to.be.empty;
        });
    });

    describe("Interact", () => {
        it("should throw when there's no difference at point", async () => {
            const simpleGameRoom: SimpleGameRoom = initSimpleGameRoom();
            simpleGameRoom["_gameStates"].set("client", {foundDifferenceClusters: []});
            axiosMock.onGet(DIFF_VALIDATOR_GET_CALLS_REGEX)
                .reply(HttpStatus.NOT_FOUND);

            return simpleGameRoom.interact("client", {coord: getOrigin()})
                .catch((reason: Error) => {
                    expect(reason.message).to.eql(NoDifferenceAtPointError.NO_DIFFERENCE_AT_POINT_ERROR_MESSAGE);
                });
        });

        it("should throw on unexpected server response", async () => {
            const simpleGameRoom: SimpleGameRoom = initSimpleGameRoom(undefined);
            simpleGameRoom["_gameStates"].set("client", {foundDifferenceClusters: []});
            axiosMock.onGet(DIFF_VALIDATOR_GET_CALLS_REGEX)
                .reply(HttpStatus.INTERNAL_SERVER_ERROR);

            return simpleGameRoom.interact("client", {coord: getOrigin()})
                .catch((reason: Error) => {
                    expect(reason.message).not.to.eql(NoDifferenceAtPointError.NO_DIFFERENCE_AT_POINT_ERROR_MESSAGE);
                });
        });

        it("should return a difference cluster with successful call to server", async () => {
            const simpleGameRoom: SimpleGameRoom = initSimpleGameRoom(
                (mockedSimpleGame: IMock<ISimpleGame>) => {
                    mockedSimpleGame.setup((game: ISimpleGame) => game.diffData)
                        .returns(() => [[0, [getOrigin()]]]);
                });
            simpleGameRoom["_gameStates"].set("client", {foundDifferenceClusters: []});

            axiosMock.onGet(DIFF_VALIDATOR_GET_CALLS_REGEX)
                .reply(HttpStatus.OK);

            return simpleGameRoom.interact("client", {coord: getOrigin()})
                .then((response: ISimpleGameInteractionResponse) => {
                    assert.isTrue(
                        response.differenceCluster[DIFFERENCE_CLUSTER_POINTS_INDEX]
                            .every((point: IPoint) => deepCompare(point, getOrigin())),
                    );
                });
        });

        it("should throw if a difference cluster was already found", async () => {
            const simpleGameRoom: SimpleGameRoom = initSimpleGameRoom();
            simpleGameRoom["_gameStates"].set("client", {foundDifferenceClusters: [[0, [getOrigin()]]]});

            axiosMock.onGet(DIFF_VALIDATOR_GET_CALLS_REGEX)
                .reply(HttpStatus.OK);

            return simpleGameRoom.interact("client", {coord: getOrigin()})
                .catch((reason: Error) => {
                    expect(reason.message).to.eql(AlreadyFoundDifferenceError.ALREADY_FOUND_DIFFERENCE_ERROR_MESSAGE);
                });
        });

        it("should throw a room error if the state for a given client is not defined", async () => {
            const simpleGameRoom: SimpleGameRoom = initSimpleGameRoom();

            axiosMock.onGet(DIFF_VALIDATOR_GET_CALLS_REGEX)
                .reply(HttpStatus.OK);

            return simpleGameRoom.interact("client", {coord: getOrigin()})
                .catch((reason: Error) => {
                    expect(reason.message).to.eql(GameRoomError.GAME_ROOM_ERROR_MESSAGE);
                });
        });
    });
});
