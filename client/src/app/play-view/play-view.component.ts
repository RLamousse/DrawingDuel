import {Component, OnInit} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {SimpleGameService} from "../simple-game/simple-game.service";

@Component({
             selector: "app-play-view",
             templateUrl: "./play-view.component.html",
             styleUrls: ["./play-view.component.css"],
           })
export class PlayViewComponent implements OnInit {

  private _gameName: string;
  protected originalImage: string;
  protected modifiedImage: string;

  public constructor(private route: ActivatedRoute, private simpleGameService: SimpleGameService) { /*vide*/
  }

  public ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this._gameName = params["gameName"];
      this.originalImage = params["originalImage"];
      this.modifiedImage = params["modifiedImage"];

      this.simpleGameService.gameName = this._gameName;
    });
  }
}
