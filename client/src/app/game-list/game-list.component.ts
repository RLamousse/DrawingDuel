
import { Component, Input, OnInit } from "@angular/core";
import { IFreeGame } from "../../../../common/model/game/free-game";
import { ISimpleGame } from "../../../../common/model/game/simple-game";
import { GameService } from "../game.service";
import { MOCKED_FREE_GAMES, MOCKED_SIMPLE_GAMES } from "../mockGames";
// import { FreeGameCreatorService } from "../../app/scene-creator/FreeGameCreator/free-game-creator.service";

@Component({
  selector: "app-game-list",
  templateUrl: "./game-list.component.html",
  styleUrls: ["./game-list.component.css"],
})

export class GameListComponent implements OnInit {

  @Input() protected readonly rightButton: string = "joindre";
  @Input() protected readonly leftButton: string = "jouer";
  public constructor(private gameService: GameService, /*private freeGameCreatorService: FreeGameCreatorService*/) {/*vide*/}

  public ngOnInit(): void {
    this.gameService.getSimpleGames().subscribe((simpleGamesToModify: ISimpleGame[]) => {
      this.gameService.simpleGames = [];
      this.gameService.convertScoresObject(simpleGamesToModify);
      this.gameService.convertScoresObject(MOCKED_SIMPLE_GAMES);
      for (const test of MOCKED_SIMPLE_GAMES) {
        this.gameService.simpleGames.push(test);
      }
      for (const game of simpleGamesToModify) {
        this.gameService.simpleGames.push(game);
      }
    });

    this.gameService.getFreeGames().subscribe((freeGamesToModify: IFreeGame[]) => {
      this.gameService.freeGames = [];
      this.gameService.convertScoresObject(MOCKED_FREE_GAMES);
      // for (const test of MOCKED_FREE_GAMES) {
      //   this.gameService.freeGames.push(test);
      // }
      // for (const game of freeGamesToModify) {
      //   this.gameService.freeGames.push(game);
      //   this.freeGameCreatorService.createScenes(game.scenesTable);
      // }
    });
  }

}
