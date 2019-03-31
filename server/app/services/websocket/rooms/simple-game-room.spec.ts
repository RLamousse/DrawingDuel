import * as assert from "assert";
import {expect} from "chai";
import {IMock} from "typemoq";
// tslint:disable-next-line:no-duplicate-imports Weird interaction between singletons and interface (olivier st-o approved)
import * as TypeMoq from "typemoq";
import {NoVacancyGameRoomError} from "../../../../../common/errors/services.errors";
import {ISimpleGame} from "../../../../../common/model/game/simple-game";
import {SimpleGameRoom} from "./simple-game-room";

describe("A simple game room", () => {

    let mockedSimpleGame: IMock<ISimpleGame>;

    beforeEach(() => {
    });

    const initSimpleGameRoom = (roomId: string = "room", playerCount: number = 1, mockConfigurator?: () => void) => {
        mockedSimpleGame = TypeMoq.Mock.ofType<ISimpleGame>();
        if (mockConfigurator !== undefined) {
            mockConfigurator();
        }

        const simpleGameRoom = new SimpleGameRoom(roomId, mockedSimpleGame.object, playerCount);

        return simpleGameRoom;
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
            const simpleGameRoom: SimpleGameRoom = initSimpleGameRoom("multiRoom", roomSize);

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
});
