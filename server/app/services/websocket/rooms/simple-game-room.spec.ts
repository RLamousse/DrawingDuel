import * as assert from "assert";
import Axios from "axios";
import MockAdapter from "axios-mock-adapter";
// tslint:disable-next-line:no-duplicate-imports Weird interaction between singletons and interface (olivier st-o approved)
import AxiosAdapter from "axios-mock-adapter";
import {expect} from "chai";
import * as HttpStatus from "http-status-codes";
import {IMock} from "typemoq";
// tslint:disable-next-line:no-duplicate-imports Weird interaction between singletons and interface (olivier st-o approved)
import * as TypeMoq from "typemoq";
import {DIFF_VALIDATOR_BASE, SERVER_BASE_URL} from "../../../../../common/communication/routes";
import {
    AlreadyFoundDifferenceError,
    GameRoomError,
    NoDifferenceAtPointError,
    NoVacancyGameRoomError
} from "../../../../../common/errors/services.errors";
import {DIFFERENCE_CLUSTER_POINTS_INDEX, ISimpleGame} from "../../../../../common/model/game/simple-game";
import {ORIGIN} from "../../../../../common/model/point";
import {ISimpleGameInteractionResponse} from "../../../../../common/model/rooms/interaction";
import {SimpleGameRoom} from "./simple-game-room";

describe.only("A simple game room", () => {

    let axiosMock: MockAdapter;
    const DIFF_VALIDATOR_URL: string = SERVER_BASE_URL + DIFF_VALIDATOR_BASE;
    const DIFF_VALIDATOR_GET_CALLS_REGEX: RegExp = new RegExp(`${DIFF_VALIDATOR_URL}/*`);

    beforeEach(() => {
        axiosMock = new AxiosAdapter(Axios);
    });

    const initSimpleGameRoom = (simpleGameMockConfigurator?: (mockedSimpleGame: IMock<ISimpleGame>) => void, playerCount: number = 1, roomId: string = "room") => {
        const mockedSimpleGame: IMock<ISimpleGame> = TypeMoq.Mock.ofType<ISimpleGame>();
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

            expect(simpleGameRoom["_connectedPlayers"])
                .to.contain(clientId);
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
                expect(simpleGameRoom["_connectedPlayers"])
                    .to.contain(i.toString());
                expect(Array.from(simpleGameRoom["_gameStates"].keys()))
                    .to.contain(i.toString());
            }
        });
    });

    describe("Check out", () => {
        it("should return true if a room is empty", () => {
            const youCan: SimpleGameRoom = initSimpleGameRoom();
            const clientId: string = "any time you like but you can never leave... [Guitar solo]";
            youCan.checkIn(clientId);

            // Yes... I didn't extract the string only for the pun
            assert(youCan.checkOut("any time you like but you can never leave... [Guitar solo]"));

            expect(Array.from(youCan["_gameStates"].keys()))
                .not.to.contain(clientId);

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

            assert(!simpleGameRoom.checkOut("stranger"));

            expect(Array.from(simpleGameRoom["_gameStates"].keys()))
                .to.contain("client");

            return expect(simpleGameRoom["_connectedPlayers"]).not.to.be.empty;
        });
    });

    describe("Interact", () => {
        it("should throw when there's no difference at point", async () => {
            const simpleGameRoom: SimpleGameRoom = initSimpleGameRoom();
            simpleGameRoom["_gameStates"].set("client", {foundDifferenceClusters: []});
            axiosMock.onGet(DIFF_VALIDATOR_GET_CALLS_REGEX)
                .reply(HttpStatus.NOT_FOUND);

            return simpleGameRoom.interact("client", {clientId: "client", coord: ORIGIN})
                .catch((reason: Error) => {
                    expect(reason.message).to.eql(NoDifferenceAtPointError.NO_DIFFERENCE_AT_POINT_ERROR_MESSAGE);
                });
        });

        it("should throw on unexpected server response", async () => {
            const simpleGameRoom: SimpleGameRoom = initSimpleGameRoom(undefined);
            simpleGameRoom["_gameStates"].set("client", {foundDifferenceClusters: []});
            axiosMock.onGet(DIFF_VALIDATOR_GET_CALLS_REGEX)
                .reply(HttpStatus.INTERNAL_SERVER_ERROR);

            return simpleGameRoom.interact("client", {clientId: "client", coord: ORIGIN})
                .catch((reason: Error) => {
                    expect(reason.message).not.to.eql(NoDifferenceAtPointError.NO_DIFFERENCE_AT_POINT_ERROR_MESSAGE);
                });
        });

        it("should return a difference cluster with successful call to server", async () => {
            const simpleGameRoom: SimpleGameRoom = initSimpleGameRoom(
                (mockedSimpleGame: IMock<ISimpleGame>) => {
                    mockedSimpleGame.setup((game: ISimpleGame) => game.diffData)
                        .returns(() => [[0, [ORIGIN]]]);
                });
            simpleGameRoom["_gameStates"].set("client", {foundDifferenceClusters: []});

            axiosMock.onGet(DIFF_VALIDATOR_GET_CALLS_REGEX)
                .reply(HttpStatus.OK);

            return simpleGameRoom.interact("client", {clientId: "client", coord: ORIGIN})
                .then((response: ISimpleGameInteractionResponse) => {
                    expect(response.differenceCluster[DIFFERENCE_CLUSTER_POINTS_INDEX]).to.contain(ORIGIN);
                });
        });

        it("should throw if a difference cluster was already found", async () => {
            const simpleGameRoom: SimpleGameRoom = initSimpleGameRoom();
            simpleGameRoom["_gameStates"].set("client", {foundDifferenceClusters: [[0, [ORIGIN]]]});

            axiosMock.onGet(DIFF_VALIDATOR_GET_CALLS_REGEX)
                .reply(HttpStatus.OK);

            return simpleGameRoom.interact("client", {clientId: "client", coord: ORIGIN})
                .catch((reason: Error) => {
                    expect(reason.message).to.eql(AlreadyFoundDifferenceError.ALREADY_FOUND_DIFFERENCE_ERROR_MESSAGE);
                });
        });

        it("should throw a room error if the state for a given client is not defined", () => {
            const simpleGameRoom: SimpleGameRoom = initSimpleGameRoom();

            axiosMock.onGet(DIFF_VALIDATOR_GET_CALLS_REGEX)
                .reply(HttpStatus.OK);

            return simpleGameRoom.interact("client", {clientId: "client", coord: ORIGIN})
                .catch((reason: Error) => {
                    expect(reason.message).to.eql(GameRoomError.GAME_ROOM_ERROR_MESSAGE);
                });
        });
    });
});
