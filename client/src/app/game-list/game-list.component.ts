
import { Component, Input, OnInit } from "@angular/core";
import { ISimpleGame } from "../../../../common/model/game/simple-game";
import { GameService } from "../game.service";
import { MOCKED_FREE_GAMES, MOCKED_SIMPLE_GAMES } from "../mockGames";

@Component({
  selector: "app-game-list",
  templateUrl: "./game-list.component.html",
  styleUrls: ["./game-list.component.css"],
})

export class GameListComponent implements OnInit {

  @Input() protected readonly rightButton: string = "joindre";
  @Input() protected readonly leftButton: string = "jouer";
  public constructor(private gameService: GameService) {/*vide*/}

  public ngOnInit(): void {
    this.gameService.getSimpleGames().subscribe((gamesToModify: ISimpleGame[]) => {
      this.gameService.freeGames = [];
      this.gameService.simpleGames = [];
      this.gameService.convertScoresObject(gamesToModify);
      this.gameService.pushGames(gamesToModify);
      this.gameService.convertScoresObject(MOCKED_SIMPLE_GAMES);
      this.gameService.pushGames(MOCKED_SIMPLE_GAMES);
      this.gameService.convertScoresObject(MOCKED_FREE_GAMES);
      this.gameService.pushGames(MOCKED_FREE_GAMES);
    });
  }

}
