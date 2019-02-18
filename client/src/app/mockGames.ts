import {GameType, Game} from "../../../common/model/game/game";

export const MOCKMIXGAMELIST: Game[] = [
    {
      gameName: "mockedSimpleGameName1",
      originalImage: "tiger.bmp",
      modifiedImage: "tiger.bmp",
      diffImage: "tiger-diff.bmp",
      bestSoloTimes: [{ name: "mockedUser1", time: 1200 },
                      { name: "mockedUser2", time: 1450 },
                      { name: "mockedUser3", time: 1600 }],
      bestMultiTimes: [{ name: "mockedUser1", time: 1200 },
                       { name: "mockedUser2", time: 1450 },
                       { name: "mockedUser3", time: 1600 }],
      gameType: GameType.SIMPLE,
    },
    {
        gameName: "mockedSimpleGameName2",
        originalImage: "tiger.bmp",
        modifiedImage: "tiger.bmp",
        diffImage: "tiger-diff.bmp",
        bestSoloTimes: [{ name: "mockedUser1", time: 1200 },
                        { name: "mockedUser2", time: 1450 },
                        { name: "mockedUser3", time: 1600 }],
        bestMultiTimes: [{ name: "mockedUser1", time: 1200 },
                         { name: "mockedUser2", time: 1450 },
                         { name: "mockedUser3", time: 1600 }],
        gameType: GameType.SIMPLE,
    },
    {
        gameName: "mockedSimpleName3",
        originalImage: "tiger.bmp",
        modifiedImage: "tiger.bmp",
        diffImage: "tiger-diff.bmp",

        bestSoloTimes: [{ name: "mockedUser1", time: 1200 },
                        { name: "mockedUser2", time: 1450 },
                        { name: "mockedUser3", time: 1600 }],
        bestMultiTimes: [{ name: "mockedUser1", time: 1200 },
                         { name: "mockedUser2", time: 1450 },
                         { name: "mockedUser3", time: 1600 }],
        gameType: GameType.SIMPLE,
    },
  ];
