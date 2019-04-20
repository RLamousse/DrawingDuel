import {Component, Inject} from "@angular/core";
import {MatDialogRef, MAT_DIALOG_DATA} from "@angular/material";
import {IDialogData} from "../../../../common/dialog-data-interface/IDialogData";

@Component(
  {
    selector: "app-kick-dialog",
    templateUrl: "./kick-dialog.component.html",
    styleUrls: ["./kick-dialog.component.css"],
  })
export class KickDialogComponent {

  public constructor(protected dialogRef: MatDialogRef<KickDialogComponent>,
                     @Inject(MAT_DIALOG_DATA) public data: IDialogData) {
  }

  public exit(): void {
    this.dialogRef.close();
  }

}
