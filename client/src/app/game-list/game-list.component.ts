import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { of, Observable } from "rxjs";
import { catchError } from "rxjs/operators";
import { Game } from "../../../../common/model/game";
import { GameComponent } from "./game/game.component";

@Component({
  selector: "app-game-list",
  templateUrl: "./game-list.component.html",
  styleUrls: ["./game-list.component.css"],
})

export class GameListComponent implements OnInit {
  public games: Array<Game> = [];
  public readonly BASE_URL: string = "https://localhost:3000/api/data-base/get-games";

  public constructor(private http: HttpClient) { }

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
    const game: Game = {title: "JEU1",
                        soloScores: [{name: names[0], time: scores[0]}, {name: names[1], time: scores[1]}, {name: names[2], time: scores[2]}],
                        duoScores: [{name: names[0], time: scores[0]}, {name: names[1], time: scores[1]}, {name: names[2], time: scores[2]}],
                        image: "https://upload.wikimedia.org/wikipedia/commons/c/c9/Moon.jpg",
                       };
    this.addGame(game);
    console.log(game.image);
    console.log(this.convertTimeScores(60));
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

  /*private convertScoresObject(game: Game): Game {
    for (const i in game.soloScores) {
      if (game.soloScores.hasOwnProperty(i)) {
        game.soloScores[i].time = this.convertTimeScores(game.soloScores[i].time);
        game.duoScores[i].time = this.convertTimeScores(game.duoScores[i].time);
      }
    }

    return game;
  }*/
}
