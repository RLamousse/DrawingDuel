import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-play-view",
  templateUrl: "./play-view.component.html",
  styleUrls: ["./play-view.component.css"],
})
export class PlayViewComponent implements OnInit {

  private chronoPlaceHolder: string = "00:00";
  public constructor() {/*vide*/ }

  public ngOnInit(): void{}
}
