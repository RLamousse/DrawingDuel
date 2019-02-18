import {IFreeGame} from "../../../common/model/game/free-game";
import {ISimpleGame} from "../../../common/model/game/simple-game";

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

export const MOCKED_FREE_GAMES: IFreeGame[] = [
    {
      gameName: "mockedSimpleGameName1",
      bestSoloTimes: [{ name: "mockedUser1", time: 1200 },
                      { name: "mockedUser2", time: 1450 },
                      { name: "mockedUser3", time: 1600 }],
      bestMultiTimes: [{ name: "mockedUser1", time: 1200 },
                       { name: "mockedUser2", time: 1450 },
                       { name: "mockedUser3", time: 1600 }],
    },
    {
        gameName: "mockedSimpleGameName2",
        bestSoloTimes: [{ name: "mockedUser1", time: 1200 },
                        { name: "mockedUser2", time: 1450 },
                        { name: "mockedUser3", time: 1600 }],
        bestMultiTimes: [{ name: "mockedUser1", time: 1200 },
                         { name: "mockedUser2", time: 1450 },
                         { name: "mockedUser3", time: 1600 }],
    },
    {
        gameName: "mockedSimpleName3",
        bestSoloTimes: [{ name: "mockedUser1", time: 1200 },
                        { name: "mockedUser2", time: 1450 },
                        { name: "mockedUser3", time: 1600 }],
        bestMultiTimes: [{ name: "mockedUser1", time: 1200 },
                         { name: "mockedUser2", time: 1450 },
                         { name: "mockedUser3", time: 1600 }],
    },
  ];
