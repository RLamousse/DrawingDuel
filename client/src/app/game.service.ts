import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { of, Observable } from "rxjs";
import { catchError } from "rxjs/operators";
import {Game, GameType} from "../../../common/model/game/game";

@Injectable({
  providedIn: "root",
})
export class GameService {
  public simpleGames: Game[] = [];
  public freeGames: Game[] = [];
  public readonly BASE_URL: string = "http://localhost:3000/api/data-base/games/";
  public constructor(private http: HttpClient) { }

  private convertTimeScores(seconds: number): number {
    const COEFFICIENT: number = 0.6;
    const MINUTE: number = 60;
    const DECIMALS: number = 2;
    seconds /= MINUTE;

    return Number((Math.floor(seconds) + ((seconds - Math.floor(seconds)) * COEFFICIENT)).toFixed(DECIMALS));
  }

  private buildHttpAdress(imageAdress: string): string {
    const ADRESS: string = "http://localhost:3000/";

    return (ADRESS + imageAdress);
  }

  public convertScoresObject(game: Game[]): Game[] {
    for (const i in game) {
      if (game.hasOwnProperty(i)) {
        game[i].originalImage = this.buildHttpAdress(game[i].originalImage);
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

  public pushGames(gamesToPush: Game[]): void {
    for (const game of gamesToPush) {
      switch (game.gameType) {
        case GameType.SIMPLE:
          this.simpleGames.push(game);
          break;
        case GameType.FREE:
          this.freeGames.push(game);
          break;
        default:
          // NOP
              break;
      }
    }
  }

  public getGames(): Observable<Game[]> {
    return this.http.get<Game[]>(this.BASE_URL).pipe(
      catchError(this.handleError<Game[]>("basicGet")),
    );
  }

  private handleError<T>(request: string, result?: T): (error: Error) => Observable<T> {

    return (error: Error): Observable<T> => {
        return of(result as T);
    };
  }
}
