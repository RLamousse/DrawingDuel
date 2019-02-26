
import { Component, Input, OnInit } from "@angular/core";
import { IExtendedFreeGame } from "../../../../common/model/game/extended-free-game";
import { IFreeGame } from "../../../../common/model/game/free-game";
import { ISimpleGame } from "../../../../common/model/game/simple-game";
import { IScene } from "../../../scene-interface";
import { GameService } from "../game.service";
import { FreeGameCreatorService } from "../scene-creator/FreeGameCreator/free-game-creator.service";
import { FreeGamePhotoService } from "../scene-creator/free-game-photo-service/free-game-photo.service";

@Component({
  selector: "app-game-list",
  templateUrl: "./game-list.component.html",
  styleUrls: ["./game-list.component.css"],
})

export class GameListComponent implements OnInit {

  @Input() protected readonly rightButton: string = "joindre";
  @Input() protected readonly leftButton: string = "jouer";
  public constructor(
    private gameService: GameService,
    private photoService: FreeGamePhotoService,
    private freeGameCreatorService: FreeGameCreatorService,
  ) {}

  public ngOnInit(): void {
    this.gameService.getSimpleGames().subscribe((simpleGamesToModify: ISimpleGame[]) => {
      this.gameService.simpleGames = [];
      this.gameService.convertScoresObject(simpleGamesToModify);
      for (const game of simpleGamesToModify) {
        this.gameService.simpleGames.push(game);
      }
    });

    this.gameService.getFreeGames().subscribe((freeGamesToModify: IFreeGame[]) => {
      this.gameService.freeGames = [];
      this.gameService.extendedFreeGames = [];
      this.gameService.convertScoresObject(freeGamesToModify);
      for (const game of freeGamesToModify) {
         this.gameService.freeGames.push(game);
      }
      for (const game of this.gameService.freeGames) {
        const scenes: IScene = this.freeGameCreatorService.createScenes(game.scenes);
        const extendedFreeGame: IExtendedFreeGame = {
                                                  thumbnail: this.photoService.takePhoto(scenes.scene),
                                                  scenes: game.scenes,
                                                  gameName: game.gameName,
                                                  bestSoloTimes: game.bestSoloTimes,
                                                  bestMultiTimes: game.bestMultiTimes,
                                                 };
        this.gameService.extendedFreeGames.push(extendedFreeGame);
      }
    });
  }

}
