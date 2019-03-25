import { HttpClientModule } from "@angular/common/http";
import { async, TestBed } from "@angular/core/testing";
import { IExtendedFreeGame } from "../../../common/model/game/extended-free-game";
import { IFreeGame } from "../../../common/model/game/free-game";
import { IGame } from "../../../common/model/game/game";
import { ISimpleGame } from "../../../common/model/game/simple-game";
import { GameService } from "./game.service";
import { FreeGameCreatorService } from "./scene-creator/FreeGameCreator/free-game-creator.service";
import { FreeGamePhotoService } from "./scene-creator/free-game-photo-service/free-game-photo.service";

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
      toBeDeleted: false,
    } as ISimpleGame,
    {
      gameName: "mockedName",
      bestSoloTimes: [{ name: "mockedUser1", time: 120 }],
      bestMultiTimes: [{ name: "mockedUser2", time: 23 }],
    } as IFreeGame,
  ];

  const mockSimpleGameList: ISimpleGame[] = [
    {
      gameName: "mockedSimpleName",
      originalImage: "oriName",
      modifiedImage: "modName",
      bestSoloTimes: [{ name: "mockedUser1", time: 120 }],
      bestMultiTimes: [{ name: "mockedUser2", time: 23 }],
      diffData: [],
      toBeDeleted: false,
    },
    {
      gameName: "mockedSimpleName",
      originalImage: "oriName",
      modifiedImage: "modName",
      bestSoloTimes: [{ name: "mockedUser1", time: 120 }],
      bestMultiTimes: [{ name: "mockedUser2", time: 23 }],
      diffData: [],
      toBeDeleted: false,
    },
  ];

  const mockExtendedFreeGameList: IExtendedFreeGame[] = [
    {
      gameName: "mockedSimpleName",
      thumbnail: "",
      bestSoloTimes: [{ name: "mockedUser1", time: 120 }],
      bestMultiTimes: [{ name: "mockedUser2", time: 23 }],
      scenes: {originalObjects: [], modifiedObjects: []},
      toBeDeleted: false,
    },
    {
      gameName: "mockedSimpleName",
      thumbnail: "",
      bestSoloTimes: [{ name: "mockedUser1", time: 120 }],
      bestMultiTimes: [{ name: "mockedUser2", time: 23 }],
      scenes: {originalObjects: [], modifiedObjects: []},
      toBeDeleted: false,
    },
  ];

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
      providers: [
        { provide: GameService, useValue: spyService }, GameService, FreeGamePhotoService, FreeGameCreatorService],
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
    // we expect our time to be equal to a number
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
      toBeDeleted: false,
    }];
    serviceGame.convertScoresObject(incompleteList);
    expect(incompleteList[0].gameName).toBe("incompleteList");
    expect(incompleteList[0].originalImage).toBe("name1.bmp");
    expect(incompleteList[0].modifiedImage).toBe("name2.bmp");
    expect(incompleteList[0].bestSoloTimes.length).toBe(0);
    expect(incompleteList[0].bestMultiTimes.length).toBe(0);
    expect(incompleteList[0].toBeDeleted).toBe(false);
  });

  it ("pushFreeGames should push in extendedFreeGames", () => {
    serviceGame.pushFreeGames(mockExtendedFreeGameList);

    return expect(serviceGame.extendedFreeGames).not.toBeNull;
  });

  it ("pushSimpleGames should push in simpleGames", () => {
    serviceGame.pushSimpleGames(mockSimpleGameList);

    return expect(serviceGame.simpleGames).not.toBeNull;
  });
});
