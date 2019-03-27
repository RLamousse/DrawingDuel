import { Component, Inject } from "@angular/core";
import {MatDialogRef, MAT_DIALOG_DATA} from "@angular/material/dialog";
import {IDialogData} from "../../../../../common/dialog-data-interface/IDialogData";

@Component({
  selector: "app-end-game-notif",
  templateUrl: "./end-game-notif.component.html",
  styleUrls: ["./end-game-notif.component.css"],
})
export class EndGameNotifComponent {

  public constructor(protected dialogRef: MatDialogRef<EndGameNotifComponent>,
                     @Inject(MAT_DIALOG_DATA) public data: IDialogData,
                    ) {}

  public exit(): void {
    this.dialogRef.close();
  }

}
