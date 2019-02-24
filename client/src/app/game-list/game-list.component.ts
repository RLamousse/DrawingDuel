
import { Component, Input, OnInit } from "@angular/core";
import { IFreeGame } from "../../../../common/model/game/free-game";
import { ISimpleGame } from "../../../../common/model/game/simple-game";
import { IExtendedFreeGame } from "../../../../common/model/game/extended-free-game";
import { GameService } from "../game.service";
import { MOCKED_FREE_GAMES, MOCKED_SIMPLE_GAMES } from "../mockGames";

@Component({
  selector: "app-game-list",
  templateUrl: "./game-list.component.html",
  styleUrls: ["./game-list.component.css"],
})

export class GameListComponent implements OnInit {

  @Input() protected readonly rightButton: string = "joindre";
  @Input() protected readonly leftButton: string = "jouer";
  public constructor (private gameService: GameService) {/*vide*/}

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
      this.gameService.extendedFreeGames = [];
      this.gameService.convertScoresObject(freeGamesToModify);
      this.gameService.convertScoresObject(MOCKED_FREE_GAMES);
      for (const test of MOCKED_FREE_GAMES) {
        this.gameService.extendedFreeGames.push(test);
      }
      console.log(this.gameService.extendedFreeGames);
      // for (const game of freeGamesToModify) {
      //   console.log(typeof game);
      //   //this.gameService.freeGames.push(game);
      // }
      for (const game of this.gameService.freeGames) {
        let newThumbnail: string = this.gameService.extractThumbnail(game.scenesTable);
        let extendedFreeGame: IExtendedFreeGame= {thumbnail: newThumbnail,
                                                  scenesTable: game.scenesTable,
                                                  gameName: game.gameName,
                                                  bestSoloTimes: game.bestSoloTimes,
                                                  bestMultiTimes: game.bestMultiTimes
                                                 };
        this.gameService.extendedFreeGames.push(extendedFreeGame);
      }
    });
  }

}
