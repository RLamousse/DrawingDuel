import { Component, OnInit } from "@angular/core";
import { ActivatedRoute} from "@angular/router";

@Component({
  selector: "app-play-view",
  templateUrl: "./play-view.component.html",
  styleUrls: ["./play-view.component.css"],
})
export class PlayViewComponent implements OnInit {

  public constructor(
  private route: ActivatedRoute, ) {/*vide*/ }

  public gameName: string;
  public originalImage: string = "http://localhost:3000/tiger.bmp";
  public ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.gameName = params["string"];
    });
  }
}
