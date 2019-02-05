import { async, TestBed } from "@angular/core/testing";
import { Game } from "../../../common/Object/game";
import { GameService } from "./game.service";
import { HttpClientModule } from "@angular/common/http";

describe("GameService", () => {
  let serviceGame: GameService;

  const emptyMockedGameList: Game[] = [];

  const mockMixGameList: Game[] = [
    {
      gameName: "mockedSimpleName",
      originalImage: "oriName",
      modifiedImage: "modName",
      bestSoloTimes: [{ name: "mockedUser1", time: 120 }],
      bestMultiTimes: [{ name: "mockedUser2", time: 23 }],
      isSimpleGame: false,
    },
    {
      gameName: "mockedFreeName",
      originalImage: "oriName",
      modifiedImage: "modName",
      bestSoloTimes: [{ name: "mockedUser1", time: 120 }],
      bestMultiTimes: [{ name: "mockedUser2", time: 23 }],
      isSimpleGame: true,
    },
  ];

  const mockSimpleGameList: Game[] = [{
    gameName: "mockedName",
    originalImage: "oriName",
    modifiedImage: "modName",
    bestSoloTimes: [{ name: "mockedUser1", time: 120 }],
    bestMultiTimes: [{ name: "mockedUser2", time: 23 }],
    isSimpleGame: true,
  }];

  const mockFreeGameList: Game[] = [{
    gameName: "mockedName",
    originalImage: "oriName",
    modifiedImage: "modName",
    bestSoloTimes: [{ name: "mockedUser1", time: 120 }],
    bestMultiTimes: [{ name: "mockedUser2", time: 23 }],
    isSimpleGame: false,
  }];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [GameService],
    });
  }));

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [GameService],
    });
  });

  it("should be created", () => {
    serviceGame = TestBed.get(GameService);
    spyOn(serviceGame, "getGames").and.returnValue(emptyMockedGameList);
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
    const incompleteList: Game[] = [{
      gameName: "incompleteList",
      originalImage: "name1",
      modifiedImage: "name2",
      bestSoloTimes: [],
      bestMultiTimes: [],
      isSimpleGame: true,
    }];
    serviceGame.convertScoresObject(incompleteList);
    expect(incompleteList[0].gameName).toBe("incompleteList");
    expect(incompleteList[0].originalImage).toBe("http://localhost:3000/name1.bmp");
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
    expect(serviceGame.simpleGames.length).toBe(0);
  });

  it("should only have games in simpleGames list and none in freeGame list", () => {
    serviceGame.freeGames = [];
    serviceGame.simpleGames = [];
    serviceGame.pushGames(mockSimpleGameList);
    expect(serviceGame.freeGames.length).toBe(0);
    expect(serviceGame.simpleGames.length).not.toBe(0);
  });

  it("should only have games both its list", () => {
    serviceGame.freeGames = [];
    serviceGame.simpleGames = [];
    serviceGame.pushGames(mockMixGameList);
    expect(serviceGame.freeGames.length).not.toBe(0);
    expect(serviceGame.simpleGames.length).not.toBe(0);
  });
});