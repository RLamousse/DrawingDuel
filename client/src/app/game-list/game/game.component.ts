import { Component, Input } from "@angular/core";
import { Router } from "@angular/router";
import { IFreeGame } from "../../../../../common/model/game/free-game";
import { IScene } from "../../../../scene-interface";
import { GameService } from "../../game.service";
import { FreeGameCreatorService} from "../../scene-creator/FreeGameCreator/free-game-creator.service";

@Component({
  selector: "app-game",
  templateUrl: "./game.component.html",
  styleUrls: ["./game.component.css"],
})

export class GameComponent {

  public constructor( private router: Router, private freeGameCreator: FreeGameCreatorService,
                      private gameService: GameService, ) {/*vide*/}

  @Input() public gameName: string = "test";
  @Input() public bestSoloTimes: { name: string, time: number }[];
  @Input() public bestMultiTimes: { name: string, time: number }[];
  @Input() public originalImage: string;
  @Input() public modifiedImage: string;
  @Input() public thumbnail: string;
  @Input() public rightButton: string;
  @Input() public leftButton: string;
  @Input() public isSimpleGame: boolean;
  protected freeScenes: IScene;

  protected leftButtonClick(): void {
    if (this.leftButton === "jouer") {
      if (this.isSimpleGame) {
        this.router.navigate(["/play-view/"], {queryParams: {
          isSimpleGame : this.isSimpleGame, gameName: this.gameName,
          originalImage: this.originalImage, modifiedImage: this.modifiedImage },
        }).catch();
      } else {
        this.verifyGame().then((done) => {
          console.log(this.freeScenes);
          this.router.navigate(["/3d-view/"], {
            queryParams: {
              isSimpleGame: this.isSimpleGame, gameName: this.gameName,
              freeScenes: this.freeScenes
            },
          }).catch();
        });
      }
    }
  }

  private async verifyGame(): Promise<void> {
    if (!this.isSimpleGame) {
      await this.gameService.getFreeGameByName(this.gameName).subscribe((freeGame: IFreeGame) => {
        console.log(freeGame);
        this.freeScenes = this.freeGameCreator.createScenes(freeGame.scenes);
      });
    }
  }
}
