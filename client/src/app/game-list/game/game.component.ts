import {Component, Input} from "@angular/core";
import {MatDialog, MatDialogConfig} from "@angular/material";
import {Router} from "@angular/router";
import {IRecordTime} from "../../../../../common/model/game/record-time";
import {ReinitialiserFormComponent} from "./reinitialiser-form/reinitialiser-form.component";
import {SupprimerFormComponent} from "./supprimer-form/supprimer-form.component";
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
  @Input() public isSimpleGame: boolean;

  protected leftButtonClick(): void {
    if (this.leftButton === "jouer") {
      this.isSimpleGame ? this.navigatePlayView() : this.navigateFreeView();
    }
  }

  private navigatePlayView(): void {
   this.router.navigate(["/play-view/"], {queryParams: {
      gameName: this.gameName, originalImage: this.originalImage, modifiedImage: this.modifiedImage },
    })
      // tslint:disable-next-line:no-any Generic error response
     .catch((reason: any) => {
       throw new Error(reason);
     });
  }

  private navigateFreeView(): void {
    this.router.navigate(["/3d-view/"], {
      queryParams: {
        gameName: this.gameName,
      },
    })
      // tslint:disable-next-line:no-any Generic error response
      .catch((reason: any) => {
        throw new Error(reason);
      });
  }

}
