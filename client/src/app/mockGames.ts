import { IExtendedFreeGame } from "../../../common/model/game/extended-free-game";
import { ISimpleGame } from "../../../common/model/game/simple-game";

export const MOCKED_SIMPLE_GAMES: ISimpleGame[] = [
    {
      gameName: "mockedSimpleGameName1",
      originalImage: "http://localhost:3000/tiger.bmp",
      modifiedImage: "http://localhost:3000/tiger.bmp",
      bestSoloTimes: [{ name: "mockedUser1", time: 1200 },
                      { name: "mockedUser2", time: 1450 },
                      { name: "mockedUser3", time: 1600 }],
      bestMultiTimes: [{ name: "mockedUser1", time: 1200 },
                       { name: "mockedUser2", time: 1450 },
                       { name: "mockedUser3", time: 1600 }],
      diffData: [],
    },
    {
        gameName: "mockedSimpleGameName2",
        originalImage: "http://localhost:3000/tiger.bmp",
        modifiedImage: "http://localhost:3000/tiger.bmp",
        bestSoloTimes: [{ name: "mockedUser1", time: 1200 },
                        { name: "mockedUser2", time: 1450 },
                        { name: "mockedUser3", time: 1600 }],
        bestMultiTimes: [{ name: "mockedUser1", time: 1200 },
                         { name: "mockedUser2", time: 1450 },
                         { name: "mockedUser3", time: 1600 }],
        diffData: [],
    },
    {
        gameName: "mockedSimpleName3",
        originalImage: "http://localhost:3000/tiger.bmp",
        modifiedImage: "http://localhost:3000/tiger.bmp",

        bestSoloTimes: [{ name: "mockedUser1", time: 1200 },
                        { name: "mockedUser2", time: 1450 },
                        { name: "mockedUser3", time: 1600 }],
        bestMultiTimes: [{ name: "mockedUser1", time: 1200 },
                         { name: "mockedUser2", time: 1450 },
                         { name: "mockedUser3", time: 1600 }],
        diffData: [],
    },
  ];

export const MOCKED_FREE_GAMES: IExtendedFreeGame[] = [
    {
      gameName: "mockedFreeGameName1",
      thumbnail: "http://localhost:3000/tiger.bmp",
      bestSoloTimes: [{ name: "mockedUser1", time: 1200 },
                      { name: "mockedUser2", time: 1450 },
                      { name: "mockedUser3", time: 1600 }],
      bestMultiTimes: [{ name: "mockedUser1", time: 1200 },
                       { name: "mockedUser2", time: 1450 },
                       { name: "mockedUser3", time: 1600 }],
      scenes: {originalObjects: [], modifiedObjects: [] },
    },
    {
        gameName: "mockedFreeGameName2",
        thumbnail: "http://localhost:3000/tiger.bmp",
        bestSoloTimes: [{ name: "mockedUser1", time: 1200 },
                        { name: "mockedUser2", time: 1450 },
                        { name: "mockedUser3", time: 1600 }],
        bestMultiTimes: [{ name: "mockedUser1", time: 1200 },
                         { name: "mockedUser2", time: 1450 },
                         { name: "mockedUser3", time: 1600 }],
        scenes: {originalObjects: [], modifiedObjects: [] },
    },
    {
        gameName: "mockedFreeName3",
        thumbnail: "http://localhost:3000/tiger.bmp",
        bestSoloTimes: [{ name: "mockedUser1", time: 1200 },
                        { name: "mockedUser2", time: 1450 },
                        { name: "mockedUser3", time: 1600 }],
        bestMultiTimes: [{ name: "mockedUser1", time: 1200 },
                         { name: "mockedUser2", time: 1450 },
                         { name: "mockedUser3", time: 1600 }],
        scenes: {originalObjects: [], modifiedObjects: [] },
    },
  ];
