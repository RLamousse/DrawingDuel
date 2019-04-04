import {Component, Input} from "@angular/core";
import {MatDialog, MatDialogConfig} from "@angular/material";
import {Router} from "@angular/router";
import {ComponentNavigationError} from "../../../../../common/errors/component.errors";
import {GameType} from "../../../../../common/model/game/game";
import {IRecordTime} from "../../../../../common/model/game/record-time";
import {DeleteGameFormComponent} from "./delete-game-form/delete-game-form.component";
import {ResetGameFormComponent} from "./reset-game-form/reset-game-form.component";

@Component({
  selector: "app-game",
  templateUrl: "./game.component.html",
  styleUrls: ["./game.component.css"],
})

export class GameComponent {

  public constructor(private router: Router, private dialog: MatDialog) {}
  @Input() public gameName: string = "test";
  @Input() public bestSoloTimes: IRecordTime[];
  @Input() public bestMultiTimes: IRecordTime[];
  @Input() public originalImage: string;
  @Input() public modifiedImage: string;
  @Input() public thumbnail: string;
  @Input() public rightButton: string;
  @Input() public leftButton: string;
  @Input() public gameType: GameType;
  @Input() public simpleGameTag: GameType = GameType.SIMPLE;

  protected leftButtonClick(): void {
    if (this.leftButton === "jouer") {
      this.gameType === GameType.SIMPLE ? this.navigatePlayView() : this.navigateFreeView();
    } else if (this.leftButton === "supprimer") {
      const dialogConfig: MatDialogConfig = new MatDialogConfig();
      dialogConfig.autoFocus = true;
      dialogConfig.data = {gameName: this.gameName, gameType: this.gameType};
      this.dialog.open(DeleteGameFormComponent, dialogConfig);
    }
  }

  protected rightButtonClick(): void {
    if (this.rightButton === "joindre") {
      this.navigateAwait();
    } else if (this.rightButton === "reinitialiser") {
      const dialogConfig: MatDialogConfig = new MatDialogConfig();
      dialogConfig.autoFocus = true;
      dialogConfig.data = {gameName: this.gameName, gameType: this.gameType};
      this.dialog.open(ResetGameFormComponent, dialogConfig).afterClosed().subscribe(() => window.location.reload());
    }
  }

  private navigatePlayView(): void {

   this.router.navigate(["/play-view/"], {queryParams: {
      gameName: this.gameName, originalImage: this.originalImage, modifiedImage: this.modifiedImage, gameType: this.gameType },
    })
      // tslint:disable-next-line:no-any Generic error response
     .catch((reason: any) => {
       throw new ComponentNavigationError();
     });
  }

  private navigateFreeView(): void {
    this.router.navigate(["/3d-view/"], {
      queryParams: {
        gameName: this.gameName,
        gameType: this.gameType,
      },
    })
      // tslint:disable-next-line:no-any Generic error response
      .catch((reason: any) => {
        throw new ComponentNavigationError();
      });
  }

  private navigateAwait(): void {
    this.router.navigate(["/await-view/"], {queryParams: {
      gameName: this.gameName, gameType: this.gameType},
    })
      // tslint:disable-next-line:no-any Generic error response
     .catch((reason: any) => {
       throw new ComponentNavigationError();
     });
  }

}
