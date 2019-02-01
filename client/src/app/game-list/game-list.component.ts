import { Component, OnInit } from "@angular/core";
import { GameComponent } from "./game/game.component";
import { Game } from "../../../../common/model/game";

@Component({
  selector: "app-game-list",
  templateUrl: "./game-list.component.html",
  styleUrls: ["./game-list.component.css"],
})
export class GameListComponent implements OnInit {
  public games: Array<Game> = [];

  constructor() { }

  ngOnInit() {
    let game: Game = {title: "JEU",
                      soloScores: GameComponent.generateRandomScores(),
                      duoScores: GameComponent.generateRandomScores(),
                      soloNames: GameComponent.generateRandomNames(), 
                      duoNames: GameComponent.generateRandomNames(), 
                      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/LutraCanadensis_fullres.jpg/290px-LutraCanadensis_fullres.jpg"};
    this.addGame(game);
    console.log(this.games);
  }


  private addGame(game : Game) {
    this.games.push(game);
  }

}