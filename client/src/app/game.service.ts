import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { of, Observable } from "rxjs";
import { catchError } from "rxjs/operators";
import { IExtendedFreeGame } from "../../../common/model/game/extended-free-game";
import { IFreeGame } from "../../../common/model/game/free-game";
import { IGame } from "../../../common/model/game/game";
import { ISimpleGame } from "../../../common/model/game/simple-game";

@Injectable({
  providedIn: "root",
})
export class GameService {
  public simpleGames: ISimpleGame[] = [];
  public freeGames: IFreeGame[] = [];
  public extendedFreeGames: IExtendedFreeGame[] = [];
  public readonly SIMPLE_GAME_BASE_URL: string = "http://localhost:3000/api/data-base/games/simple/";
  public readonly FREE_GAME_BASE_URL: string = "http://localhost:3000/api/data-base/games/free/";
  public constructor(private http: HttpClient) { }

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

  public getSimpleGames(): Observable<ISimpleGame[]> {
    return this.http.get<ISimpleGame[]>(this.SIMPLE_GAME_BASE_URL).pipe(
      catchError(this.handleError<ISimpleGame[]>("get simple game from server error")),
    );
  }

  public getFreeGames(): Observable<IFreeGame[]> {
    return this.http.get<IFreeGame[]>(this.FREE_GAME_BASE_URL).pipe(
      catchError(this.handleError<IFreeGame[]>("get free game from server error")),
    );
  }

  public getFreeGameByName(gameName: string): Observable<IFreeGame> {
    return this.http.get<IFreeGame>(this.FREE_GAME_BASE_URL + "/" + gameName).pipe(
      catchError(this.handleError<IFreeGame>("get free game from server error")),
    );
  }

  private handleError<T>(request: string, result?: T): (error: Error) => Observable<T> {

    return (error: Error): Observable<T> => {
        return of(result as T);
    };
  }
}
