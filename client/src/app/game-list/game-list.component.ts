import {Component, Input, OnInit} from "@angular/core";
import {IFreeGame} from "../../../../common/model/game/free-game";
import {GameType} from "../../../../common/model/game/game";
import {ISimpleGame} from "../../../../common/model/game/simple-game";
import {GameService} from "../game.service";

@Component({
  selector: "app-game-list",
  templateUrl: "./game-list.component.html",
  styleUrls: ["./game-list.component.css"],
})

export class GameListComponent implements OnInit {

  @Input() protected  readonly simpleGameTag: GameType = GameType.SIMPLE;
  @Input() protected  readonly freeGameTag: GameType = GameType.FREE;
  @Input() protected readonly rightButton: string = "joindre";
  @Input() protected readonly leftButton: string = "jouer";

  public constructor(private gameService: GameService) {
  }

  public ngOnInit(): void {
    this.gameService.getSimpleGames().subscribe((simpleGamesToPush: ISimpleGame[]) => {
      this.gameService.pushSimpleGames(simpleGamesToPush);
    });

    this.gameService.getFreeGames().subscribe((freeGamesToPush: IFreeGame[]) => {
      this.gameService.pushFreeGames(freeGamesToPush).catch((value: Error) => {throw value; });
      this.gameService.updateFreeGameImages().catch((value: Error) => {throw value; });
    });
  }

}
