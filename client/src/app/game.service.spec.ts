import { ComponentFixture, TestBed } from "@angular/core/testing";
import { Game } from "../../../common/Object/game";
import { GameListComponent } from "./game-list/game-list.component";
import { GameService } from "./game.service";

describe("GameService", () => {
  let component: GameListComponent;
  let serviceGame: GameService;
  let fixture: ComponentFixture<GameListComponent>;

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

  beforeEach(() => TestBed.configureTestingModule({}));

  beforeEach(() => {
    fixture = TestBed.createComponent(GameListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    spyOn(serviceGame, "getGames").and.returnValue(mockMixGameList);
  });

  it("should be created", () => {
    const service: GameService = TestBed.get(GameService);
    expect(service).toBeTruthy();
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
    component.freeGames = [];
    component.simpleGames = [];
    serviceGame.pushGames(emptyMockedGameList);
    expect(component.freeGames.length).toBe(0);
    expect(component.simpleGames.length).toBe(0);
  });

  it("should only have games in freeGames list and none in simpleGame list", () => {
    component.freeGames = [];
    component.simpleGames = [];
    serviceGame.pushGames(mockFreeGameList);
    expect(component.freeGames.length).not.toBe(0);
    expect(component.simpleGames.length).toBe(0);
  });

  it("should only have games in simpleGames list and none in freeGame list", () => {
    component.freeGames = [];
    component.simpleGames = [];
    serviceGame.pushGames(mockSimpleGameList);
    expect(component.freeGames.length).toBe(0);
    expect(component.simpleGames.length).not.toBe(0);
  });

  it("should only have games both its list", () => {
    component.freeGames = [];
    component.simpleGames = [];
    serviceGame.pushGames(mockMixGameList);
    expect(component.freeGames.length).not.toBe(0);
    expect(component.simpleGames.length).not.toBe(0);
  });
});
