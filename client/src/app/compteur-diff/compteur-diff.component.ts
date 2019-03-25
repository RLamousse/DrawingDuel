import {Component, Input, OnInit} from "@angular/core";
import {SimpleGameService} from "../simple-game/simple-game.service";
import {UNListService} from "../username.service";
@Component({
             selector: "app-compteur-diff",
             templateUrl: "./compteur-diff.component.html",
             styleUrls: ["./compteur-diff.component.css"],
           })
export class CompteurDiffComponent implements OnInit {
  protected diffNumber: number;
  protected gameDeleted: boolean;
  @Input() public gameName: string;
  @Input() public minutes: number;
  @Input() public seconds: number;
  @Input() public isDeleted: boolean;
  private readonly MAX_DIFF_NUM: number = 7;

  public constructor(private simpleGameService: SimpleGameService) {
    this.diffNumber = 0;
  }

  public ngOnInit(): void {
    this.simpleGameService.foundDifferencesCount.subscribe((differenceCount: number) => {
      this.diffNumber = differenceCount;
      if (this.diffNumber === this.MAX_DIFF_NUM) {
        this.endGame();
      }
    });
  }

  private endGame(): void {
    if (this.isDeleted) {/* */
      console.log(UNListService.username);

    } else {/* */}
  }

}
