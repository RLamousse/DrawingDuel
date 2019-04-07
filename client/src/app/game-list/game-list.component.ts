import { Component, Input, OnInit } from "@angular/core";
import { forkJoin } from "rxjs";
import {GameType} from "../../../../common/model/game/game";
import { GameService } from "../game.service";
import {RoomService} from "../room.service";
import {GameButtonOptions} from "./game/game-button-enum";

@Component({
  selector: "app-game-list",
  templateUrl: "./game-list.component.html",
  styleUrls: ["./game-list.component.css"],
})

export class GameListComponent implements OnInit {

  @Input() protected readonly rightButton: string = GameButtonOptions.JOIN;
  @Input() protected readonly leftButton: string = GameButtonOptions.PLAY;
  @Input() protected  readonly simpleGameTag: GameType = GameType.SIMPLE;
  @Input() protected  readonly freeGameTag: GameType = GameType.FREE;
  protected pushedGames: boolean;

  public constructor(private gameService: GameService,
                     private roomService: RoomService) {
    this.pushedGames = false;
  }

  public ngOnInit(): void {
    forkJoin(this.gameService.getSimpleGames(), this.gameService.getFreeGames()).subscribe(([simpleGames, freeGames]) => {
      this.gameService.pushSimpleGames(simpleGames);
      this.gameService.pushFreeGames(freeGames);
      this.gameService.updateFreeGameImages().catch((value: Error) => {throw value; });
      this.pushedGames = true;
    });
    this.roomService.checkOutRoom();
  }

}
