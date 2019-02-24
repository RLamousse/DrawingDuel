import {Component, OnInit} from "@angular/core";
import {SimpleGameService} from "../simple-game/simple-game.service";

@Component({
             selector: "app-compteur-diff",
             templateUrl: "./compteur-diff.component.html",
             styleUrls: ["./compteur-diff.component.css"],
           })
export class CompteurDiffComponent implements OnInit {
  protected diffNumber: number;

  public constructor(private simpleGameService: SimpleGameService) {
    this.diffNumber = 0;
  }

  public ngOnInit(): void {
    this.simpleGameService.foundDifferencesCount.subscribe((differenceCount: number) => {
      this.diffNumber = differenceCount;
    });
  }

}
