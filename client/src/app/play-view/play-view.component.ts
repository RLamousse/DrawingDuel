import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-play-view",
  templateUrl: "./play-view.component.html",
  styleUrls: ["./play-view.component.css"],
})
export class PlayViewComponent implements OnInit {

  public constructor() {/*vide*/ }
  public gameName: string = "sup";
  public originalImage: string = "http://localhost:3000/tiger.bmp";
  public ngOnInit(): void {/*vide*/ }
}
