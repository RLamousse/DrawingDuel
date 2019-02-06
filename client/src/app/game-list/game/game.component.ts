import { Component, Input, OnInit } from "@angular/core";

@Component({
  selector: "app-game",
  templateUrl: "./game.component.html",
  styleUrls: ["./game.component.css"],
})

export class GameComponent implements OnInit {

  public constructor() {/*vide*/}

  @Input() public gameName: string = "test";
  @Input() public bestSoloTimes: { name: string, time: number }[];
  @Input() public bestMultiTimes: { name: string, time: number }[];
  @Input() public originalImage: string = "test";

  public ngOnInit(): void {/*vide*/}
}
