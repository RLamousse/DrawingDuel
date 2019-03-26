import {Component, OnInit} from "@angular/core";
import {SimpleGameService} from "../simple-game/simple-game.service";

@Component({
             selector: "app-diff-counter",
             templateUrl: "./diff-counter.component.html",
             styleUrls: ["./diff-counter.component.css"],
           })
export class DiffCounterComponent implements OnInit {
  protected diffCount: number;

  public constructor(private simpleGameService: SimpleGameService) {
    this.diffCount = 0;
  }

  public ngOnInit(): void {
    this.simpleGameService.foundDifferencesCount.subscribe((differenceCount: number) => {
      this.diffCount = differenceCount;
    });
  }

}
