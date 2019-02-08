import { Component, Input } from "@angular/core";
import { Router, } from "@angular/router";

@Component({
  selector: "app-game",
  templateUrl: "./game.component.html",
  styleUrls: ["./game.component.css"],
})

export class GameComponent {

  public constructor(
    private router: Router,
  ) {/*vide*/}

  @Input() public gameName: string = "test";
  @Input() public bestSoloTimes: { name: string, time: number }[];
  @Input() public bestMultiTimes: { name: string, time: number }[];
  @Input() public originalImage: string = "test";
  @Input() public rightButton: string;
  @Input() public leftButton: string;

  protected leftButtonClick(): void {
    if (this.leftButton === "jouer") {
      this.router.navigate(["../play-view/"]).catch();
    }
  }
}
