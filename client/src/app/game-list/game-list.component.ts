import { Component, Input, OnInit } from "@angular/core";
import {Router} from "@angular/router";
import { forkJoin } from "rxjs";
import {GameType} from "../../../../common/model/game/game";
import { GameService } from "../game.service";
import {UNListService} from "../username.service";

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

  public constructor(private gameService: GameService, private router: Router) {
    this.pushedGames = false;
  }

  public ngOnInit(): void {
    if ( !UNListService.username ) {
      this.router.navigate([""]).catch(( error: Error) => {
        throw error;
      });
    }
    forkJoin(this.gameService.getSimpleGames(), this.gameService.getFreeGames()).subscribe(([simpleGames, freeGames]) => {
      this.gameService.pushSimpleGames(simpleGames);
      this.gameService.pushFreeGames(freeGames);
      this.gameService.updateFreeGameImages().catch((value: Error) => {throw value; });
      this.pushedGames = true;
    });
  }

}
