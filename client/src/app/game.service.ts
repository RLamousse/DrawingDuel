import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { of, Observable } from "rxjs";
import { catchError } from "rxjs/operators";
import {/*instanceOfFreeGame,*/ IFreeGame} from "../../../common/model/game/free-game";
import {IGame} from "../../../common/model/game/game";
import {instanceOfSimpleGame, ISimpleGame} from "../../../common/model/game/simple-game";

@Injectable({
  providedIn: "root",
})
export class GameService {
  public simpleGames: ISimpleGame[] = [];
  public freeGames: IFreeGame[] = [];
  private readonly SIMPLE_GAME_BASE_URL: string = "http://localhost:3000/api/data-base/games/simple/";

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

  public pushGames(gamesToPush: IGame[]): void {
    for (const game of gamesToPush) {
      if (instanceOfSimpleGame(game)) {
        this.simpleGames.push(game);
      } else /*if (instanceOfFreeGame(game))*/ { // feature still in progress
        this.freeGames.push(game);
      }
    }
  }

  public getSimpleGames(): Observable<ISimpleGame[]> {

    return this.http.get<ISimpleGame[]>(this.SIMPLE_GAME_BASE_URL).pipe(
      catchError(this.handleError<ISimpleGame[]>("get SimpleGames from Server failed")),
    );
  }

  private handleError<T>(request: string, result?: T): (error: Error) => Observable<T> {

    return (error: Error): Observable<T> =>  of(result as T);
  }
}
