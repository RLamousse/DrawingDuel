import {Injectable} from "@angular/core";
import Axios, {AxiosPromise, AxiosResponse} from "axios";
import {from, Observable} from "rxjs";
import {
  GAME_MANAGER_FREE,
  GAME_MANAGER_SIMPLE,
  RESET_SCORES,
  SERVER_BASE_URL
} from "../../../common/communication/routes";
import {IJson3DObject} from "../../../common/free-game-json-interface/JSONInterface/IScenesJSON";
import {IFreeGame} from "../../../common/model/game/free-game";
import {IGame} from "../../../common/model/game/game";
import {ISimpleGame} from "../../../common/model/game/simple-game";

@Injectable({providedIn: "root"})
export class GameService {

  public simpleGames: ISimpleGame[] = [];
  public freeGames: IFreeGame[] = [];
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
      this.simpleGames.push(game);
    }
  }

  public pushFreeGames(freeGamesToModify: IFreeGame[]): void {
    this.freeGames = [];
    this.convertScoresObject(freeGamesToModify);
    for (const game of freeGamesToModify) {
      this.freeGames.push(game);
    }
  }

  public getSimpleGames(): Observable<ISimpleGame[]> {
    return from(
      Axios.get<ISimpleGame[]>(this.SIMPLE_GAME_BASE_URL, {params: {filterDeleted: true}})
        .then((value: AxiosResponse<ISimpleGame[]>) => value.data)
        .catch((error) => { throw error; }),
    );
  }

  public getFreeGames(): Observable<IFreeGame[]> {
    return from(
      Axios.get<IFreeGame[]>(this.FREE_GAME_BASE_URL, {params: {filterDeleted: true}})
        .then((value: AxiosResponse<IFreeGame[]>) => value.data)
        .catch((error) => { throw error; }),
    );
  }

  public getFreeGameByName(gameName: string): Observable<IFreeGame> {
    return from(
      Axios.get<IFreeGame>(this.FREE_GAME_BASE_URL + encodeURIComponent(gameName))
        .then((value: AxiosResponse<IFreeGame>) => value.data)
        .catch((error) => { throw error; }),
    );
  }

  public hideSimpleByName(gameName: string): AxiosPromise<void> {
    return Axios.delete(this.SIMPLE_GAME_BASE_URL + encodeURIComponent(gameName))
      .catch((error) => { throw error; });
  }

  public hideFreeByName(gameName: string): AxiosPromise<void> {
    return Axios.delete(this.FREE_GAME_BASE_URL + encodeURIComponent(gameName))
      .catch((error) => { throw error; });
  }

  public resetGameTime(gameName: string): AxiosPromise<void> {
    return Axios.put<void>(this.RESET_SCORES_URL + encodeURIComponent(gameName), null)
      .catch((error) => { throw error; });
  }
  public async loadCheatData(gameName: string): Promise<IJson3DObject[]> {
    return Axios.get<IFreeGame>(this.FREE_GAME_BASE_URL + encodeURIComponent(gameName))
      .then((value) => value.data.scenes.differentObjects)
      .catch((error) => { throw error; });
  }
}
