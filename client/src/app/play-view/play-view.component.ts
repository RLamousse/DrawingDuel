import {Component, OnInit} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {GAMES_ROUTE} from "../../../../common/communication/routes";

@Component({
             selector: "app-play-view",
             templateUrl: "./play-view.component.html",
             styleUrls: ["./play-view.component.css"],
           })
export class PlayViewComponent implements OnInit {

  // @ts-ignore variable used in html
  private readonly BACK_BUTTON_ROUTE: string = GAMES_ROUTE;
  protected gameName: string;
  protected originalImage: string;
  protected modifiedImage: string;

  public constructor(private route: ActivatedRoute) {}

  public ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.gameName = params["gameName"];
      this.originalImage = params["originalImage"];
      this.modifiedImage = params["modifiedImage"];
    });
  }
}
