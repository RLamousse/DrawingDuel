import { Component, Input, OnInit } from "@angular/core";
import { forkJoin } from "rxjs";
import {GameType} from "../../../../common/model/game/game";
import { GameService } from "../game.service";

@Component({
  selector: "app-game-list",
  templateUrl: "./game-list.component.html",
  styleUrls: ["./game-list.component.css"],
})

export class GameListComponent implements OnInit {

  @Input() protected  readonly simpleGameTag: GameType = GameType.SIMPLE;
  @Input() protected  readonly freeGameTag: GameType = GameType.FREE;
  @Input() protected readonly rightButton: string = "Joindre";
  @Input() protected readonly leftButton: string = "Jouer";
  protected pushedGames: boolean;

  public constructor(private gameService: GameService) {
    this.pushedGames = false;
  }

  public ngOnInit(): void {
    forkJoin(this.gameService.getSimpleGames(), this.gameService.getFreeGames()).subscribe(([simpleGames, freeGames]) => {
      this.gameService.pushSimpleGames(simpleGames);
      this.gameService.pushFreeGames(freeGames);
      this.pushedGames = true;
    });
  }

}
