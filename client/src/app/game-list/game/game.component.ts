import { Component, Input } from "@angular/core";
import { Router } from "@angular/router";
import { IScene } from "../../../../scene-interface";

@Component({
  selector: "app-game",
  templateUrl: "./game.component.html",
  styleUrls: ["./game.component.css"],
})

export class GameComponent {

  public constructor( private router: Router, ) {/*vide*/}

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
          this.router.navigate(["/3d-view/"], {
            queryParams: {
              gameName: this.gameName,
            },
          }).catch();
      }
    }
  }

}
