import { Component, Inject } from "@angular/core";
import {MatDialogRef, MAT_DIALOG_DATA} from "@angular/material/dialog";
import {Router} from "@angular/router";
import {IDialogData} from "../../../../../../common/dialog-data-interface/IDialogData";

@Component({
  selector: "app-reset-game-form",
  templateUrl: "./reset-game-form.component.html",
  styleUrls: ["./reset-game-form.component.css"],
})
export class ResetGameFormComponent {

  public constructor (protected dialogRef: MatDialogRef<ResetGameFormComponent>,
                      @Inject(MAT_DIALOG_DATA) public data: IDialogData,
                      private router: Router) {}

  public exit(message: Object = { status: "cancelled" }): void {
    this.dialogRef.close(message);
  }
  public resetGame(): void {
    /*call rsesetGame from server*/
    this.dialogRef.close();
    this.router.navigate(["/admin/"]) // tslint:disable-next-line:no-any Generic error response
    .catch((reason: any) => {
      throw new Error(reason);
    });
  }
}
