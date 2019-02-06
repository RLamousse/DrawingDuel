import { Component, OnInit } from "@angular/core";
import { GameService } from "../../app/game.service";
import { Game } from "../../../../common/Object/game";

@Component({
  selector: "app-game-list",
  templateUrl: "./game-list.component.html",
  styleUrls: ["./game-list.component.css"],
})

export class GameListComponent implements OnInit {

  public constructor(private gameService: GameService) {/*vide*/}

  public ngOnInit(): void {
    this.gameService.getGames().subscribe((gamesToModify: Game[]) => {
      this.gameService.convertScoresObject(gamesToModify);
      this.gameService.pushGames(gamesToModify);
    });
  }
}
