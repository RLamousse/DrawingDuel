import { Component, Input, OnInit } from "@angular/core";
import { Game } from "../../../../../common/object/game";

@Component({
  selector: "app-game",
  templateUrl: "./game.component.html",
  styleUrls: ["./game.component.css"],
})

export class GameComponent implements OnInit {

  public constructor() {/*vide*/}

  @Input() public gameName: string;
  @Input() public bestSoloTimes: Game[];
  @Input() public bestMultiTimes: Game[];
  @Input() public originalImage: string;

  public ngOnInit(): void {/*vide*/}
}
