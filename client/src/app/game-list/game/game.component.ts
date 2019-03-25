import {Component, Input} from "@angular/core";
import {MatDialog, MatDialogConfig} from "@angular/material";
import {Router} from "@angular/router";
import {IRecordTime} from "../../../../../common/model/game/record-time";
import {DeleteGameFormComponent} from "./delete-game-form/delete-game-form.component";
import {ResetGameFormComponent} from "./reset-game-form/reset-game-form.component";

@Component({
  selector: "app-game",
  templateUrl: "./game.component.html",
  styleUrls: ["./game.component.css"],
})

export class GameComponent {

  private isDeleted: boolean;

  @Input() public gameName: string = "test";
  @Input() public bestSoloTimes: IRecordTime[];
  @Input() public bestMultiTimes: IRecordTime[];
  @Input() public originalImage: string;
  @Input() public modifiedImage: string;
  @Input() public thumbnail: string;
  @Input() public rightButton: string;
  @Input() public leftButton: string;
  @Input() public isSimpleGame: boolean;

  protected leftButtonClick(): void {
    if (this.leftButton === "jouer") {
      this.isSimpleGame ? this.navigatePlayView() : this.navigateFreeView();
    } else if (this.leftButton === "supprimer") {
      const dialogConfig: MatDialogConfig = new MatDialogConfig();
      dialogConfig.autoFocus = true;
      dialogConfig.data = {gameName: this.gameName, isSimpleGame: this.isSimpleGame};
      this.dialog.open(DeleteGameFormComponent, dialogConfig);
    }
  }

  protected rightButtonClick(): void {
    if (this.rightButton === "joindre") {
      this.isDeleted ? this.openGameDeletedDialog() : this.navigateAwait();
    } else if (this.rightButton === "reinitialiser") {
      const dialogConfig: MatDialogConfig = new MatDialogConfig();
      dialogConfig.autoFocus = true;
      dialogConfig.data = {gameName: this.gameName, isSimpleGame: this.isSimpleGame};
      this.dialog.open(ResetGameFormComponent, dialogConfig).afterClosed().subscribe(() => window.location.reload());
    }
  }

  private navigatePlayView(): void {
   this.router.navigate(["/play-view/"], {queryParams: {
      gameName: this.gameName, originalImage: this.originalImage, modifiedImage: this.modifiedImage, isDeleted: this.isDeleted },
    })
      // tslint:disable-next-line:no-any Generic error response
     .catch((reason: any) => {
       throw new Error(reason);
     });
  }

  private navigateFreeView(): void {
    this.router.navigate(["/3d-view/"], {
      queryParams: {
        gameName: this.gameName, isDeleted: this.isDeleted,
      },
    })
      // tslint:disable-next-line:no-any Generic error response
      .catch((reason: any) => {
        throw new Error(reason);
      });
  }

  private navigateAwait(): void {
    this.router.navigate(["/await-view/"], {queryParams: {
      gameName: this.gameName, gameType: this.isSimpleGame},
    })
      // tslint:disable-next-line:no-any Generic error response
     .catch((reason: any) => {
       throw new Error(reason);
     });
  }

}
