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
    const game: Game = {title: "JEU",
                        soloScores: GameComponent.generateRandomScores(),
                        duoScores: GameComponent.generateRandomScores(),
                        soloNames: GameComponent.generateRandomNames(),
                        duoNames: GameComponent.generateRandomNames(),
                        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/LutraCanadensis_fullres.jpg/290px-LutraCanadensis_fullres.jpg"};
    this.addGame(game);
    console.log(this.convertTimeScores(3456));
  }

  private addGame(game: Game): void {
    this.games.push(game);
  }

  private convertTimeScores(seconds: number): number {
    const coefficient: number = 0.6;
    seconds *= coefficient;
    const remaining: number = seconds - Math.floor(seconds);

    return (Math.floor(seconds) + (remaining * coefficient));
  }
}
