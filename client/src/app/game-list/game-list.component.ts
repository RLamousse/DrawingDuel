
import { Component, Input, OnInit } from "@angular/core";
import { Game } from "../../../../common/model/game";
import { GameService } from "../game.service";
import { MOCKMIXGAMELIST } from "../mockGames";

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
    this.gameService.freeGames = [];
    this.gameService.simpleGames = [];
    this.gameService.getGames().subscribe((gamesToModify: Game[]) => {
      this.gameService.convertScoresObject(gamesToModify);
      this.gameService.pushGames(gamesToModify);
      this.gameService.convertScoresObject(MOCKMIXGAMELIST);
      this.gameService.pushGames(MOCKMIXGAMELIST);
    });
  }

}
