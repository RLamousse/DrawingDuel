import {Component, OnInit} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {GAMES_ROUTE} from "../../../../common/communication/routes";
import {GameType} from "../../../../common/model/game/game";
import {SimpleGameService} from "../simple-game/simple-game.service";

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
  protected gameType: GameType;

  public constructor(private route: ActivatedRoute, private simpleGameService: SimpleGameService) {}

  public ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.gameName = params["gameName"];
      this.originalImage = params["originalImage"];
      this.modifiedImage = params["modifiedImage"];
      this.gameType = JSON.parse(params["gameType"]);

      this.simpleGameService.gameName = this.gameName;
    });
  }
}
