import {ISimpleGame} from "../../../common/model/game/simple-game";

export const MOCKED_SIMPLE_GAMES: ISimpleGame[] = [
    {
      gameName: "mockedSimpleGameName1",
      originalImage: "tiger.bmp",
      modifiedImage: "tiger.bmp",
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
        originalImage: "tiger.bmp",
        modifiedImage: "tiger.bmp",
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
        originalImage: "tiger.bmp",
        modifiedImage: "tiger.bmp",

        bestSoloTimes: [{ name: "mockedUser1", time: 1200 },
                        { name: "mockedUser2", time: 1450 },
                        { name: "mockedUser3", time: 1600 }],
        bestMultiTimes: [{ name: "mockedUser1", time: 1200 },
                         { name: "mockedUser2", time: 1450 },
                         { name: "mockedUser3", time: 1600 }],
        diffData: [],
    },
  ];
