import { Component, OnInit } from "@angular/core";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: "app-await-view",
  templateUrl: "./await-view.component.html",
  styleUrls: ["./await-view.component.css"],
})
export class AwaitViewComponent implements OnInit {

  protected gameName: string;
  protected isSimpleGame: boolean;

  public constructor(private route: ActivatedRoute) {/*vide*/}

  public ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.gameName = params["gameName"];
      this.isSimpleGame = params["gameType"];
    });

  }
}
