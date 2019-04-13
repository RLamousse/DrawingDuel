import {Component, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {GameType} from "../../../../common/model/game/game";
import {SimpleGameService} from "../simple-game/simple-game.service";
import {UNListService} from "../username.service";

@Component({
             selector: "app-play-view",
             templateUrl: "./play-view.component.html",
             styleUrls: ["./play-view.component.css"],
           })
export class PlayViewComponent implements OnInit {

  protected gameName: string;
  protected originalImage: string;
  protected modifiedImage: string;
  protected gameType: GameType;

  public constructor(private route: ActivatedRoute, private simpleGameService: SimpleGameService, private router: Router) {}

  public ngOnInit(): void {
    if ( !UNListService.username ) {
      this.router.navigate([""]).catch(( error: Error) => {
        throw error;
      });
    }
    this.route.queryParams.subscribe((params) => {
      this.gameName = params["gameName"];
      this.originalImage = params["originalImage"];
      this.modifiedImage = params["modifiedImage"];
      this.gameType = JSON.parse(params["gameType"]);

      this.simpleGameService.gameName = this.gameName;
    });
  }
}
