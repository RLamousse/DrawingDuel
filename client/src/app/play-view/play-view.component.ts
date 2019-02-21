import {Component, OnInit} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {SimpleGameService} from "../simple-game.service";

@Component({
             selector: "app-play-view",
             templateUrl: "./play-view.component.html",
             styleUrls: ["./play-view.component.css"],
           })
export class PlayViewComponent implements OnInit {

  public gameName: string;
  public originalImage: string;
  public modifiedImage: string;

  public constructor(private route: ActivatedRoute, private simpleGameService: SimpleGameService) { /*vide*/
  }

  public ngOnInit(): void {
    this.simpleGameService.gameName = this.gameName;
    this.route.queryParams.subscribe((params) => {
      this.gameName = params["gameName"];
      this.originalImage = params["originalImage"];
      this.modifiedImage = params["modifiedImage"];
    });
  }
}
