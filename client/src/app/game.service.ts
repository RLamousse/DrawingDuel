import {Injectable} from "@angular/core";
import Axios, {AxiosResponse} from "axios";
import {from, Observable} from "rxjs";
import {
  GAME_MANAGER_FREE, GAME_MANAGER_GET_NOT_DELETED_REQUEST, GAME_MANAGER_GET_REQUEST,
  GAME_MANAGER_SIMPLE, GAME_MANAGER_UPDATE_REQUEST,
  RESET_SCORES,
  SERVER_BASE_URL
} from "../../../common/communication/routes";
import {IJson3DObject} from "../../../common/free-game-json-interface/JSONInterface/IScenesJSON";
import {IExtendedFreeGame} from "../../../common/model/game/extended-free-game";
import {IFreeGame} from "../../../common/model/game/free-game";
import {IGame} from "../../../common/model/game/game";
import {ISimpleGame} from "../../../common/model/game/simple-game";
import {FreeGameCreatorService} from "./scene-creator/FreeGameCreator/free-game-creator.service";
import {FreeGamePhotoService} from "./scene-creator/free-game-photo-service/free-game-photo.service";
import {IScene} from "./scene-interface";

@Injectable({
              providedIn: "root",
            })
export class GameService {

  public constructor(
    private photoService: FreeGamePhotoService,
    private freeGameCreatorService: FreeGameCreatorService,
  ) {
  }
  public simpleGames: ISimpleGame[] = [];
  public freeGames: IFreeGame[] = [];
  public extendedFreeGames: IExtendedFreeGame[] = [];
  public readonly SIMPLE_GAME_BASE_URL: string = SERVER_BASE_URL + GAME_MANAGER_SIMPLE;
  public readonly FREE_GAME_BASE_URL: string = SERVER_BASE_URL + GAME_MANAGER_FREE;
  public readonly RESET_SCORES_URL: string = SERVER_BASE_URL + RESET_SCORES;

  private convertTimeScores(seconds: number): number {
    const COEFFICIENT: number = 0.6;
    const MINUTE: number = 60;
    const DECIMALS: number = 2;
    seconds /= MINUTE;

    return Number((Math.floor(seconds) + ((seconds - Math.floor(seconds)) * COEFFICIENT)).toFixed(DECIMALS));
  }

  public convertScoresObject(game: IGame[]): IGame[] {
    for (const i in game) {
      if (game.hasOwnProperty(i)) {
        for (const j in game[i].bestSoloTimes) {
          if (game[i].bestSoloTimes.hasOwnProperty(j)) {
            game[i].bestSoloTimes[j].time = this.convertTimeScores(game[i].bestSoloTimes[j].time);
            game[i].bestMultiTimes[j].time = this.convertTimeScores(game[i].bestMultiTimes[j].time);
          }
        }
      }
    }

    return game;
  }

  public pushSimpleGames(simpleGamesToModify: ISimpleGame[]): void {
    this.simpleGames = [];
    this.convertScoresObject(simpleGamesToModify);
    for (const game of simpleGamesToModify) {
      if (!game.toBeDeleted) {
        this.simpleGames.push(game);
      }
    }
  }

  public pushFreeGames(freeGamesToModify: IFreeGame[]): void {
    this.freeGames = [];
    this.extendedFreeGames = [];
    this.convertScoresObject(freeGamesToModify);
    for (const game of freeGamesToModify) {
      if (!game.toBeDeleted) {
        this.freeGames.push(game);
      }
    }
    for (const game of this.freeGames) {
      if (!game.toBeDeleted) {
        const img: string = "";
        const extendedFreeGame: IExtendedFreeGame = {
          thumbnail: img,
          scenes: game.scenes,
          gameName: game.gameName,
          bestSoloTimes: game.bestSoloTimes,
          bestMultiTimes: game.bestMultiTimes,
          toBeDeleted: game.toBeDeleted,
        };
        this.extendedFreeGames.push(extendedFreeGame);
      }
    }

  }

  public getSimpleGames(): Observable<ISimpleGame[]> {
    return from(
      Axios.get<ISimpleGame[]>(this.SIMPLE_GAME_BASE_URL + GAME_MANAGER_GET_NOT_DELETED_REQUEST)
        .then((value: AxiosResponse<ISimpleGame[]>) => value.data)
        .catch((error) => { throw error; }),
    );
  }

  public getFreeGames(): Observable<IFreeGame[]> {
    return from(
      Axios.get<IFreeGame[]>(this.FREE_GAME_BASE_URL + GAME_MANAGER_GET_NOT_DELETED_REQUEST)
        .then((value: AxiosResponse<IFreeGame[]>) => value.data)
        .catch((error) => { throw error; }),
    );
  }

  public getFreeGameByName(gameName: string): Observable<IFreeGame> {
    return from(
      Axios.get<IFreeGame>(this.FREE_GAME_BASE_URL + GAME_MANAGER_GET_REQUEST + gameName)
        .then((value: AxiosResponse<IFreeGame>) => value.data)
        .catch((error) => { throw error; }),
    );
  }

  public hideSimpleByName(gameName: string): void {
    Axios.put(this.SIMPLE_GAME_BASE_URL + GAME_MANAGER_UPDATE_REQUEST + gameName, {toBeDeleted: true})
      .catch((error) => { throw error; });
  }

  public hideFreeByName(gameName: string): void {
    Axios.put(this.FREE_GAME_BASE_URL + GAME_MANAGER_UPDATE_REQUEST + gameName, {toBeDeleted: true})
      .catch((error) => { throw error; });
  }

  public resetGameTime(gameName: string): void {
    Axios.put(this.RESET_SCORES_URL + gameName, null)
      .catch((error) => { throw error; });
  }
  public async loadCheatData(gameName: string): Promise<IJson3DObject[]> {
    return Axios.get<IFreeGame>(this.FREE_GAME_BASE_URL + GAME_MANAGER_GET_REQUEST + gameName)
      .then((value) => value.data.scenes.differentObjects)
      .catch((error) => { throw error; });
  }

  public async updateFreeGameImages(): Promise<void> {

    for (const freeGame of this.extendedFreeGames) {
      const scenes: IScene = this.freeGameCreatorService.createScenes(freeGame.scenes);
      await this.photoService.takePhoto(scenes.scene).then((value) => {freeGame.thumbnail = value; });
    }
  }
}
