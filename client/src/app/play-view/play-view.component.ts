import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-play-view",
  templateUrl: "./play-view.component.html",
  styleUrls: ["./play-view.component.css"],
})
export class PlayViewComponent implements OnInit {

  public constructor() {/*vide*/ }
  private chronoPlaceHolder: string = "00:00";
  public gameName: string = "sup";
  public ngOnInit(): void {/*vide*/ }

}
