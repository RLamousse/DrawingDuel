import {Component, OnInit} from "@angular/core";
import {SceneRendererService} from "../scene-creator/scene-renderer.service";
import {SimpleGameService} from "../simple-game/simple-game.service";

@Component({
             selector: "app-compteur-diff",
             templateUrl: "./compteur-diff.component.html",
             styleUrls: ["./compteur-diff.component.css"],
           })
export class CompteurDiffComponent implements OnInit {
  protected diffNumber: number;

  public constructor(private simpleGameService: SimpleGameService, private sceneRendererService: SceneRendererService) {
    this.diffNumber = 0;
  }

  public ngOnInit(): void {
    if (this.simpleGameService !== undefined) {
      this.simpleGameService.foundDifferencesCount.subscribe((differenceCount: number) => {
        this.diffNumber = differenceCount;
      });
    } else if (this.sceneRendererService !== undefined) {
      this.sceneRendererService.foundDifferenceCount.subscribe((differenceCount: number) => {
        this.diffNumber = differenceCount;
      });
    }
  }

}
