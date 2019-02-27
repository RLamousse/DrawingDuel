import { Component, OnInit, } from "@angular/core";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-play-view",
  templateUrl: "./play-view.component.html",
  styleUrls: ["./play-view.component.css"],
})
export class PlayViewComponent implements OnInit {

  public constructor(
    private route: ActivatedRoute, ) {}

  protected gameName: string;
  protected originalImage: string;
  protected modifiedImage: string;

  public ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.gameName = params["gameName"];
      this.originalImage = params["originalImage"];
      this.modifiedImage = params["modifiedImage"];
    });
  }

}
