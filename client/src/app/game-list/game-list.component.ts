import { Component, Input, OnInit } from "@angular/core";
import {forkJoin} from "rxjs";
import { GameService } from "../game.service";

@Component({
  selector: "app-game-list",
  templateUrl: "./game-list.component.html",
  styleUrls: ["./game-list.component.css"],
})

export class GameListComponent implements OnInit {

  @Input() protected readonly rightButton: string = "joindre";
  @Input() protected readonly leftButton: string = "jouer";
  protected pushedSimpleGames: boolean;
  protected pushedFreeGames: boolean;

  public constructor(private gameService: GameService) {
    this.pushedSimpleGames = false;
    this.pushedFreeGames = false;
  }

  public ngOnInit(): void {
    forkJoin(this.gameService.getSimpleGames(), this.gameService.getFreeGames()).subscribe(([simpleGames, freeGames]) => {
      this.pushedSimpleGames = true;

      this.gameService.pushSimpleGames(simpleGames);
      this.gameService.pushFreeGames(freeGames).catch((value: Error) => {throw value; });
      this.gameService.updateFreeGameImages().catch((value: Error) => {throw value; });
    });
  }

}
