import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { of, Observable } from "rxjs";
import { catchError } from "rxjs/operators";
import { Game } from "../../../common/Object/game";
import { GameListComponent } from "./game-list/game-list.component";

@Injectable({
  providedIn: "root",
})
export class GameService {

  private constructor(private http: HttpClient) { }

  private component: GameListComponent;
  public readonly BASE_URL: string = "https://localhost:3000/api/data-base/get-games";

  private convertTimeScores(seconds: number): number {
    const COEFFICIENT: number = 0.6;
    const MINUTE: number = 60;
    const DECIMALS: number = 2;
    seconds /= MINUTE;

    return Number((Math.floor(seconds) + ((seconds - Math.floor(seconds)) * COEFFICIENT)).toFixed(DECIMALS));
  }

  private buildHttpAdress(imageAdress: string): string {
    const ADRESS: string = "https://upload.wikimedia.org/wikipedia/commons/c/c9/";
    const EXTENSION: string = ".jpg";

    return (ADRESS + imageAdress + EXTENSION);
  }

  public convertScoresObject(game: Game[]): Game[] {
    // tslint:disable-next-line:forin
    for (const j in game) {
      game[j].originalImage = this.buildHttpAdress(game[j].originalImage);
      // tslint:disable-next-line:forin
      for (const i in game[j].bestSoloTimes) {
        game[j].bestSoloTimes[i].time = this.convertTimeScores(game[j].bestSoloTimes[i].time);
        game[j].bestMultiTimes[i].time = this.convertTimeScores(game[j].bestMultiTimes[i].time);
      }
    }

    return game;
  }

  public pushGames(gamesToPush: Game[]): void {
    for (const i in gamesToPush) {
      if (gamesToPush[i].isSimpleGame) {
        this.component.simpleGames.push(gamesToPush[i]);
      } else {
        this.component.freeGames.push(gamesToPush[i]);
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
