import { Component, Input } from "@angular/core";
import { Router } from "@angular/router";

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

  protected leftButtonClick(): void {
    if (this.leftButton === "jouer") {
      this.isSimpleGame ? this.navigatePlayView() : this.navigateFreeView();
    }
  }

  protected navigatePlayView(): void {
   this.router.navigate(["/play-view/"], {queryParams: {
      isSimpleGame : this.isSimpleGame, gameName: this.gameName,
      originalImage: this.originalImage, modifiedImage: this.modifiedImage },
    }).catch();
  }

  protected navigateFreeView(): void {
    this.router.navigate(["/3d-view/"], {
      queryParams: {
        gameName: this.gameName,
      },
    }).catch();
  }

}
