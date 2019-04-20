import { Component, Inject } from "@angular/core";
import {MatDialogRef, MAT_DIALOG_DATA} from "@angular/material/dialog";
import {IDialogData} from "../../../../../../common/dialog-data-interface/IDialogData";
import {DialogStatus} from "../../../dialog-utils";
import {GameService} from "../../../game.service";

@Component({
  selector: "app-reset-game-form",
  templateUrl: "./reset-game-form.component.html",
  styleUrls: ["./reset-game-form.component.css"],
})
export class ResetGameFormComponent {

  public constructor (protected dialogRef: MatDialogRef<ResetGameFormComponent>,
                      @Inject(MAT_DIALOG_DATA) public data: IDialogData,
                      private gameService: GameService) {}

  public exit(): void {
    this.dialogRef.close(DialogStatus.CANCEL);
  }
  public resetGame(): void {
    this.gameService.resetGameTime(this.data.gameName).then(() => {
      this.dialogRef.close(DialogStatus.DONE);
    }).catch((error: Error) => {
      throw error;
    });
  }
}
