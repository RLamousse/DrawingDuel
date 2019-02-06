import { Component, OnInit } from "@angular/core";
import { Game } from "../../../../common/Object/game";
import { GameService } from "../../app/game.service";

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
