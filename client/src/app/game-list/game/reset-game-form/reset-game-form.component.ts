import { Component, Inject } from "@angular/core";
import {MatDialogRef, MAT_DIALOG_DATA} from "@angular/material/dialog";
import {Router} from "@angular/router";
import {IDialogData} from "../../../../../../common/dialog-data-interface/IDialogData";
import {ComponentNavigationError} from "../../../../../../common/errors/component.errors";
import {GameService} from "../../../game.service";

@Component({
  selector: "app-reset-game-form",
  templateUrl: "./reset-game-form.component.html",
  styleUrls: ["./reset-game-form.component.css"],
})
export class ResetGameFormComponent {

  public constructor (protected dialogRef: MatDialogRef<ResetGameFormComponent>,
                      @Inject(MAT_DIALOG_DATA) public data: IDialogData,
                      private router: Router,
                      private gameService: GameService) {}

  public exit(message: Object = { status: "cancelled" }): void {
    this.dialogRef.close(message);
    window.location.reload();
  }
  public resetGame(): void {
    this.gameService.resetGameTime(this.data.gameName);
    this.dialogRef.close();
    this.router.navigate(["/admin/"])
      .catch(() => {
        throw new ComponentNavigationError();
    });
  }
}
