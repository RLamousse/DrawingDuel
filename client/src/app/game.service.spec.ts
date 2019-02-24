import { HttpClientModule } from "@angular/common/http";
import { async, TestBed } from "@angular/core/testing";
import * as THREE from "three";
import {IFreeGame} from "../../../common/model/game/free-game";
import {IGame} from "../../../common/model/game/game";
import {ISimpleGame} from "../../../common/model/game/simple-game";
import { GameService } from "./game.service";

describe("GameService", () => {
  let serviceGame: GameService;
  let spyService: jasmine.SpyObj<GameService>;

  const emptyMockedGameList: IGame[] = [];

  const mockMixGameList: IGame[] = [
    {
      gameName: "mockedSimpleName",
      originalImage: "oriName",
      modifiedImage: "modName",
      diffImage: "diffName",
      bestSoloTimes: [{ name: "mockedUser1", time: 120 }],
      bestMultiTimes: [{ name: "mockedUser2", time: 23 }],
      diffData: [],
    } as ISimpleGame,
    {
      gameName: "mockedName",
      bestSoloTimes: [{ name: "mockedUser1", time: 120 }],
      bestMultiTimes: [{ name: "mockedUser2", time: 23 }],
    } as IFreeGame,
  ];

  const mockSimpleGameList: ISimpleGame[] = [{
    gameName: "mockedName",
    originalImage: "oriName",
    modifiedImage: "modName",
    bestSoloTimes: [{ name: "mockedUser1", time: 120 }],
    bestMultiTimes: [{ name: "mockedUser2", time: 23 }],
    diffData: [],
  }];

  const mockFreeGameList: IFreeGame[] = [{
    gameName: "mockedName",
    bestSoloTimes: [{ name: "mockedUser1", time: 120 }],
    bestMultiTimes: [{ name: "mockedUser2", time: 23 }],
    originalScene: new THREE.Scene(),
    modifiedScene: new THREE.Scene(),
  }];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [GameService],
    });
  }));

  beforeEach(() => {
    spyService = jasmine.createSpyObj("GameService", ["getGames"]);
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [{ provide: GameService, useValue: spyService}, GameService],
    });
  });

  it("should be created", () => {
    serviceGame = TestBed.get(GameService);
    spyOn(serviceGame, "getSimpleGames").and.returnValue(emptyMockedGameList);
    expect(serviceGame).toBeTruthy();
  });

  // Test ConvertScoresObject
  it("should return a Game type Object", () => {
    expect(typeof (mockMixGameList)).toBe(typeof (serviceGame.convertScoresObject(mockMixGameList)));
  });

  it("should have the right time format and not modify the name", () => {
    serviceGame.convertScoresObject(mockMixGameList);
    // tslint:disable-next-line:no-magic-numbers
    expect(mockMixGameList[0].bestSoloTimes[0].time).toEqual(0.02);
    expect(mockMixGameList[0].bestSoloTimes[0].name).toBe("mockedUser1");
  });

  it("should not modify agument if list is empty(no game inside)", () => {
    serviceGame.convertScoresObject(emptyMockedGameList);
    expect(emptyMockedGameList.length).toBe(0);
  });

  it("should return and modify originalImage if no time inside list", () => {
    const incompleteList: ISimpleGame[] = [{
      gameName: "incompleteList",
      originalImage: "name1.bmp",
      modifiedImage: "name2.bmp",
      bestSoloTimes: [],
      bestMultiTimes: [],
      diffData: [],
    }];
    serviceGame.convertScoresObject(incompleteList);
    expect(incompleteList[0].gameName).toBe("incompleteList");
    expect(incompleteList[0].originalImage).toBe("name1.bmp");
    expect(incompleteList[0].modifiedImage).toBe("name2.bmp");
    expect(incompleteList[0].bestSoloTimes.length).toBe(0);
    expect(incompleteList[0].bestMultiTimes.length).toBe(0);
  });

  // Test pushGames
  it("should not have any game in its list if gameToPush is empty", () => {
    serviceGame.freeGames = [];
    serviceGame.simpleGames = [];
    serviceGame.pushGames(emptyMockedGameList);
    expect(serviceGame.freeGames.length).toBe(0);
    expect(serviceGame.simpleGames.length).toBe(0);
  });

  it("should only have games in freeGames list and none in simpleGame list", () => {
    serviceGame.freeGames = [];
    serviceGame.simpleGames = [];
    serviceGame.pushGames(mockFreeGameList);
    expect(serviceGame.freeGames.length).not.toBe(0);
    expect(serviceGame.freeGames[0]).toBe(mockFreeGameList[0]);
    expect(serviceGame.simpleGames.length).toBe(0);
  });

  it("should only have games in simpleGames list and none in freeGame list", () => {
    serviceGame.freeGames = [];
    serviceGame.simpleGames = [];
    serviceGame.pushGames(mockSimpleGameList);
    expect(serviceGame.freeGames.length).toBe(0);
    expect(serviceGame.simpleGames.length).not.toBe(0);
    expect(serviceGame.simpleGames[0]).toBe(mockSimpleGameList[0]);
  });

  it("should have games both its list", () => {
    serviceGame.freeGames = [];
    serviceGame.simpleGames = [];
    serviceGame.pushGames(mockMixGameList);
    expect(serviceGame.simpleGames.length).not.toBe(0);
    expect(serviceGame.freeGames.length).not.toBe(0);
  });
});
