import {Component, Input, OnDestroy, OnInit} from "@angular/core";
import {Router} from "@angular/router";
import {forkJoin, Subscription} from "rxjs";
import {GAMES_ROUTE, HOME_ROUTE} from "../../../../common/communication/routes";
import {GameType} from "../../../../common/model/game/game";
import { GameService } from "../game.service";
import {RoomService} from "../room.service";
import {GameButtonOptions} from "./game/game-button-enum";

@Component({
  selector: "app-game-list",
  templateUrl: "./game-list.component.html",
  styleUrls: ["./game-list.component.css"],
})

export class GameListComponent implements OnInit, OnDestroy {

  protected readonly HOME_BUTTON_ROUTE: string = HOME_ROUTE;
  protected readonly GAME_LIST_ROUTE: string = GAMES_ROUTE;

  @Input() protected readonly rightButton: string = GameButtonOptions.JOIN;
  @Input() protected readonly leftButton: string = GameButtonOptions.PLAY;
  @Input() protected  readonly simpleGameTag: GameType = GameType.SIMPLE;
  @Input() protected  readonly freeGameTag: GameType = GameType.FREE;

  protected pushedGames: boolean;
  private gameSub: Subscription;

  public constructor(private gameService: GameService,
                     private roomService: RoomService,
                     public router: Router) {
    this.pushedGames = false;
  }

  public ngOnInit(): void {
    this.joinGames();
    this.roomService.fetchRoomsStatus();
    this.roomService.checkOutRoom();
  }

  public joinGames(): void {
    this.gameSub = forkJoin(this.gameService.getSimpleGamesLite(), this.gameService.getFreeGamesLite())
      .subscribe(([simpleGames, freeGames]) => {
      this.gameService.pushSimpleGames(simpleGames);
      this.gameService.pushFreeGames(freeGames);
      this.pushedGames = true;
    });
  }

  public reloadGameList(): void {
   this.ngOnInit();
  }

  public ngOnDestroy(): void {
    this.gameSub.unsubscribe();
  }
}
