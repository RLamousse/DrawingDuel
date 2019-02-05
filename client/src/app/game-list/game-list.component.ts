import { Component, OnInit } from "@angular/core";
import { Game } from "../../../../common/Object/game";
import { GameService } from "../../app/game.service";
import { GameComponent } from "./game/game.component";

@Component({
  selector: "app-game-list",
  templateUrl: "./game-list.component.html",
  styleUrls: ["./game-list.component.css"],
})

export class GameListComponent implements OnInit {
  public simpleGames: Game[] = [];
  public freeGames: Game[] = [];

  public constructor(private gameService: GameService) {/*vide*/}

  public ngOnInit(): void {
    const scores: number[] = GameComponent.generateRandomScores();
    const names: string[] = GameComponent.generateRandomNames();
    const game1: Game = {isSimpleGame: true,
                         gameName: "JEU1",
                         originalImage: "https://upload.wikimedia.org/wikipedia/commons/c/c9/Moon.jpg",
                         modifiedImage: "https://upload.wikimedia.org/wikipedia/commons/c/c9/Moon.jpg",
                         bestSoloTimes: [{name: names[0], time: scores[0]},
                                         {name: names[1], time: scores[1]}, {name: names[2], time: scores[2]}],
                         bestMultiTimes: [{name: names[0], time: scores[0]},
                                          {name: names[1], time: scores[1]}, {name: names[2], time: scores[2]}],
                        };
    const game2: Game = {isSimpleGame: true,
                         gameName: "JEU2",
                         originalImage: "Moon",
                         modifiedImage: "Moon",
                         bestSoloTimes: [{name: names[0], time: 1170},
                                         {name: names[1], time: 1180}, {name: names[2], time: 1250}],
                         bestMultiTimes: [{name: names[0], time: 1750},
                                          {name: names[1], time: 1756}, {name: names[2], time: 1896}],
                        };
    this.simpleGames.push(game2);
    this.gameService.convertScoresObject(this.simpleGames);
    this.simpleGames.push(game1);
    this.freeGames.push(game1);
    this.gameService.getGames().subscribe((gamesToModify) => {
      this.gameService.convertScoresObject(gamesToModify);
      this.gameService.pushGames(gamesToModify);
    });
  }
}
