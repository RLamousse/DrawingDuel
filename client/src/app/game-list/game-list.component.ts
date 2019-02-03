import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { of, Observable } from "rxjs";
import { catchError } from "rxjs/operators";
import { Game } from "../../../../common/Object/game";
import { GameComponent } from "./game/game.component";

@Component({
  selector: "app-game-list",
  templateUrl: "./game-list.component.html",
  styleUrls: ["./game-list.component.css"],
})

export class GameListComponent implements OnInit {
  public games: Array<Game> = [];
  public readonly BASE_URL: string = "https://localhost:3000/api/data-base/get-games";

  public constructor(private http: HttpClient) {/*vide*/}

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

  public ngOnInit(): void {
    const scores: number[] = GameComponent.generateRandomScores();
    const names: string[] = GameComponent.generateRandomNames();
    const game: Game = {gameName: "JEU1",
                        bestSoloTimes: [{name: names[0], time: scores[0]},
                                        {name: names[1], time: scores[1]}, {name: names[2], time: scores[2]}],
                        bestMultiTimes: [{name: names[0], time: scores[0]},
                                         {name: names[1], time: scores[1]}, {name: names[2], time: scores[2]}],
                        originalImage: "https://upload.wikimedia.org/wikipedia/commons/c/c9/Moon.jpg",
                        modifiedImage: "https://upload.wikimedia.org/wikipedia/commons/c/c9/Moon.jpg",
                       };
    this.addGame(game);
    console.log(game.originalImage);
    console.log(this.convertTimeScores(60));
    this.getGames().subscribe((gameToModify) => {
      this.convertScoresObject(gameToModify);
      this.games = gameToModify;
    });
  }

  private addGame(game: Game): void {
    this.games.push(game);
  }

  private convertTimeScores(seconds: number): number {
    const coefficient: number = 0.6;
    const minute: number = 60;
    seconds /= minute;

    return (Math.floor(seconds) + ((seconds - Math.floor(seconds)) * coefficient));
  }

  private convertScoresObject(game: Game[]): Game[] {
    for (const j in game) {
      if (game.hasOwnProperty(j)) {
        for (const i in game[j].bestSoloTimes) {
          if (game[j].bestSoloTimes.hasOwnProperty(i)) {
            game[j].bestSoloTimes[i].time = this.convertTimeScores(game[j].bestSoloTimes[i].time);
            game[j].bestMultiTimes[i].time = this.convertTimeScores(game[j].bestMultiTimes[i].time);
          }
        }
      }
    }

    return game;
  }
}
