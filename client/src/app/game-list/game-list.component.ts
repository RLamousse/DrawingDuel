
import { Component, Input, OnInit } from "@angular/core";
import {IGame} from "../../../../common/model/game/game";
import { GameService } from "../game.service";
import { MOCKED_SIMPLE_GAMES } from "../mockGames";

@Component({
  selector: "app-game-list",
  templateUrl: "./game-list.component.html",
  styleUrls: ["./game-list.component.css"],
})

export class GameListComponent implements OnInit {

  @Input() public rightButton: string = "joindre";
  @Input() public leftButton: string = "jouer";
  public constructor(private gameService: GameService) {/*vide*/}

  public ngOnInit(): void {
    this.gameService.getSimpleGames().subscribe((gamesToModify: IGame[]) => {
      this.gameService.convertScoresObject(gamesToModify);
      this.gameService.pushGames(gamesToModify);
      this.gameService.convertScoresObject(MOCKED_SIMPLE_GAMES);
      this.gameService.pushGames(MOCKED_SIMPLE_GAMES);
    });
  }
}
