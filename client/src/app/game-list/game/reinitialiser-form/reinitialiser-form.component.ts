import { Component, Inject } from "@angular/core";
import {MatDialogRef, MAT_DIALOG_DATA} from "@angular/material/dialog";
import {Router} from "@angular/router";
import {IDialogData} from "../../../../../../common/dialog-data-interface/IDialogData";

@Component({
  selector: "app-reinitialiser-form",
  templateUrl: "./reinitialiser-form.component.html",
  styleUrls: ["./reinitialiser-form.component.css"],
})
export class ReinitialiserFormComponent {

  public constructor (protected dialogRef: MatDialogRef<ReinitialiserFormComponent>,
                      @Inject(MAT_DIALOG_DATA) public data: IDialogData,
                      private router: Router) {/*vide*/}

  public exit(message: Object = { status: "cancelled" }): void {
    this.dialogRef.close(message);
  }
  public resetGame(): void {
    /*call deleteGame from server*/
    this.dialogRef.close();
    this.router.navigate(["/admin/"]);
  }
}
